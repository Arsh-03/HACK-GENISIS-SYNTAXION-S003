# Question JSON Encryption and DB Population Implementation Plan

## Purpose

This document defines how the question JSON files stored under [AI/Data](../../Data) should be validated, normalized, encrypted, and populated into MongoDB for the current CBT system.

The import flow must support the current chapter-based file structure across Physics, Chemistry, Botany, and Zoology while preserving auditability, tamper detection, and compatibility with the JIT paper-generation pipeline.

## Source Data Layout

The current source set is organized by subject folders:

1. `Data/Phy/Chapter01.json` through `Chapter20.json`
2. `Data/Chem/chapter01.json` through `chapter17.json`
3. `Data/Botany/Chapter01.json` through `Chapter20.json`
4. `Data/Zoology/Chapter01.json` through `Chapter12.json`

Each file contains an array of question records. The current sample format includes:

1. `sequence_id`
2. `subject`
3. `chapter_name`
4. `chapter_number`
5. `topic`
6. `difficulty`
7. `status`
8. `is_encrypted`
9. `plaintext_content`
10. `created_at`

The `plaintext_content` object contains:

1. `question_text`
2. `options`
3. `correct_option_index`
4. `media_url`

## Import Goal

The import pipeline should transform each JSON record into a MongoDB question document where:

1. The question text and answer content are encrypted at rest.
2. The record is hash-chained for tamper detection.
3. The document is queryable by subject, status, topic, difficulty, and chapter metadata.
4. The data is ready for JIT paper generation and terminal delivery.

## Recommended Import Strategy

Use a two-stage process:

1. Stage A: Validate and normalize the raw JSON files.
2. Stage B: Encrypt and upsert the normalized records into MongoDB.

This split keeps the process deterministic and makes it easier to rerun imports safely.

## Normalization Rules

### 1. Subject Mapping

Normalize folder names and subject values to the canonical subject names used by the exam engine:

1. `Phy` -> `Physics`
2. `Chem` -> `Chemistry`
3. `Botany` -> `Botany`
4. `Zoology` -> `Zoology`

### 2. Difficulty Mapping

The source files currently use mixed difficulty representations:

1. Strings such as `Medium` and `Hard`
2. Numeric values such as `0`

The importer should normalize all input into the canonical internal difficulty enum used by the system.

Use a single canonical scale for storage and downstream filtering:

1. `1` = Medium
2. `2` = Hard
3. `3` = Advanced

Suggested source-to-canonical mapping:

1. `Medium`, `0`, or `easy`-equivalent source tags -> `1`
2. `Hard`, `1`, or equivalent mid/high source tags -> `2`
3. `Advanced`, `2`, or equivalent top-tier source tags -> `3`

If a source file uses a subject-specific numeric convention, normalize it by the file's actual metadata and keep the canonical storage value consistent across all subjects.

If a record contains an unknown difficulty value, the importer should flag it for manual review instead of silently guessing.

### 3. Media URL Normalization

If `media_url` is `null`, store an empty string in the encrypted payload so the runtime schema stays consistent.

### 4. Status Normalization

Only import questions that are marked `APPROVED` unless a separate moderation workflow explicitly allows draft ingestion.

## Target MongoDB Document Shape

Each question should be written to the `questions` collection in this shape:

```json
{
  "sequence_id": 1,
  "subject": "Physics",
  "topic": "Dimensions and Dimensional Analysis",
  "difficulty": 1,
  "chapter_name": "Units and Measurements",
  "chapter_number": 1,
  "status": "APPROVED",
  "is_encrypted": true,
  "encrypted_content": {
    "ciphertext": "...",
    "iv": "..."
  },
  "previous_hash": "...",
  "current_hash": "...",
  "created_at": "...",
  "updated_at": "..."
}
```

## Encryption Rules

### 1. What to Encrypt

Encrypt only the sensitive payload fields:

1. `question_text`
2. `options`
3. `correct_option_index`
4. `media_url`

The metadata fields should remain plaintext for fast filtering and indexing:

1. `subject`
2. `topic`
3. `difficulty`
4. `chapter_name`
5. `chapter_number`
6. `status`

### 2. Algorithm

Use AES-256-GCM for encryption at rest.

Required outputs per record:

1. `ciphertext`
2. `iv`
3. Auth tag if the current crypto utility stores it separately

### 3. Key Handling

1. The master encryption key must come from environment variables or a KMS.
2. The key must never be written to the database.
3. Plaintext should exist only in memory during import.

