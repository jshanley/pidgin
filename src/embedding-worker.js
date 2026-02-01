import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

env.allowLocalModels = false;

let embedder = null;

self.onmessage = async (e) => {
  const { type, chunks } = e.data;

  if (type === 'embed') {
    try {
      // Load model if not loaded
      if (!embedder) {
        self.postMessage({ type: 'status', message: 'Loading model...' });
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      }

      // Embed each chunk
      const embeddings = [];
      for (let i = 0; i < chunks.length; i++) {
        const result = await embedder(chunks[i], { pooling: 'mean', normalize: true });
        embeddings.push(Array.from(result.data));

        // Progress update every 10 chunks
        if (i % 10 === 0) {
          self.postMessage({ type: 'progress', current: i, total: chunks.length });
        }
      }

      self.postMessage({ type: 'complete', embeddings });
    } catch (error) {
      self.postMessage({ type: 'error', message: error.message });
    }
  }
};
