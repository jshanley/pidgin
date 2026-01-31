# Pidgin Origin Conversation
date: 2025-01-31

---

## user

I want to talk a bit about DSLs
I think they're going to become important as more development is done by folks who never had to learn to read or write code
I'm not sure yet what direction the DSLs will tend
Will the humans learn the DSL?
Will it be the LLM assistant that needs a pre-prompt or fine tuning on the DSL?
Will the DSL be softer, like a set of conventions that people use when giving context to LLMs?

## assistant

These are interesting questions. You're touching on a fundamental shift in how we think about the human-computer interface.

Let me share some thoughts on each direction:

**Humans learning the DSL**

This is the traditional model - markdown, regex, SQL, YAML configs. The value proposition is precision and repeatability. But if the user never learned to code, will they learn a DSL? Maybe, if it's:
- Small enough (think hashtags, @mentions - those are tiny DSLs people already use)
- Immediately useful with partial knowledge
- Forgiving of errors

**LLM needs the DSL (pre-prompt/fine-tuning)**

This flips things - the DSL becomes a way to constrain and shape LLM output rather than human input. Examples emerging now:
- Structured output schemas (JSON mode)
- Tool/function definitions
- System prompts that establish conventions

The human speaks naturally; the DSL operates behind the scenes.

**Soft DSLs / conventions**

This is perhaps the most likely near-term evolution. Things like:
- "Use bullet points for options"
- "When I say 'fix' I mean don't refactor unrelated code"
- Project-specific terminology that accumulates in CLAUDE.md files

These are emergent, negotiated between human and LLM over time.

---

My intuition: all three will coexist, stratified by use case. The interesting question might be - what makes a good DSL for LLM-mediated development? The design constraints are different when the "parser" understands intent.

What's prompting your thinking here? Are you considering building something?

## user

I have multiple purposes.. I could name a couple, but mostly I'm just drawn to the broad concept and want to explore where it moves if pushed. I think it could open up possibilities for faster learning among new builders (non-programmers who rarely interact with the code, but use LLM tools to assist in creating it) -- this same cohort is intimidated by git and by the command line in general, but if the command line was more forgiving (understanding intent) then that would be a way in. Claude Code is already a good fit but in order for what I am after to be achieved, it would require a lesson or two in how to speak to Claude in a different way, almost like writing commands. If both the user and Claude understood that this was intentional and had a little bit of context about what to expect then I think it would be a very expressive medium

## assistant

I think you're onto something. The gap you're describing is real - there's a cognitive load to "conversational" prompting that people don't talk about much. Natural language is actually *harder* in some ways because:

- You have to decide how much context to give
- You're never sure if you were clear enough
- There's no feedback until the LLM responds
- Every interaction feels like starting from scratch

A lightweight DSL with shared expectations could reduce that anxiety. It's not about restricting expression - it's about providing **handholds**.

Think about how musicians learn. They don't start by "expressing themselves freely" - they learn scales, chords, patterns. The constraints are enabling.

---

What might this look like in practice?

A few sketches:

**Command-like patterns** (but forgiving)
```
/fix the login button -> not working on mobile
/add feature: dark mode toggle -> settings page
/explore: how does auth work here?
```

The arrow or colon becomes a separator between *what* and *where/why*. Claude knows to parse it that way. The user learns one pattern that works across many situations.

**Soft structure with escape hatches**
```
GOAL: user can export data as CSV
CONSTRAINT: don't touch the database schema
CONTEXT: we're using React, there's an existing export modal
```

Not strict syntax - Claude would understand variations. But the labels give both parties a shared frame.

**Progressive disclosure**
New users start with very simple patterns. As they get comfortable, they discover more precise ones. The DSL grows with them.

---

What's your instinct on where the structure should live? In the user's muscle memory? In a cheatsheet? Baked into the tool?

## user

I think it might start as a lexicon of patterns. The one you just outlined is a good example. There are ways that programmers use intuitively to say more with less. It's the nature of programming. It's why once you learn a couple programming languages it's easy to learn others. You start to learn how to see the patterns of how syntax tends to be organized. I notice this when I type terse things to Claude. I can be very expressive with very few symbols. This is a skill that might be taught quickly if good and varied examples of this could be surfaced. A sort of semantic compression, but with infinite extensibility.

