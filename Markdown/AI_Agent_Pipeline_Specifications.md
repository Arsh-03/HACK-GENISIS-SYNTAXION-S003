# AI Agent Pipeline Specifications

This document details the LangChain/LangGraph architecture, prompt engineering, API schemas, and fallback logic for the AI-driven Computer-Based Testing (CBT) generation engine.

## 1. LangGraph Architecture (Auditor Agent Pipeline)

The generation process relies on a state graph executed via LangGraph. 

### State Definition
```python
from typing import TypedDict, List
from pydantic import BaseModel

class ExamState(TypedDict):
    exam_id: str
    target_counts: dict
    target_difficulty: dict
    candidate_pool: List[dict] # Original 1.5x buffer pool
    current_selection: List[dict] # Currently selected questions
    audit_report: dict # Gemini feedback report
    retry_count: int
```

### Graph Nodes
1. **Initial Selection (Deterministic):** Picks exact target counts based on difficulty distribution from the buffer.
2. **LLM Auditor (Gemini 2.5 Flash):** Evaluates `current_selection` against ambiguity, semantic overlap, and difficulty rules.
3. **Validation & Decision:** Validates Gemini's structured output using Pydantic. If `is_approved` is True and `balance_score` > 0.8, proceed to `End`. If False and `retry_count < 2`, route to `Refinement`. If `retry_count == 2`, route to `Fallback`.
4. **Refinement:** Replaces rejected questions with fresh ones from `candidate_pool` based on Gemini's feedback, increments `retry_count`, and loops back to LLM Auditor.
5. **Fallback (Fisher-Yates):** Applies a deterministic random selection if the LLM fails repeatedly.

## 2. Prompt Engineering Specifications

### 2.1 Main Auditor System Prompt
```text
You are an expert academic auditor and psychometrician for a national-level medical entrance exam (NEET).
Your task is to analyze a candidate set of 180 questions for an upcoming exam session and ensure it meets strict academic integrity rules.

Constraints & Rules:
1. Ambiguity: Ensure no question has multiple correct answers. Discard any question with confusing phrasing.
2. Semantic Duplication: Identify if any two questions test the exact same concept or use identical phrasing with only changed numbers. If found, reject one.
3. Distractor Quality: Ensure incorrect options are plausible but unambiguously incorrect.
4. Cognitive Balance: Ensure the overall paper aligns with the provided difficulty ratios: 35% Easy, 45% Medium, 20% Hard.

You must output your findings STRICTLY in the provided JSON schema.
```

### 2.2 Refinement Human Prompt (Condition B Retry)
```text
The previous question selection failed the audit due to the following flagged issues:
{flagged_issues}

We have removed the rejected questions. Here is the remaining `candidate_pool`:
{remaining_pool}

Please select replacement questions that fill the gaps without introducing new semantic duplicates or breaking the cognitive balance. Output the updated final question set matching the required counts.
```

## 3. API Payload Specifications (FastAPI)

### Request Schema
```python
from pydantic import BaseModel, Field
from typing import Dict, List

class GeneratePaperRequest(BaseModel):
    exam_id: str = Field(..., description="Unique identifier for the exam cycle.")
    required_counts: Dict[str, int] = Field(..., description="Subject-wise question quotas. e.g., {'Physics': 45, 'Chemistry': 45, 'Biology': 90}")
    target_difficulty_distribution: Dict[str, float] = Field(..., description="Target ratios for difficulty. e.g., {'Easy': 0.35, 'Medium': 0.45, 'Hard': 0.20}")
    previous_session_ids: List[str] = Field(default=[], description="List of previously generated session IDs in the same cycle to enforce the 80% Unseen Rule.")
```

### Output Schema (Gemini Structured Output)
```python
from pydantic import BaseModel, Field
from typing import List

class QuestionItem(BaseModel):
    id: str
    subject: str
    topic: str
    difficulty: str
    question_text: str
    options: List[str]
    correct_option_index: int
    media_url: str = ""

class ExamAuditReport(BaseModel):
    is_approved: bool = Field(description="True if questions are unique, unambiguous, and balanced")
    balance_score: float = Field(description="Quality rating score from 0.0 to 1.0 based on difficulty distribution")
    flagged_issues: List[str] = Field(description="Audit log of rejected duplicate/flawed questions")
    final_questions: List[QuestionItem] = Field(description="Final ordered verified exam question set")
```

## 4. Fallback Logic: Deterministic Fisher-Yates (Condition C)

If the LangChain pipeline fails entirely (e.g., Gemini API timeout, multiple schema validation failures), the system must never halt an exam launch. It immediately falls back to a deterministic, non-LLM algorithm:

### Algorithm Steps:
1. **Filter Unseen:** Pre-filter the MongoDB `candidate_pool` to include ONLY questions not used in previous sessions.
2. **Stratification:** Group the remaining pool strictly by Subject and Difficulty.
3. **Seeded Shuffling:** Initialize a pseudorandom number generator (PRNG) with a deterministic seed (e.g., `SHA256(exam_id + session_id)`).
4. **Fisher-Yates Selection:**
   - Iterate through each subject and difficulty bucket based on target quotas.
   - Use the seeded PRNG to perform a Fisher-Yates shuffle on the bucket.
   - Slice the exact required number of questions from the top of the shuffled bucket.
5. **Assembly:** Combine the sliced questions into the final 180-question list.
6. **Bypass Audit:** Mark `is_approved = False`, `balance_score = 0.0`, `flagged_issues = ["Emergency Fallback Triggered"]`.
7. **Proceed to Encryption:** The payload is instantly sent to Redis, ensuring candidate terminals receive the exam on time.
