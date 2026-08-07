import os
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
import json

from models import ExamAuditReport
from prompts import SYSTEM_PROMPT, REFINEMENT_PROMPT
from fallback import deterministic_fisher_yates_fallback

class ExamState(TypedDict):
    exam_id: str
    target_counts: dict
    target_difficulty: dict
    candidate_pool: List[dict]
    current_selection: List[dict]
    audit_report: dict
    retry_count: int

def initial_selection(state: ExamState):
    # Take naive exact counts from the buffer just to give LLM a starting point
    current_selection = []
    # (In a real scenario, this would be a slightly smarter first pass)
    for subj, count in state['target_counts'].items():
        subj_pool = [q for q in state['candidate_pool'] if q.get('subject') == subj]
        current_selection.extend(subj_pool[:count])
    
    return {"current_selection": current_selection, "retry_count": 0}

def llm_auditor(state: ExamState):
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.0)
    structured_llm = llm.with_structured_output(ExamAuditReport)
    
    # In a real implementation, you'd serialize current_selection more cleanly
    selection_str = json.dumps(state['current_selection'], indent=2)
    
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Please audit this selection:\n{selection_str}")
    ]
    
    try:
        report = structured_llm.invoke(messages)
        # Convert pydantic model to dict for state
        audit_report = report.model_dump()
    except Exception as e:
        # Fallback if API completely fails during call
        audit_report = {"is_approved": False, "balance_score": 0.0, "flagged_issues": [f"API Error: {str(e)}"], "final_questions": []}

    return {"audit_report": audit_report}

def validation_node(state: ExamState):
    report = state['audit_report']
    if report.get('is_approved') and report.get('balance_score', 0) >= 0.8:
        return "end"
    elif state['retry_count'] < 2:
        return "refine"
    else:
        return "fallback"

def refinement(state: ExamState):
    # Increment retry count and use human prompt to refine
    new_retry_count = state['retry_count'] + 1
    # For now, just pass the remaining pool back (placeholder logic)
    
    return {"retry_count": new_retry_count}

def fallback_node(state: ExamState):
    final_questions = deterministic_fisher_yates_fallback(
        exam_id=state['exam_id'],
        target_counts=state['target_counts'],
        candidate_pool=state['candidate_pool']
    )
    
    fallback_report = {
        "is_approved": False,
        "balance_score": 0.0,
        "flagged_issues": ["Emergency Fallback Triggered due to repeated LLM failure."],
        "final_questions": final_questions
    }
    return {"audit_report": fallback_report}

# Build the Graph
workflow = StateGraph(ExamState)
workflow.add_node("initial_selection", initial_selection)
workflow.add_node("llm_auditor", llm_auditor)
workflow.add_node("refinement", refinement)
workflow.add_node("fallback_node", fallback_node)

workflow.set_entry_point("initial_selection")
workflow.add_edge("initial_selection", "llm_auditor")
workflow.add_conditional_edges(
    "llm_auditor",
    validation_node,
    {
        "end": END,
        "refine": "refinement",
        "fallback": "fallback_node"
    }
)
workflow.add_edge("refinement", "llm_auditor")
workflow.add_edge("fallback_node", END)

exam_auditor_app = workflow.compile()