## assistant

Yes - "semantic compression with infinite extensibility" is a good frame. You're describing something like **fluency** rather than **syntax**.

The interesting thing about what programmers do intuitively:

```
fix auth -> mobile
```

vs

```
There's a bug in the authentication system. Specifically, it doesn't work correctly when users are on mobile devices. Can you please fix it?
```

Same information. The first one works because both parties share context about:
- What "fix" implies (find problem, solve it, don't break other things)
- What "->" means (directional, "in the context of" or "when")
- What's omitted (you know the codebase, you'll figure out which files)

This is **trust encoded as brevity**.

---

The lexicon idea is compelling. Not a grammar to memorize, but a collection of patterns you absorb:

| Pattern | Example | What it conveys |
|---------|---------|-----------------|
| `->` | `fix auth -> mobile` | scope/context |
| `:` | `add: logout button` | type of action |
| `?` | `auth flow?` | exploration, not action |
| `!` | `don't touch db!` | constraint/warning |
| `...` | `like the navbar...` | reference by similarity |

These aren't rules. They're **gestures**. People already use some of them inconsistently. Naming and collecting them makes them transferable.

---

The teaching question is interesting. You could:
1. Show pairs (verbose ↔ compressed) and let people internalize
2. Have Claude "translate" their verbose prompts into compressed form as a teaching moment
3. Build a small reference that fits on one screen

What would make someone *want* to learn this? Speed? Feeling like an insider? The pleasure of economy?

## user

that's too intentional for right now - I'm not looking to convince anyone yet. I think there's something here. It's not about programmers exactly, either. People do this naturally in a notebook to save time and strokes, and the limitation ends up making the form more expressive. When you write everything in a full sentence, the parts can't be easily re-used or re-combined

## assistant

Right. The constraint creates **composability**.

A full sentence is a finished thought. But fragments are atoms:

```
auth
mobile
fix
->
!
```

Each piece can attach to other pieces. "auth -> mobile" today, "auth -> token expiry" tomorrow. The vocabulary accumulates but the grammar stays loose.

This is why poetry works differently than prose. Line breaks, compression, juxtaposition - they make the reader do more work, but they also make the form *generative*. You see connections the writer didn't prescribe.

---

Notebooks are a good reference point. Also:
- Shorthand systems (Gregg, Pitman)
- Musical notation
- Chess notation (`Nf3`, `O-O`)
- Recipes (verbs + ingredients + conditions)
- Knitting patterns

These all evolved from practitioners needing to capture something faster than prose allowed, and the compression ended up revealing structure that was always there but hidden.

---

The interesting thing about your context - LLM-mediated building - is that the "reader" (Claude) is unusually good at resolving ambiguity. So the DSL can stay softer than traditional ones. You don't need perfect parsing. You need **enough signal** for intent to survive.

Maybe what you're circling is less "DSL" and more **pidgin** - a contact language that emerges when two parties need to communicate and neither fully adopts the other's system.

## user

that's a beautiful association, and rich in latent meaning for my purposes here. lets dig deeper on that

## assistant

Pidgins emerge under specific conditions:

1. **Two groups need to coordinate** but don't share a language
2. **Neither group fully adopts the other's system** - there's no time, no need, or no power imbalance forcing it
3. **The vocabulary is small and task-focused** - trade, work, navigation
4. **Grammar simplifies radically** - drops tense, gendered articles, irregular forms
5. **Context carries the load** - you're standing on a dock looking at fish, so "fish good" works

The result isn't broken language. It's **language optimized for the situation**.

---

What's striking about your context:

The human doesn't speak "code" fluently. Claude doesn't speak "human intent" perfectly. But they're standing together looking at a codebase, trying to build something. The shared context (the files, the errors, the goals) does enormous work.

A pidgin would lean on that. It wouldn't try to be complete. It would say:

