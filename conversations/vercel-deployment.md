# Vercel Deployment
date: 2026-02-04T14:16:48-08:00
transcript: 6fa1735a-4382-4715-9446-7a97b6e8c936

---

## user

lets reorganize the app a bit in preparation for deploying it to vercel instead of github pages. I want to reconsider the hash url routing and have pretty urls

## assistant

Good — the data fetch uses Vite's `import.meta.env.BASE_URL` which will automatically adjust when we change the `base` config. The plan is straightforward.

## tool (AskUserQuestion)

questions: [{'question': 'Do you want to remove the GitHub Pages workflow, or keep it alongside the Vercel setup?', 'header': 'GH Pages', 'options': [{'label': 'Remove it', 'description': "Delete .github/workflows/deploy.yml since you're moving to Vercel"}, {'label': 'Keep it', 'description': 'Leave the workflow in place for now, just add Vercel config'}], 'multiSelect': False}]

User has answered your questions: "Do you want to remove the GitHub Pages workflow, or keep it alongside the Vercel setup?"="Remove it".

## assistant

Build succeeds. Here's a summary of what changed:

- **`src/router.jsx`** — Removed hash history; now uses browser history for clean URLs like `/conversations/my-slug`
- **`vite.config.js`** — Changed `base` from `'/pidgin/'` to `'/'`
- **`vercel.json`** — New file with build command, output directory, and SPA rewrite fallback
- **`.github/workflows/deploy.yml`** — Deleted (GitHub Pages workflow removed)

The app now uses pretty URLs. On Vercel, the rewrite rule ensures direct navigation to any route serves `index.html` so the client-side router handles it.

## user

what about the build:index step?

## assistant

Good point. Let me check what it needs.

## assistant

The concern is `@xenova/transformers` — it's a devDependency that downloads and runs an ML model to generate embeddings. That's going to be slow/heavy on Vercel's build (and may hit memory limits). Two options:

1. **Pre-commit the `dist/index.json`** — run `build:index` locally, commit the output, and skip it on Vercel
2. **Keep it in the Vercel build** — move `@xenova/transformers` to dependencies and hope it fits in Vercel's build limits

## tool (AskUserQuestion)

questions: [{'question': "The build:index step runs an ML model (xenova/transformers) to generate embeddings — this could be slow or exceed Vercel's build memory. How do you want to handle it?", 'header': 'Build index', 'options': [{'label': 'Commit dist/ locally', 'description': 'Run build:index locally, commit dist/index.json to the repo, skip it on Vercel'}, {'label': 'Run on Vercel', 'description': 'Keep build:index in the Vercel build command and hope it fits (may need to move xenova to dependencies)'}, {'label': 'Split the steps', 'description': 'Build index without embeddings for Vercel, generate embeddings separately or drop them'}], 'multiSelect': False}]

User has answered your questions: "The build:index step runs an ML model (xenova/transformers) to generate embeddings — this could be slow or exceed Vercel's build memory. How do you want to handle it?"="how big is it?".

## assistant

11MB for `index.json` (mostly embeddings), 12MB total for `dist/`. That's a chunky file to commit to git but not unreasonable. The embeddings are the bulk of it — the actual conversation data is probably ~1MB.

For context: the xenova model itself downloads ~80MB on first run and takes a bit to process. On Vercel's free tier you get 45s build timeout (pro gets more). It'd likely work but be fragile.

Committing `dist/` is the pragmatic path — keeps the build fast and predictable on Vercel. You'd just need to remember to run `npm run build:index` locally when you add/change conversations.

## user

we're not really using it are we?

## assistant

Good question — let me check if anything in the app actually uses the embeddings or search.

## assistant

Nope. The embeddings are generated and stored in `index.json` but nothing in the UI consumes them. The app just reads `conversations`, `readings`, `terms`, and `occurrences` from the index.

So we could drop the embeddings from `build-index.js` entirely — that removes the `@xenova/transformers` dependency and shrinks `index.json` from 11MB to ~1MB. The build would be fast enough to run on Vercel. Want me to strip out the embedding step?

## user

but, it does seem like part of it updates what pages are generated

## assistant

Right — the `build:index` script does two things: generates the `index.json` (conversations, terms, chunks, occurrences) that the app needs, AND writes the `dist/raw/` files. We just need to strip out the **embeddings** part, not the whole script.

So the move is: remove the xenova import and embedding generation from `build-index.js`, drop the `@xenova/transformers` devDependency, and keep everything else. That makes the script fast/lightweight enough to run on Vercel, and `index.json` drops from 11MB to ~1MB. Want me to do that?

## user

yes, make sure we do this in such a way that it always runs as part of the app build when vercel runs ci

## assistant

Now roll `build:index` into the main build script and remove xenova:

## assistant

Update vercel.json since `build` now includes the index step:

## assistant

Now remove the unused embedding worker and uninstall xenova:

## assistant

Everything works. `index.json` is now 627KB (down from 11MB). The `npm run build` command now runs `build-index.js` first then Vite, so Vercel's single `npm run build` will generate the data and build the app in one step.
