---
name: conversations
description: Conventions for recording human-AI conversations in pidgin. Use when saving a conversation, reading past conversations, or working with the conversations/ directory.
---

# Conversations

Records of human-AI exchanges, preserved verbatim.

## Format

```markdown
# Title
date: 2026-01-31T10:00:00-08:00
follows: previous-conversation-name  (optional)

---

## user

What they said, verbatim.

## assistant

What was said back, verbatim.
```

## Conventions

- **Location**: `conversations/`
- **Naming**: topic-based, not numbered (`pidgin-origin.md`, not `01-origin.md`)
- **Date**: ISO 8601 with timezone offset (`YYYY-MM-DDTHH:MM:SS±HH:MM`)
- **Order**: determined by `date` field (must normalize to instant for comparison)
- **Content**: verbatim, no summary or interpretation
- **Boundaries**: save at natural breaks, when a thread feels complete
- **Continuation**: append-only; can save partial conversations and add more turns later

## Generating timestamps

When saving a conversation, use current local time with offset:
```bash
date +"%Y-%m-%dT%H:%M:%S%z" | sed 's/\(..\)$/:\1/'
```

This produces `2026-02-01T10:30:00-08:00` — preserving both the instant and local context.

## Retrieval

When the user wants to pick up where they left off:

- **"read the last conversation"** → immediately read the most recent file in `conversations/` (by modification time)
- **"read [name]"** → immediately read the referenced conversation file
- **"what were we talking about?"** → same as reading the last conversation

These are quick actions. Don't explain or ask for clarification—just read the file.

## Properties

- Human-readable without tooling
- Parseable by simple scripts
- Git-friendly (diffable, mergeable)