```
this -> like that
more
no, back
again but smaller
```

And both parties would understand because they're pointing at the same thing.

---

Pidgins also do something else interesting: **they creolize**.

If a pidgin sticks around, the next generation grows up with it. They fill in the gaps, regularize the irregularities, expand it into a full language. It becomes native.

Maybe that's the trajectory here. The first generation of non-programmer builders develops a pidgin with LLMs. Terse, contextual, gestural. And over time it stabilizes into something richer - still not "code" but not plain English either.

A creole for building.

## user

the blending will be multifaceted since programmers are also part of the ecosystem

## assistant

Yes. The pidgin isn't forming between two isolated groups - it's forming in a space where:

- **Non-programmers** bring natural language intuitions, metaphors, task-oriented thinking
- **Programmers** bring compression habits, symbolic shorthand, structural intuitions
- **LLMs** bring tolerance for ambiguity, pattern-matching across both registers

And they're all in the same room. The non-programmer sees the programmer type `fix -> mobile` and absorbs it. The programmer sees Claude interpret a vague gesture successfully and loosens their precision. Claude adapts to both, reinforcing what works.

---

This is different from most pidgin formation. Usually there's a dominant/subordinate dynamic, or at least a clear directionality. Here it's more like a **three-way negotiation** happening in public, with each exchange visible to all parties.

The artifacts matter too:
- CLAUDE.md files
- Prompts people share
- Tutorials and examples
- This conversation

Each one seeds the pidgin further. Someone reads this, tries `->` as a scoping gesture, it works, they use it again. Small mutations propagate.

---

The programmer's role is interesting. They might:
- Accelerate the pidgin by introducing useful compressions
- Resist it if they feel territorial about "real" code
- Fork it - one register for talking to Claude, another for talking to junior devs

Or they might find that the pidgin *improves* how they think. Compression for Claude might also be compression for themselves. The artifact of communicating with the LLM becomes a thinking tool.

What's your sense of how programmers will relate to this? Participants? Observers? Gatekeepers?

## user

all of the above. programmers are territorial right now. but also, the progress is real if new and more humane ways of communicating compressed meaning are established, and many will be wise enough to see that

## assistant

The territorial response is understandable. Programming has been a guild for decades - hard-won knowledge, arcane initiation, real status attached to fluency. If someone can now build without learning the secret language, what was all that for?

But you're pointing at something that might dissolve the defensiveness for some:

**The pidgin isn't a shortcut around programming. It might be a distillation of what was always valuable in it.**

The compression habits programmers developed weren't arbitrary. They emerged because:
- Precision matters when machines are the audience
- Brevity reduces error surface
- Structure makes change manageable
- Naming things forces understanding

If those insights survive in a new form - one that's learnable faster, more forgiving, more human - then the programmer's knowledge isn't obsoleted. It's *liberated* from syntax and made transferable.

---

The wise ones will see that they were never really in the business of typing semicolons. They were in the business of:
- Decomposing problems
- Naming things well
- Knowing what to leave out
- Sensing when something is fragile

Those skills translate directly into pidgin fluency. A good programmer might become an exceptionally good pidgin speaker - not because they know Python, but because they've internalized the underlying discipline.

The threat isn't to programming. It's to programming as **gatekeeping**.

## user

I think the exercise is valuable, help me make a pair of lists.. the things that programmers are in the business of when framed this way, versus the way it might be framed currently

## assistant

**Current framing: what programmers "do"**

- Write code in specific languages
- Know syntax, APIs, frameworks
- Debug by reading stack traces
- Manage dependencies and toolchains
- Understand data structures and algorithms
- Write tests
- Use git correctly
- Configure environments
- Optimize performance
- Ship features

**Reframed: what programmers are actually in the business of**

- Decomposing problems into smaller problems
- Naming things precisely enough that they stay coherent
- Knowing what to leave out
- Sensing when something is fragile before it breaks
- Holding a system in their head while changing a part
- Recognizing when patterns repeat and when they don't
- Communicating intent to a non-human executor
- Making change safe and reversible
- Knowing when to stop
- Carrying context across time (what did I mean six months ago?)

