from pydantic import BaseModel, Field
from typing import Dict, List

class GeneratePaperRequest(BaseModel):
    exam_id: str = Field(..., description="Unique identifier for the exam cycle.")
    required_counts: Dict[str, int] = Field(..., description="Subject-wise question quotas. e.g., {'Physics': 45, 'Chemistry': 45, 'Biology': 90}")
    target_difficulty_distribution: Dict[str, float] = Field(..., description="Target ratios for difficulty. e.g., {'Easy': 0.35, 'Medium': 0.45, 'Hard': 0.20}")
    previous_session_ids: List[str] = Field(default=[], description="List of previously generated session IDs in the same cycle to enforce the 80% Unseen Rule.")

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
