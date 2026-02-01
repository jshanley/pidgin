# Artifacts and the Stream
date: 2026-02-01T13:35:00-08:00
follows: tanstack-router-and-layout

---

## user

review the conversation about tanstack router and especially the part nearer the beginning about the requirements for the scrolling implementation. we then used tanstack but didn't follow up on making sure the behavior matched. it reminds me of how the whole project began, talking about needing to encode the intent

## assistant

The implementation looks correct:

**Scroll spy → `replace: true`** (Reader.jsx:35) — URL updates as you scroll, no history pollution
**Sidebar click → no replace option** (ConversationList.jsx:11) — adds to history stack

TanStack defaults to `pushState` when `replace` isn't specified, so the original intent is preserved.

But you're pointing at something deeper. The old `useUrlHash` hook (still in the file, now unused) had the intent explicit in the API:

```javascript
navigate(id, addToHistory = true)  // the boolean made it clear
```

Now it's implicit in TanStack's `replace: true` option. The behavior matches but the *encoding of the intent* is less visible.

The origin conversation established a core principle: **maintain the strand between intent and implementation**. The words should stay connected to what they become.

In the TanStack conversation, the intent was clear:

```
Scroll-driven URL updates → replaceState (URL stays current, no history pollution)
Explicit navigation → pushState (back button takes you to last clicked location)
```

The current implementation **does** honor this, but the **strand is thin**. The only trace of the original intent is a comment: `// Update URL when scroll spy detects new section (replaceState behavior)`. Compare that to the old `useUrlHash` hook which had `addToHistory = true` — the intent was *in the API*.

This is exactly what the origin conversation warned about:

> "The connecting strand breaks. The non-programmer says 'track what users do' and then code appears and the relationship between their words and the code is... invisible."

The intent was:
- **back button = meaningful** (only explicit clicks, not scroll)
- **URL = shareable bookmark** (always current section)
- **scroll = fluid** (doesn't pollute history)

Those concepts exist in the code, but you'd need to already understand routers and history APIs to see them. The strand could be strengthened.

## user

lets reflect. we have raw conversations as one level. we talked a lot about distillation. that shows up occasionally inline in conversations but isn't directly searchable. we went on a bit of a side quest about semantic indexing that we haven't closed the loop on. then we brought in a separate type of artifact, librarian readings. distillations and readings are both separate from the stream but related to it. they are unified in the word "artifact" -- I think it's time we figure out where artifacts fit in our model

## assistant

Here's what I see:

**The stream:**
- Conversations — verbatim, temporal, the primary record

**Things that emerge from the stream:**
- **Distillations** — condensed insights, currently inline or absent
- **Readings** — librarian reflections, stored separately in `.librarian/`
- **Atoms** — named concepts that recur (the semantic indexing we started)

The unfinished business: atoms were meant to be the searchable index. You could grep for "strand" and find everywhere that concept appears. But they're currently just highlights in the UI, not a queryable layer.

**A possible model:**

```
conversations/        ← the stream (immutable, temporal)
artifacts/            ← things derived from the stream
  distillations/      ← compressed summaries
  readings/           ← librarian reflections
  crystals/           ← named concepts with references back
```

Each artifact type has:
- A link to its source (which conversation, which turn)
- Its own format suited to its purpose
- Searchability

The distinction from the marginalia problem: artifacts aren't in the margins. They're **promoted** — pulled out, given stable addresses, made first-class.

The stream stays raw. Artifacts are the strand maintenance system.

## user

distillations and crystals seem too similar as words. I'm not sure "artifacts" needs to be further broken down at all. an artifact should be self contained. That's all that the system really needs to know about it. That's enough to make certain kinds of decisions, for example, unlike with the corpus you can have a reasonable expectation that an artifact will be of a manageable size. For the human that means small enough of an idea or potent enough of a compression that the idea can fit in their working memory.. and analagously for the model, something that fits nicely in context window.

## assistant

You're right. I over-complicated it.

**Conversations** — the stream, unbounded, temporal

**Artifacts** — self-contained, bounded

That's the cut. An artifact is anything that stands alone. The system doesn't need to know *what kind* — only that it's:
- Complete in itself
- Small enough to hold (working memory / context window)
- Linked to its source when relevant

Whether it's a distillation, a reading, a diagram, a named concept — those are just flavors. The structural property is **self-containment**.

This also resolves the "checkable" question from the origin conversation. Claude can verify an artifact against its source because an artifact is right-sized by definition. You can't check "track what users do" against 15 files. You *can* check a single artifact that captures one idea.

So:
```
conversations/   ← stream
artifacts/       ← bounded units that emerge from the stream
```

The semantic indexing question becomes: how do you find artifacts? That's metadata, search, links — not a separate category.

## user

when you reflected earlier in this conversation that was a kind of artifact

## assistant

Yes. That passage — the summary of stream vs. artifacts — emerged mid-conversation. It was self-contained. You could lift it out and it would still make sense.

So artifacts aren't necessarily separate files. They can crystallize *within* the stream. The conversation flows, and then something precipitates out — a bounded thing.

This reframes the problem. It's not about where artifacts *live*. It's about:
- Recognizing when one has formed
- Marking it (or extracting it)
- Making it findable

The stream contains artifacts. They're in there, inline, but currently invisible to search. You'd have to read the whole conversation to find that reflection.

The semantic indexing question returns: how do you surface the bounded things inside the unbounded stream?

## user

but there needs to be a process of pointing at. that's the whole point. the reason for creating a directory of artifacts is to point at it and say "this is a thing" -- it's ok if that thing is also in the stream. is it the duplication that would bother you?

## assistant

No, the duplication doesn't bother me. You've clarified something.

The artifact file *is* the pointing. Creating it is the act of saying "this is a thing." Whether it duplicates content from the stream or just references it — that's secondary. The file's existence is the declaration.

So:
- Stream flows
- Something precipitates
- You create an artifact (copy it out, or just link to it)
- Now it's findable, because the directory is a collection of "things that are things"

The `artifacts/` directory becomes an index of bounded units. Some might be full copies. Some might be pointers with a sentence of context. Doesn't matter. The structure says: *here are the things we've marked as things*.

This also means artifacts can be created retroactively. You read an old conversation, recognize a precipitate, point at it. The stream doesn't change. The artifact directory grows.

## user

yes. something tells me I've created a monster in the future. but lets start with it

## assistant

The monster is a problem for future-you. Present-you gets to start clean.

Created `artifacts/` with the first precipitate: `stream-and-artifacts.md` — pointing back to this conversation, containing the condensed idea.