---

The first list is **craft skills** - valuable but bound to specific tools and eras.

The second list is **cognitive postures** - transferable, durable, exactly what you need to work effectively with an LLM.

A non-programmer learning the pidgin is learning the second list without going through the first. That's not cheating. That's just a different path to the same place.

## user

lets start to imagine a content site that's sort of a field guide. lets use your excellent association of "pidgin" as a name for the project.

## assistant

I like that. **Pidgin** as a field guide.

The name works on multiple levels:
- Honest about what it is (a contact language, not a "real" language)
- Implies emergence, negotiation, practicality
- No pretense of completeness
- Nods to the history of humans figuring out how to communicate under pressure

---

**What might be in a field guide?**

Field guides are structured for **recognition**, not theory. You're in the field, you see something, you flip to it.

Some sections that come to mind:

**Gestures**
The atomic patterns. `->`, `:`, `?`, `!`, `...`
Each one with examples, variations, what it tends to convey.

**Phrases**
Common combinations that recur.
`fix X -> Y`, `like X but...`, `explore: X`, `without touching Y`
Not commands. Phrases that work.

**Postures**
The cognitive habits from the second list.
Short essays or prompts. "Knowing what to leave out." "Sensing fragility."
Less practical, more orienting.

**Specimens**
Real exchanges. Terse prompt, what happened, why it worked.
Maybe with variations - "this also would have worked."

**Failures**
Pidgins break down. When? Why?
Where compression loses too much. Where context wasn't shared.

---

The tone would matter. Not instructional. More like a naturalist's notebook. "Here's what I've observed. Here's what seems to work. Your mileage may vary."

What's your instinct on audience? New builders first? Mixed?

## user

I'm not convinced by the atoms yet. I think currently our thinking has been very abstract (although excellent) and we haven't arrived at the concrete yet. You made a first pass with those atomic symbols, but those aren't necessarily ones I would choose. I want to review some past writing separately and I'll get back to you when the time is right about some of the syntactic specifics. For now, lets stay high level and talk more about things we can say about the current dynamic. The paired lists from a moment ago are a good example of this

## assistant

That's fair. The symbols were speculative - placeholders more than proposals. The actual atoms need to emerge from observation, not invention.

Let's stay in the territory of dynamics.

---

**Some things we might say about the current moment:**

The tools have outpaced the culture around them. People are building with LLMs but borrowing mental models from either:
- Traditional programming (precise, syntactic, unforgiving)
- Conversation (verbose, social, meandering)

Neither fits. The first is intimidating. The second is inefficient. Both miss the opportunity.

---

There's a literacy gap, but it's not the gap people name. It's not "can you code or can't you." It's:
- Can you hold a system in your head while changing a part?
- Can you name things well enough to refer back to them?
- Can you say less when less is enough?
- Can you sense when you're about to make a mess?

These are teachable. But we don't have good language for teaching them outside of programming pedagogy, which comes with baggage.

---

The non-programmer builders are not a lesser category. They often have:
- Domain knowledge programmers lack
- Clearer sense of what they're actually trying to do
- Less reverence for the "right way"
- Willingness to try things

What they lack is confidence in the interaction. They don't trust that their gestures will land. They over-explain out of anxiety.

---

Programmers have the opposite problem sometimes. Over-trust in their own precision. They write prompts like code, get frustrated when Claude "misunderstands," blame the tool. The pidgin might humble them usefully.

---

Any of these resonate as directions to push further?

## user

these are all good directions, currently I'm pondering how the code is still the encoding of the system, and there's no getting around that. how do we embrace that as non-programmers, and not be hubristic about it as programmers.. in other words, non-programmers need to accept that code is in fact important, but programmers need to accept that there are new and sometimes better ways to arrive at working code

## assistant

This feels like the central tension.

---

**For non-programmers to accept:**

The code is not an implementation detail you can ignore. It's the actual system. When Claude writes code, something real is created - with structure, dependencies, fragility, consequences.

