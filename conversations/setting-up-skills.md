# Setting Up Skills
date: 2026-02-01
follows: atoms-and-scales

---

## user

lets talk about commands. I noticed they only integrate into claude code when I add them to my user-level ~/.claude folder. the ones I add in a specific project don't integrate into the claude session as slash commands

## assistant

That's an interesting observation. Let me take a look at how your commands are structured in both locations to understand the difference.

After investigating, I found a `skills` folder rather than `commands` at the user level. The skill format uses a `SKILL.md` file with YAML frontmatter (`name` and `description`). The frontmatter is what registers it as an available slash command.

The key structure is:
```
~/.claude/skills/<skill-name>/SKILL.md
```

For project-level skills, it should work the same way at `.claude/skills/` in your project root. A few things to check:

1. **Directory name**: Should be `.claude/skills/`, not `.claude/commands/`
2. **File must be `SKILL.md`** (capitalized) with YAML frontmatter
3. **Frontmatter format**:
   ```yaml
   ---
   name: my-skill
   description: What the skill does and when to invoke it.
   ---
   ```

## user

let's setup a project-level skill about conversations. I'll need you to do a little research on how skills work in the latest claude docs. I want the skill to be minimal and just teach claude some conventions. read the existing conversations, particularly the first one about pidgin origins and the second one on structure.

## assistant

After researching the Claude Code docs and reading the conversations, I created `.claude/skills/conversations/SKILL.md`.

Key points from my research on skills:

1. **Project-level skills work the same as user-level** - path is `.claude/skills/<name>/SKILL.md`
2. **The old `.claude/commands/` still works** but skills are the newer approach with more features
3. **Discovery**: Claude Code scans both `~/.claude/skills/` and `.claude/skills/` at project root
4. **Frontmatter matters**: `name` becomes the slash command (if user-invocable), `description` is what Claude uses to decide when to load it

The skill captures conventions:
- Location: `conversations/`
- Naming: topic-based, not numbered
- Order: filesystem creation time or `follows:` field
- Content: verbatim, no summary
- Format: markdown with YAML frontmatter, `## user` / `## assistant` delimiters

## user

oh, but what if the actions are implicit. if the user says "save the conversation" this skill should be invoked

## assistant

Good point. Updated it to be model-invocable so Claude loads it when you ask to save conversations. Removed `user-invocable: false` - now Claude will automatically load the skill when you say things like "save this conversation" or "look at past conversations."

## user

we should be able to also record part of a conversation and add more to it later. it should be append-only but possible. for example, I want to restart claude, but I don't want you to lose this conversation, so why don't you record this much and then we'll pick it back up on the other side

## assistant

Recorded. The conversation is saved in `conversations/setting-up-skills.md`. Pick it back up anytime.

---

*session break*

---

## user

welcome back. read conversations/setting-up-skills.md

## assistant

Welcome back. We left off discussing append-only conversation recording - the ability to save a partial conversation and continue it later.

The skill was set up for model-invocation so Claude loads it when you mention saving conversations. The open thread: how to handle continuation - saving checkpoints that can be appended to across sessions.

What's next?

## user

the action of picking back up should be encoded in the skill. in a new session the user will often ask to review the last conversation, or a recent one. those concepts: (1) reading the latest conversation (2) reading a conversation that was referenced - those are important and should be promptly achieved by the assistant

## assistant

Added a **Retrieval** section to the skill. The key instruction: these are quick actions—just read, don't ask or explain.

## user

it's working now, I can invoke the skill with a slash command. good work. record the conversation and finish it

## assistant

Recorded and complete.
