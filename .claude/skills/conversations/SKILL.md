---
name: conversations
description: Conventions for recording human-AI conversations in pidgin. Use when saving a conversation, reading past conversations, or working with the conversations/ directory.
---

# Conversations

Records of human-AI exchanges, preserved verbatim.

## Format

```markdown
# Title
date: YYYY-MM-DD
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
- **Order**: filesystem creation time or `follows:` field
- **Content**: verbatim, no summary or interpretation
- **Boundaries**: save at natural breaks, when a thread feels complete
- **Continuation**: append-only; can save partial conversations and add more turns later

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