You don't have to read it fluently. But you have to respect that it exists and that it matters. The pidgin is not a way to avoid the code. It's a way to *negotiate with it* through an intermediary.

This means:
- The code can say no (it won't do impossible things just because you asked nicely)
- The code accumulates (every change leaves residue)
- The code has opinions (shaped by what came before)
- You're responsible for what gets built, even if you didn't type it

Humility here looks like: *I'm building something real, even if I can't see all of it.*

---

**For programmers to accept:**

The path you took is not the only path. Syntax was a bottleneck, and now it's not. The years you spent learning to speak to machines in their language were valuable - but they were also a constraint imposed by the technology of the time.

Someone arriving at working code through the pidgin hasn't cheated. They've taken a different route to the same destination. And sometimes their route is better because:
- They stay closer to intent
- They aren't seduced by elegance for its own sake
- They don't over-engineer out of habit
- They ask "does it work?" before "is it correct?"

Humility here looks like: *My way was one way, not the way.*

---

Both groups have to meet at the code. It's the shared artifact. The pidgin is how you approach it. But it's still there, still real, still the thing that runs.

## user

I feel like it would be interesting for an artifact of the building/planning conversation to be a human readable but pseudo-code-like encoding of the thing to be built. I consider this categorically different from a spec or a bullet list plan. what is the DSL of your current system? and then write a proposal in that DSL. but then also the pull is toward a DSL that looks less like code and more like terse language.

## assistant

You're describing something that sits in a specific place:

```
prose spec → ??? → code
```

The `???` is not a plan. It's not a requirements doc. It's a **structural sketch in a register that both humans and LLMs can hold**.

---

**Why this might matter:**

A prose spec is readable but lossy. It hides structure in sentences. You have to re-extract the logic every time you read it.

A bullet list plan is sequential but flat. It says *what to do* but not *what the thing is*.

Code is precise but opaque to non-programmers. And it's over-committed - it has made choices that might have been left open.

The artifact you're imagining would:
- Show the shape of the system
- Name the parts
- Indicate relationships
- Stay silent on implementation details
- Be readable without programming knowledge
- Be precise enough that Claude could expand it deterministically

---

**Two gravitational pulls:**

*Toward code-like:*
```
system: usage-tracker
  components:
    collector: gathers events from user actions
    store: holds events, queryable by time range
    exporter: transforms store contents → [csv, json, pdf]
  flows:
    user acts → collector → store
    user requests export → exporter reads store → file
```

*Toward terse language:*
```
track what users do
keep it somewhere we can query
let them export as csv, json, or pdf
```

The first is more precise, more expandable. The second is more approachable, more intent-forward.

Maybe the answer isn't choosing. Maybe the DSL supports **progressive formalization** - you can start terse, and structure emerges as needed.

## user

I think more of a focus on naming the things. "track", "keep", "let" -- the first words of your second example are meaning-rich but the meaning is not named... the programmer in me wants to define them.. that can be a weakness and a strength.. but I want to tug there a little

## assistant

Yes. There's something there.

"Track what users do" - what is "track"? It's:
- observe
- record
- persist
- associate with a source
- timestamp

All of that is hiding inside a single word. A programmer's instinct to define isn't pedantry. It's the recognition that **the word is doing too much work**.

But here's the tension: if you force the definition too early, you lose the fluency. The non-programmer said "track" because it matched their intent. They don't want to decide yet between "observe and discard" vs "observe and persist."

---

**What if the naming happened as a second pass?**

First, you say what you mean:
```
track what users do
```

Then, the system (or Claude, or the pidgin itself) reflects back:
```
track = observe + record + persist
        ↳ what triggers observation?
        ↳ where does it persist?
        ↳ for how long?
```

The name stays. But it gets **unpacked** rather than replaced.

This is different from defining upfront. It's **naming as a dialogue**. You say "track." I say "here's what track might contain. Which of these matter to you?"

---

The artifact then becomes a record of those negotiations:

```
track [observe + persist → store]
  what: user actions
  when: on each action
  keep: 90 days

store [events, indexed by time + user]

export [store → file]
  formats: csv, json, pdf
  trigger: user request
```

Still readable. But the names have been *grounded* through conversation.

Does that pull feel right? Naming as negotiation rather than definition?

## user

no let's backtrack. I should have stated that I agree with your take that the two directions would look a little like that from both our stereotypical programmer and stereotypical non-programmer. that part is ok.. but I'm trying to just put a little color on how I react as a programmer to the second example

## assistant

Ah, got it. Say more then. What's the reaction?

## user

that those words are so full of potential, and wanting for definition -- but then the strength of them from the non-programmers side is that they aren't defined but are still "true" to them

## assistant

That's a beautiful articulation of the tension.

To the programmer: "track" is a black box. It could mean ten different things. The urge is to crack it open, enumerate the possibilities, nail it down. Until you do, it feels unstable. Untrustworthy.

To the non-programmer: "track" is already complete. It means what they mean. The definition is *them*. They don't need to formalize it because they'd recognize it if they saw it working. The word is a placeholder for intent, and the intent is solid even if the word is soft.

---

Both are true at the same time.

The word is full. And the word is empty. Depending on where you stand.

---

Maybe the pidgin has to hold that paradox rather than resolve it. The non-programmer gets to keep their true-but-undefined words. The programmer gets to see the potential meanings vibrating inside. And the LLM sits in between, able to hear both registers.

The artifact doesn't force premature definition. But it also doesn't hide that definition will eventually happen. It marks the places where fullness and emptiness coexist.

Something like: *here is a word that is doing real work, and we haven't yet said what that work is.*

## user

yes, philosophically this is right on point. still, I feel like the reminder that the code is real is needed here, and maybe my thinking is that there needs to be a way for those words to be formalized that is rigorous enough for the programmer and rich enough for the non-programmer

## assistant

So the formalization can't be a betrayal of the original word. It has to feel like an *unfolding* of what was already there.

If "track" becomes `addEventListener → normalize → insert into events table` - the non-programmer's eyes glaze over. Their word got stolen and replaced with something alien.

But if "track" becomes:

```
track
  notice when something happens
  remember it
  so we can look back later
```

That's still their word. It's just been made explicit in a way that honors the intent while gesturing toward the real.

---

And then maybe there's a bridge layer. The same "track" also maps to:

```
track → observe + persist
  observe: event listener on user actions
  persist: write to store with timestamp
```

The non-programmer doesn't need to read this part. But it exists. The programmer can see that "remember it" corresponds to something real. The word holds both.

---

The rigor the programmer needs: *I can trace from intent to implementation. Nothing is magic.*

The richness the non-programmer needs: *My words weren't discarded. They're still in there. I can still see myself in the artifact.*

Maybe the DSL is layered. Same skeleton, multiple readings. You zoom in or out depending on who you are and what you need right now.

## user

hmm.. my imagination goes to your original example "track what users do
keep it somewhere we can query
let them export as csv, json, or pdf" and then there should be an attempt to maintain a connecting strand between this original invocation and the eventual code...

## assistant

Yes - the strand. That's the thing.

Right now the connecting strand breaks. The non-programmer says "track what users do" and then code appears and the relationship between their words and the code is... invisible. Lost. You'd have to be a programmer to trace it.

So they're alienated from their own creation. The code is real, but it's not *theirs* in any felt sense.

---

What if the strand was maintained explicitly?

Their words don't disappear. They persist *inside* or *alongside* the code. Not as comments (which are for programmers). As an actual layer.

```
track what users do
  → useTracker.ts
    → captureEvent() - this is the "notice when something happens"
    → eventStore.write() - this is the "remember it"
```

Or maybe the code itself carries the original language:

```typescript
// track what users do
function captureEvent() { ... }  // notice when something happens
eventStore.write(event)          // remember it
```

But that still feels like programmer territory. The comments are a courtesy, not a true connection.

---

Maybe the artifact isn't the code. Maybe it's a **map** that lives alongside the code. The non-programmer can always return to it and say:

*Here is what I said. Here is where it lives now. The strand is intact.*

And when something breaks or changes, the map shows where their original intent is affected.

## user

yeah, some kind of middle layer, it has to have actual consequences though.. but if it existed it would be a powerful intermediary.. you could search against it with excellent semantic search characteristics, and it would point to actual places in the code

## assistant

Right. It's not documentation. It's **load-bearing**.

If it's just a nice map that sits alongside, it rots. The code changes, the map doesn't, the strand breaks anyway. We've seen this movie with every documentation system ever.

But if it has consequences - if it's the thing you edit to make changes, or the thing Claude reads to understand the system, or the thing that must stay in sync or the build fails - then it stays alive.

---

The properties it would need:

**Bidirectional**
- Change the code → the map reflects it (or demands attention)
- Change the map → the code follows (via Claude or tooling)

**Queryable**
- "Where do we track things?" returns both the map entry and the code locations
- The semantic richness of natural language, pointing to precise locations

**Authoritative**
- Not a secondary artifact. The source of truth for *intent*.
- Code is the source of truth for *implementation*.
- Both matter. Neither is decoration.

---

This would change how you build. You'd work in two registers:

1. The intent layer - what things are called, what they do, how they relate
2. The code layer - how it actually works

And Claude moves between them. The non-programmer stays mostly in the first. The programmer can dive into the second. But both are looking at the same system through different lenses.

The strand isn't maintained by discipline or good habits. It's maintained because the system requires it.

## user

it needs to be checkable by claude.. domains need to be decomposable into small enough pieces that this analysis is straightforward, but large enough that they can do meaningful work.. it would force a sort of composability of intent which would be the right kind of challenge for non-programmers

## assistant

Yes. This is where it gets concrete.

If Claude can check that the intent layer and the code layer are in sync, then you have something real. Not a wish. A constraint.

But for that check to be meaningful, the units have to be right-sized:

**Too big:**
```
track what users do
```
↳ Maps to 15 files, 40 functions. Claude can't hold it. The check becomes "does this vaguely seem related?" - useless.

**Too small:**
```
increment the counter
```
↳ Maps to one line. The overhead of maintaining the strand exceeds the value. You're just writing comments with extra steps.

**Right-sized:**
```
notice when a user acts
remember the event
recall events by time range
export to csv
```
↳ Each one maps to a coherent unit. A function, a small module, a boundary. Claude can verify: "does this code do this thing?" And the answer is yes or no, not "sort of."

---

The discipline this imposes on non-programmers:

You can't just say "track what users do" and walk away. You have to decompose your intent into pieces that can be checked. That's work. But it's the *right* work - the same work programmers do when they design systems, just in a different language.

**Composability of intent.**

You learn to think: what are the parts? How do they connect? What does each part actually do?

Not because someone told you that's how programming works. Because the system won't let you proceed until your intent is structured enough to verify.

## user

can we walk this road in the current project as a proof of concept?

## assistant

Yes. Let's do it.

We have an artifact already - this conversation. We've been circling a system. Let me try to state its intent in decomposed pieces:

---

**Pidgin: a field guide for LLM-mediated building**

```
explain the current dynamic
  - what programmers are actually in the business of
  - what non-programmers bring and lack
  - why neither "code" nor "conversation" fits

collect gestures and patterns
  - atoms of compression that recur
  - drawn from observation, not invention

show specimens
  - real exchanges, terse and effective
  - with variations and failures

maintain the strand
  - from intent to code
  - checkable, bidirectional
  - load-bearing, not decorative

teach decomposition
  - right-sized units of intent
  - composable, verifiable
```

---

This is a first pass. Some of these are content (what goes in the guide). Some are infrastructure (the strand-maintenance system). Some are pedagogical (teach decomposition).

Where would you want to start making this real?

- A single specimen, fully traced?
- The intent layer for one small feature?
- The structure of the site itself, stated this way?

## user

I think start with a conversation format that can faithfully preserve user/assistant conversations verbatim. a text format. this probably already exists with recent llm tooling or could be approximated well enough, we probably don't need to reinvent the wheel. try creating a ./conversations dir and placing this exact conversation there
