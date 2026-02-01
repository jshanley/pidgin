import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { pipeline } from '@xenova/transformers';

const CONVERSATIONS_DIR = 'conversations';
const TERMS_FILE = 'src/terms.txt';
const OUTPUT_FILE = 'dist/index.json';

function parseConversation(markdown, filename) {
  const lines = markdown.split('\n');
  const frontmatter = {};
  const turns = [];
  let inHeader = true;
  let currentRole = null;
  let currentContent = [];

  for (const line of lines) {
    if (line.trim() === '---') {
      inHeader = false;
      continue;
    }

    if (inHeader) {
      const titleMatch = line.match(/^#\s+(.+)$/);
      if (titleMatch) {
        frontmatter.title = titleMatch[1];
        continue;
      }
      const metaMatch = line.match(/^(\w+):\s*(.+)$/);
      if (metaMatch) {
        frontmatter[metaMatch[1]] = metaMatch[2];
      }
      continue;
    }

    const roleMatch = line.match(/^## (user|assistant)$/i);
    if (roleMatch) {
      if (currentRole && currentContent.length > 0) {
        const text = currentContent.join('\n').trim();
        if (text) {
          turns.push({ role: currentRole, text, source: filename });
        }
      }
      currentRole = roleMatch[1].toLowerCase();
      currentContent = [];
    } else if (currentRole) {
      currentContent.push(line);
    }
  }

  if (currentRole && currentContent.length > 0) {
    const text = currentContent.join('\n').trim();
    if (text) {
      turns.push({ role: currentRole, text, source: filename });
    }
  }

  const title = (frontmatter.title || filename.replace('.md', ''))
    .replace(/-/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());

  return { filename, title, frontmatter, turns };
}

function parseTerms(text) {
  return text.trim().split('\n')
    .filter(line => line.trim())
    .map(line => {
      const parts = line.split('|').map(s => s.trim());
      return {
        term: parts[0],
        aliases: parts.slice(1)
      };
    });
}

function splitIntoParagraphs(text) {
  const blocks = text.split(/\n\n+/);
  return blocks
    .map(b => b.trim())
    .filter(b => b.length > 20);
}

function generateChunks(conversations) {
  const chunks = [];

  for (const conv of conversations) {
    for (let turnIndex = 0; turnIndex < conv.turns.length; turnIndex++) {
      const turn = conv.turns[turnIndex];

      chunks.push({
        text: turn.text,
        source: conv.filename,
        role: turn.role,
        scale: 'turn',
        turnIndex
      });

      const paragraphs = splitIntoParagraphs(turn.text);
      for (const para of paragraphs) {
        if (para !== turn.text && para.length > 30) {
          chunks.push({
            text: para,
            source: conv.filename,
            role: turn.role,
            scale: 'paragraph',
            turnIndex
          });
        }
      }
    }
  }

  return chunks;
}

function indexTermOccurrences(terms, chunks) {
  const occurrences = {};

  for (const term of terms) {
    const searchTerms = [term.term, ...term.aliases];
    const indices = [];

    chunks.forEach((chunk, i) => {
      const textLower = chunk.text.toLowerCase();
      for (const t of searchTerms) {
        if (textLower.includes(t.toLowerCase())) {
          indices.push(i);
          break;
        }
      }
    });

    occurrences[term.term] = indices;
  }

  return occurrences;
}

async function main() {
  console.log('Building index...');

  // Load terms
  const termsText = await readFile(TERMS_FILE, 'utf-8');
  const terms = parseTerms(termsText);
  console.log(`Loaded ${terms.length} terms`);

  // Load conversations
  const files = await readdir(CONVERSATIONS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md')).sort();

  const conversations = [];
  for (const file of mdFiles) {
    const content = await readFile(join(CONVERSATIONS_DIR, file), 'utf-8');
    conversations.push(parseConversation(content, file));
  }
  console.log(`Loaded ${conversations.length} conversations`);

  // Generate chunks
  const chunks = generateChunks(conversations);
  console.log(`Generated ${chunks.length} chunks`);

  // Index term occurrences
  const occurrences = indexTermOccurrences(terms, chunks);

  // Generate embeddings
  console.log('Loading embedding model...');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  console.log('Embedding chunks...');
  const embeddings = [];
  for (let i = 0; i < chunks.length; i++) {
    const result = await embedder(chunks[i].text, { pooling: 'mean', normalize: true });
    embeddings.push(Array.from(result.data));
    if ((i + 1) % 50 === 0) {
      console.log(`  ${i + 1}/${chunks.length}`);
    }
  }
  console.log(`Generated ${embeddings.length} embeddings`);

  // Build output (include full conversations for reader)
  const index = {
    terms,
    conversations,
    chunks,
    occurrences,
    embeddings,
    buildTime: new Date().toISOString()
  };

  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Wrote ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