## Hash Chaining Rules

Every imported document should carry a hash chain link.

Suggested behavior:

1. Compute `current_hash` from the normalized metadata plus encrypted payload.
2. Store the previous document hash in `previous_hash`.
3. If a record is modified later, the chain should break and be detectable during audit.

Suggested hash input fields:

1. `sequence_id`
2. `subject`
3. `topic`
4. `difficulty`
5. `chapter_name`
6. `chapter_number`
7. `status`
8. `encrypted_content.ciphertext`
9. `encrypted_content.iv`

## Validation Rules

Before any record is written to MongoDB, the importer should validate:

1. The JSON file parses successfully.
2. The top-level value is an array.
3. Every record includes required fields.
4. `plaintext_content.question_text` is a non-empty string.
5. `plaintext_content.options` contains exactly 4 options.
6. `correct_option_index` is within bounds.
7. `chapter_number` is numeric.
8. `status` is valid.
9. `difficulty` can be normalized.

Records that fail validation should be quarantined into a rejected import report instead of partially inserted.

## Import Workflow

### Step 1. Scan the Data Folder

Walk through each subject directory and collect all JSON files.

### Step 2. Parse and Validate

Load each file as JSON and validate every record individually.

### Step 3. Normalize

Apply subject mapping, difficulty mapping, and null handling for media URLs.

### Step 4. Encrypt

Convert the plaintext payload into AES-256-GCM ciphertext using the master key.

### Step 5. Hash

Generate `current_hash` and link it to the prior record hash.

### Step 6. Upsert

Insert or update the record in MongoDB.

### Step 7. Audit

Store an import audit log that includes counts of inserted, updated, skipped, and rejected records.

## Suggested Operational Modes

### 1. Dry Run

Parse and validate all files without writing anything to MongoDB.

Use this mode to detect schema issues and difficulty mismatches before import.

### 2. Full Import

Encrypt and write all valid records to MongoDB.

### 3. Incremental Sync

Only import new or changed chapter files and update the affected records.

## Error Handling Plan

### Parse Failure

If a JSON file is invalid, stop that file and record the issue in the import report.

### Schema Mismatch

If a question record is missing required fields, quarantine it for manual correction.

### Encryption Failure

If encryption fails, do not write a partially transformed record.

### Hash Conflict

If hash generation fails or a duplicate hash appears unexpectedly, stop and investigate before proceeding.

### Duplicate Sequence IDs

If two records in the same subject area share the same `sequence_id`, the importer should either reject the second record or remap it explicitly, depending on your chosen policy.

## Suggested Mongo Indexes

Keep the query path efficient for the JIT generator and admin review tools.

Recommended indexes:

1. `{ sequence_id: 1 }` unique
2. `{ subject: 1, status: 1, difficulty: 1 }`
3. `{ chapter_name: 1, chapter_number: 1 }`
4. `{ current_hash: 1 }` unique

## Recommended Backend Entry Point

Add an import command or endpoint that can run this workflow safely.

Suggested options:

1. CLI script for bulk import.
2. Admin-only API endpoint for controlled ingestion.
3. Scheduled job for future chapter refreshes.

For initial population, a CLI import is the safer choice because it is easier to rerun and audit.

## Suggested CLI Flow

```text
python import_questions.py --source AI/Data --mode dry-run
python import_questions.py --source AI/Data --mode import --subject-map canonical
```

## Suggested Admin Controls

If you later expose this through the UI, the admin workflow should include:

1. Upload or point to a folder of JSON files.
2. Preview validation results.
3. Choose dry-run or import.
4. View rejected records.
5. Confirm encryption and hash-chain completion.

## Relevance to Existing System

This import plan matches the current architecture because it supports:

1. MongoDB encrypted question storage.
2. Fast subject and difficulty filtering.
3. Multi-session uniqueness enforcement.
4. FastAPI JIT paper generation.
5. Redis caching of prepared exam payloads.

## Acceptance Criteria

The import process is complete when:

1. Every approved JSON record can be encrypted and stored in MongoDB.
2. The source data is normalized into the system’s canonical schema.
3. The import is repeatable and idempotent.
4. The hash chain and encryption fields are written consistently.
5. The JIT pipeline can query the imported records without schema mismatch.

## Recommended Next Step

Implement the importer as a small CLI utility first, then connect it to an admin dashboard workflow if you want a UI-driven ingestion path later.