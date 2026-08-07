import hashlib
import random
from typing import List, Dict

def deterministic_fisher_yates_fallback(
    exam_id: str, 
    target_counts: Dict[str, int], 
    candidate_pool: List[dict]
) -> List[dict]:
    """
    Deterministic fallback logic (Condition C) using a seeded Fisher-Yates shuffle.
    This guarantees an exam is generated even if the AI pipeline fails.
    """
    # 1. Stratification: Group by subject
    stratified_pool = {}
    for q in candidate_pool:
        subj = q.get("subject", "Unknown")
        if subj not in stratified_pool:
            stratified_pool[subj] = []
        stratified_pool[subj].append(q)
    
    final_questions = []
    
    # 2. Seeded Shuffling & Selection
    for subject, required_count in target_counts.items():
        subject_pool = stratified_pool.get(subject, [])
        
        # Create a deterministic seed for this subject
        seed_str = f"{exam_id}_{subject}"
        seed_val = int(hashlib.sha256(seed_str.encode("utf-8")).hexdigest(), 16)
        
        prng = random.Random(seed_val)
        
        # Fisher-Yates shuffle
        n = len(subject_pool)
        for i in range(n - 1, 0, -1):
            j = prng.randint(0, i)
            subject_pool[i], subject_pool[j] = subject_pool[j], subject_pool[i]
            
        # Select the required amount
        selected = subject_pool[:required_count]
        final_questions.extend(selected)
        
    return final_questions
