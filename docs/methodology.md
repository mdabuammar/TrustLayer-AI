# Trust Score & Hallucination Detection Methodology

This document details the mathematical model and heuristic rules used by the **Trust Engine** to evaluate answer veracity.

---

## The Veracity Challenge in RAG

Typical RAG pipelines accept context, send it to an LLM, and output the response. However, LLMs are prone to **hallucinations** (making up facts not in the context) or **extrapolations** (stretching factual context too far).

TrustLayer AI implements a local post-generation verification loop that compares the generated text back against the source passages using sentence embeddings.

---

## Scoring Logic Breakdown

The Trust Engine algorithm follows these sequential rules:

```
                  ┌──────────────────────┐
                  │   Generated Answer   │
                  └──────────┬───────────┘
                             │
                    [Is Answer Empty?]
                    ├── Yes ──> Score: 0 | Risk: High
                    └── No
                             │
             [Contains Refusal Statement?]
             ├── Yes ──> Score: 50 | Risk: Low (Correct refusal)
             └── No
                             │
                 [Are Chunks Available?]
                 ├── No ───> Score: 0 | Risk: High
                 └── Yes
                             │
            Compute Cosine Similarity (Embeddings)
            Between Generated Answer & Each Chunk
                             │
                    Max Similarity (MaxSim)
                             │
                Base Score = MaxSim * 100
                             │
            Apply Corroboration Boost (+3 per chunk)
            If similarity to other chunks >= 0.50 (Max +10)
                             │
                    Final Trust Score
                             │
                 Evaluate Risk Boundaries:
                 - Score >= 70: Low Risk
                 - Score 40-69: Medium Risk
                 - Score < 40:  High Risk
```

### 1. Edge Case Handling

#### Empty Answers
- If the answer text is empty, missing, or whitespace-only:
  - `trust_score = 0`
  - `risk_level = "High"`
  - `warnings = ["Generated answer is empty."]`

#### Refusal to Answer (Correct Refusals)
- The system instructions require the LLM to reply exactly: *"I could not find enough evidence in the uploaded documents."* if the context lacks facts.
- If this phrase (case-insensitive) is detected in the response:
  - `trust_score = 50` (neutral baseline, since no new facts are claimed)
  - `risk_level = "Low"` (the model correctly declined to hallucinate)
  - `warnings = []`

#### Missing Retrieval Context
- If no chunks were retrieved, the answer cannot be verified:
  - `trust_score = 0`
  - `risk_level = "High"`
  - `warnings = ["No context chunks were retrieved to verify the answer."]`

---

## 2. Cosine Similarity & Embedding Alignment

If the answer is a normal response and context exists:

1. **Embedding Generation**: The generated answer and all retrieved chunks are vectorized in a single batch using the local `all-MiniLM-L6-v2` Sentence-Transformer model on CPU.
2. **Cosine Similarity**:
   $$\text{Similarity}(A, C_i) = \frac{A \cdot C_i}{\|A\| \|C_i\|}$$
   Where $A$ is the answer embedding and $C_i$ is the embedding of chunk $i$.
3. **Base Score Mapping**:
   $$\text{Base Score} = \min(100, \max(0, \lfloor \max_i(\text{Similarity}(A, C_i)) \times 100 \rfloor))$$
   We map the maximum cosine similarity to a 0-100 scale. If the answer is semantically close to at least one chunk, it gets a high base score.

---

## 3. Corroboration Boosting

An answer is stronger if supported by multiple parts of the document.
- We count how many chunks have a similarity to the answer $\ge 0.5$.
- For each additional corroborating chunk beyond the first, we add a boost:
  $$\text{Boost} = \min(10, (\text{Corroborating Chunks} - 1) \times 3)$$
- The final score is:
  $$\text{Trust Score} = \min(100, \text{Base Score} + \text{Boost})$$

---

## 4. Risk Level Thresholds

We categorize hallucination risk into three tiers based on the final score:

- **Low Risk (Score $\ge 70$)**: Strong credibility. The answer matches the retrieved passages.
- **Medium Risk (Score $40 - 69$)**: Moderate credibility. The answer has some gaps or is only partially supported by retrieved chunks.
- **High Risk (Score $< 40$)**: Extreme hallucination danger. The generated answer deviates significantly from the source passages.

---

## Why This Heuristic Approach?

1. **CPU Speed**: sentence-transformer embeddings run locally in milliseconds on regular laptops.
2. **Deterministic & Explainable**: There is no secondary LLM evaluator (like GPT-4-as-a-judge), which is slow, expensive, and non-deterministic.
3. **Traceability**: The exact math can be verified, and the user can see exactly which chunk text drove the score.
