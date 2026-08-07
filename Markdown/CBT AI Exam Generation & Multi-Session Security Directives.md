## CBT Al Exam Generation & Multi-Session Security Directives

## Executive Overview

This document specifies the strict rules, mathematical constraints, and algorithmic directives governing the Just-In-Time (JIT) Al Exam Generation Engine. It ensures that exam papers compiled for multi-shift Computer-Based Tests (CBT) maintain rigorous academic standards, strict cross-session uniqueness (> 80%), terminal-level anti-copying randomization, and cross-shift score normalization.

## 1. Exam Blueprint & Subject Distribution Rules

The Al pipeline must strictly enforce the target exam structure. Questions are queried and selected according to predefined subject quotas and section splits.

## 11 NEET UG Standard Blueprint (180 Questions / 720 Marks)

|

| Subject | Sub-Section / Domain | Total Questions | Target Easy (~35%) | Target Medium (~45%) |

Target Hard (~20%) | | Physics | Mechanics, Electrodynamics, Optics, Modern Physics |

9 || Chemistry | Physical, Organic, Inorganic Chemistry | 45]16|20| 9 | | Biology (Botany) | Plant

| 20 | 9 | | Biology (Zoology) | Human Physiology, | 9 | | TOTAL | | 180 Questions | 64 | 80 | 36 |

Physiology, Cell Biology, Genetics, Ecology | Reproduction, Evolution, Biotechnology |

| 20 |

## 1.2 Sub-Topic Weightage Preservation

For every generated paper, subject topic distribution must not deviate by more than from the target weightage matrix:

- « Physics: Mechanics (30%), Electrodynamics (25%), Modern Physics (15%), Thermodynamics (15%), Optics/Waves (15%).

- « Chemistry: Organic (33.3%), Inorganic (33.3%), Physical (33.3%).

- «Biology: Human Physiology (20%), Genetics & Evolution (20%), Plant Physiology (15%), Ecology (15%), Cell Biology (15%), Diversity/Other (15%).

## 2. Multi-Session Uniqueness Engine (>> 80% Differentiation Rule)

For competitive exams held across multiple shifts (e.g., Morning and Evening shifts across multiple days), papers must be sufficiently distinct to prevent leakages and ensure fairness.

```
[ Global Question Bank (MongoDB Encrypted) 1]
v
[ Query Pool: Exclude Question IDs from Previous Shift Log ]
```


```
v
[ Check Uniqueness Metric: Unseen Questions >= 80% ] —= (Fail) — [ Swap &
| (Pass: Overlap <= 20%)
v
[ Verify Allowed 20% Overlap uses Parametric Variants ]
v
[ Deliver Final Session Master Payload to Redis ]
```

## 21 The 80% Differentiation Constraint

For any given session Sy, within an exam cycle:

- 1. Unseen ID Quota (> 80%): At least 80% (144 out of 180 questions) of the questions in session Sj, must have never been used in any previous session the same exam cycle. . . . , Sk_1) during

- 2. Parametric Variant Rule for Overlapping Items (< 20%): The remaining 20% (36 questions or fewer) that test identical core concepts must be parametric variants (e.g., modified numerical constants, inverted chemical reaction parameters, or rephrased scenario conditions).

## 2.2 Global Session History Logging

After an exam session completes, all used question IDs are appended to the used_questions_registry in MongoDB:

```
{
"exam_year": 2026,
"session_id":
"generated_at": "2026-07-24T08:45:00Z",
"question_ids": ["q_phy_1@4", "q_chem_892", "q_bot_332", "..."]
```

When generating paper Sy, the Python FastAPI microservice injects the question_ids list from previous shifts into the MongoDB \$nin (Not In) filter query.

## 3. In-Session Terminal Series Randomization (Anti-Copying Rules)

To eliminate side-by-side cheating in exam labs without creating multiple static master papers, the system enforces Deterministic Terminal-Level Seeded Shuffling.


```
Master Session Paper (180 Questions)
f— Terminal @1 (Roll: 101) —» Seed = SHA256("EXAM_01" + "10:
L— Terminal 02 (Roll: 102) —» Seed = SHA256("EXAM_01" + "10:
```

## 31 Question Order Permutation

- « Each candidate terminal calculates a unique cryptographic seed:

