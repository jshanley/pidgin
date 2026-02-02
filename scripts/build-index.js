import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { pipeline } from '@xenova/transformers';

const CONVERSATIONS_DIR = 'conversations';
const LIBRARIAN_DIR = '.librarian/artifacts';
const TERMS_FILE = 'src/terms.txt';
const OUTPUT_FILE = 'dist/index.json';

function parseConversation(markdown, filename) {
  const lines = markdown.split('\n');
  const frontmatter = {};
  const turns = [];
  let inHeader = true;
  let currentRole = null;
  let currentToolName = null;
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
    const toolMatch = line.match(/^## tool(?: \(([^)]+)\))?$/i);
    if (roleMatch || toolMatch) {
      if (currentRole && currentContent.length > 0) {
        const text = currentContent.join('\n').trim();
        if (text) {
          turns.push({ role: currentRole, text, source: filename, ...(currentToolName && { toolName: currentToolName }) });
        }
      }
      if (toolMatch) {
        currentRole = 'tool';
        currentToolName = toolMatch[1] || null;
      } else {
        currentRole = roleMatch[1].toLowerCase();
        currentToolName = null;
      }
      currentContent = [];
    } else if (currentRole) {
      currentContent.push(line);
    }
  }

  if (currentRole && currentContent.length > 0) {
    const text = currentContent.join('\n').trim();
    if (text) {
      turns.push({ role: currentRole, text, source: filename, ...(currentToolName && { toolName: currentToolName }) });
    }
  }

  const title = (frontmatter.title || filename.replace('.md', ''))
    .replace(/-/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());

  return { filename, title, frontmatter, turns };
}

