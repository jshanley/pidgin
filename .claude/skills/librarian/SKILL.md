# Librarian

Syncs reflective artifacts from the global librarian system into this project.

## Background

The librarian generates short reflective stories during development sessions, connecting the current work to science, history, biology, or other domains. These artifacts live globally at `~/.fieldtheory/librarian/artifacts/` and are named by project and timestamp.

## Location

Local artifacts: `.librarian/artifacts/`

## Sync Process

When asked to sync or update librarian artifacts:

```bash
# Find pidgin artifacts in global librarian
find ~/.fieldtheory/librarian/artifacts -name "pidgin-*" -type f

# Copy to local .librarian (preserving originals)
cp ~/.fieldtheory/librarian/artifacts/pidgin-*.md /path/to/pidgin/.librarian/artifacts/
```

## Conventions

- **Copy, don't move**: Global artifacts are the source of truth
- **Naming**: `{project}-{timestamp}-artifact.md` (e.g., `pidgin-2026-02-01-113324-artifact.md`)
- **Content**: Short reflective pieces (120-200 words), grounded in real science/history
- **Frequency**: Generated during meaningful work, not every interaction

## Reading Artifacts

When asked about librarian posts or readings:

- **"show the librarian posts"** → list files in `.librarian/artifacts/`
- **"read the latest reading"** → read most recent artifact by filename timestamp
- **"what has the librarian written?"** → summarize the collection