Seed = SHA-256(Exam ID + Student Roll Number + Session Salt)

- « The React client executes a Seeded Fisher-Yates Algorithm using this seed to reorder the 180 questions locally in RAM.

- « Result: Candidate A at Terminal 1and Candidate B at Terminal 2 sit next to each other, but Candidate A's Question #1is Candidate B's Question #41.

## 3.2 Option Index Permutation

- « For every multiple-choice question, the four option choices (A, B, C, D) are also shuffled deterministically using the terminal seed.

- « Result: Even if two candidates manage to see the same question text on screen, Option (A) on Terminal 1 corresponds to Option (C) on Terminal 2.

## 4. Difficulty & Cognitive Balance Rules

Every session paper must follow an identical cognitive difficulty distribution to maintain uniform standards across all test days.

## 41 Difficulty Classification Matrix

| Category | Definition | Target Ratio | Marks Allocation | | Easy | Single-step formula application / direct factual recall. | 35% (4-2%) | ~252 Marks | | Medium | Multi-step calculation / concept synthesis / diagram analysis. | 45% (2%) | ~324 Marks | | Hard | Novel problem context / multi-

concept integration / rigorous math. | 20%

| ~144 Marks |

## 4.2 LangChain + Gemini Audit Guidelines

During the JIT 15-minute generation window, the Gemini Auditor Agent checks candidate questions against the following rules:

- 1. Ambiguity Rejection: Reject any question where two options could be argued as correct.

- 2. Semantic Redundancy Rejection: If two candidate questions test the exact same formula (eg. FE = mc?) using the same steps, discard one and request a replacement from the buffer.


- 3. Option Distractor Quality: Reject questions where incorrect options (distractors) are obviously invalid or grammatically mismatched with the prompt.

## 5. Cross-Shift Normalization Rules

Because different sessions feature > 80% different questions, slight variations in raw paper difficulty are statistically inevitable. To ensure total candidate equity, final results are processed using Equi-percentile Normalization.

## 51 Percentile Calculation Formula

For candidate ¢ in session Sy, the percentile score P; is calculated as:

Where:

- « m; =Total number of candidates in session Sj. who scored less than or equal to candidate 7's raw score.

- «Nj, =Total number of candidates who appeared in session Sj.

## 5.2 Merit List Rule

- « All AIR (All India Ranks) or merit positions are computed using the Percentile Scores rounded to 7 decimal places, never the raw marks.

- Raw marks are used strictly inside an individual session to establish relative rank within that shift.

## 6. Cryptographic & Operational Constraints

- 1. In-Memory Decryption Window: Raw question text must remain encrypted in MongoDB (AES-256-GCM) and decrypted only inside FastAPI RAM 15 minutes prior to session launch ( t — 15 mins).

- 2. Redis TTL Limit: The final audited master paper stored in Redis must carry a strict Time-To- Live (TTL):

- 3. RAM Memory Flush Directive: Once the audited master paper is encrypted and sent to Redis, FastAPI must explicitly run del decrypted_pool plaintext data from server RAM. gc.collect()

- 4. Audit Hash Link: Every generated session paper is hashed using SHA-256 and recorded in the MongoDB audit log to verify payload integrity post-exam.

## 7. Execution Checklist for Al Pipeline


| Step | Responsible Layer | Rule Enforced | | 1. Aggregation Query | PyMongo / FastAPI | Fetch 1.5x buffer matching subject counts & excluding previous shift IDs (IN IN filter). | | 2. Decryption | crypto_utils.py | Decrypt buffer strictly in RAM using MASTER_ENCRYPTION_KEY .||3. LangChain Audit | Gemini 2.5 Flash | Select exactly 180 questions, balance 35/45/20 difficulty, remove semantic duplicates. | | 4. Pydantic Validation | Pydantic Schema | Validate exact count

compliance (45 Phy / 45 Chem / 45 Bot / 45 Zoo). | | 5. Session

crypto_utils.py |

Re-encrypt final 180-question master paper payload. | | 6. Redis Caching | Redis Cache | Save

with TTL = Exam Duration + 15m. || 7. Seeded Client Render |

under

React Frontend | Apply Seeded Fisher-Yates shuffle per candidate terminal using student roll number. |