function parseReading(markdown, filename) {
  const lines = markdown.split('\n');
  let title = filename.replace('.md', '').replace(/-artifact$/, '');
  let body = [];
  let inTitle = true;

  for (const line of lines) {
    if (inTitle && line.startsWith('# ')) {
      title = line.slice(2).trim();
      inTitle = false;
      continue;
    }
    if (!inTitle || !line.startsWith('#')) {
      inTitle = false;
      body.push(line);
    }
  }

  // Extract date from filename: pidgin-2026-02-01-114310-artifact.md
  const dateMatch = filename.match(/(\d{4})-(\d{2})-(\d{2})-(\d{6})/);
  let date = null;
  if (dateMatch) {
    const [, year, month, day, time] = dateMatch;
    const hours = time.slice(0, 2);
    const minutes = time.slice(2, 4);
    const seconds = time.slice(4, 6);
    date = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  return {
    filename,
    title,
    date,
    text: body.join('\n').trim()
  };
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

function generateReadingChunks(readings) {
  return readings.map(reading => ({
    text: reading.text,
    source: reading.filename,
    role: 'librarian',
    scale: 'reading',
    title: reading.title
  }));
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

function formatConversationAsText(conv) {
  const lines = [`# ${conv.title}`];
  if (conv.frontmatter.date) lines.push(`date: ${conv.frontmatter.date}`);
  lines.push('');

  for (const turn of conv.turns) {
    lines.push(`## ${turn.role}`);
    lines.push('');
    lines.push(turn.text);
    lines.push('');
  }

  return lines.join('\n');
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function writeRawFiles(conversations, readings, terms, chunks, occurrences) {
  const RAW_DIR = 'dist/raw';

  await mkdir(RAW_DIR, { recursive: true });
  await mkdir(join(RAW_DIR, 'atoms'), { recursive: true });
  await mkdir(join(RAW_DIR, 'conversations'), { recursive: true });
  await mkdir(join(RAW_DIR, 'readings'), { recursive: true });

  // corpus.txt - all conversations
  const corpusText = conversations
    .map(formatConversationAsText)
    .join('\n---\n\n');
  await writeFile(join(RAW_DIR, 'corpus.txt'), corpusText);
  console.log('Wrote dist/raw/corpus.txt');

  // atoms.txt - list of terms
  const atomsText = terms.map(t => {
    const count = occurrences[t.term]?.length || 0;
    const aliases = t.aliases.length ? ` (${t.aliases.join(', ')})` : '';
    return `${t.term}${aliases} - ${count} occurrences`;
  }).join('\n');
  await writeFile(join(RAW_DIR, 'atoms.txt'), atomsText);
  console.log('Wrote dist/raw/atoms.txt');

  // atoms/[term].txt - occurrences for each term
  for (const term of terms) {
    const indices = occurrences[term.term] || [];
    const passages = indices.map(i => {
      const chunk = chunks[i];
      const conv = conversations.find(c => c.filename === chunk.source);
      return `[${conv?.title || chunk.source} / ${chunk.role}]\n${chunk.text}`;
    });
    const termText = passages.length > 0
      ? passages.join('\n\n---\n\n')
      : '(no occurrences)';
    await writeFile(join(RAW_DIR, 'atoms', `${slugify(term.term)}.txt`), termText);
  }
  console.log(`Wrote ${terms.length} atom files`);

  // conversations/[slug].txt - individual conversations
  for (const conv of conversations) {
    const slug = slugify(conv.title);
    await writeFile(
      join(RAW_DIR, 'conversations', `${slug}.txt`),
      formatConversationAsText(conv)
    );
  }
  console.log(`Wrote ${conversations.length} conversation files`);

  // readings/[slug].txt - librarian artifacts
  for (const reading of readings) {
    const slug = slugify(reading.title);
    const text = `# ${reading.title}\n${reading.date ? `date: ${reading.date}\n` : ''}\n${reading.text}`;
    await writeFile(join(RAW_DIR, 'readings', `${slug}.txt`), text);
  }
  console.log(`Wrote ${readings.length} reading files`);

  // readings.txt - all readings concatenated
  const readingsText = readings
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .map(r => `# ${r.title}\n${r.date ? `date: ${r.date}\n` : ''}\n${r.text}`)
    .join('\n\n---\n\n');
  await writeFile(join(RAW_DIR, 'readings.txt'), readingsText);
  console.log('Wrote dist/raw/readings.txt');
}

async function main() {
  console.log('Building index...');

  // Load terms
  const termsText = await readFile(TERMS_FILE, 'utf-8');
  const terms = parseTerms(termsText);
  console.log(`Loaded ${terms.length} terms`);

  // Load conversations, sorted by frontmatter date
  const files = await readdir(CONVERSATIONS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  const conversations = [];
  for (const file of mdFiles) {
    const content = await readFile(join(CONVERSATIONS_DIR, file), 'utf-8');
    conversations.push(parseConversation(content, file));
  }

  conversations.sort((a, b) => {
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
    return dateA - dateB;
  });
  console.log(`Loaded ${conversations.length} conversations`);

  // Load librarian readings
  let readings = [];
  try {
    const readingFiles = await readdir(LIBRARIAN_DIR);
    const mdReadings = readingFiles.filter(f => f.endsWith('.md'));
    for (const file of mdReadings) {
      const content = await readFile(join(LIBRARIAN_DIR, file), 'utf-8');
      readings.push(parseReading(content, file));
    }
    readings.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    console.log(`Loaded ${readings.length} readings`);
  } catch (err) {
    console.log('No librarian readings found');
  }

  // Generate chunks from conversations and readings
  const conversationChunks = generateChunks(conversations);
  const readingChunks = generateReadingChunks(readings);
  const chunks = [...conversationChunks, ...readingChunks];
  console.log(`Generated ${chunks.length} chunks (${conversationChunks.length} from conversations, ${readingChunks.length} from readings)`);

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
    readings,
    chunks,
    occurrences,
    embeddings,
    buildTime: new Date().toISOString()
  };

  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Wrote ${OUTPUT_FILE}`);

  // Write raw files for machine consumption
  await writeRawFiles(conversations, readings, terms, chunks, occurrences);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
