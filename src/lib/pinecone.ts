import { Pinecone } from '@pinecone-database/pinecone';

const pineconeApiKey = process.env.PINECONE_API_KEY;

const pinecone = pineconeApiKey
  ? new Pinecone({
      apiKey: pineconeApiKey,
    })
  : null;

export const pineconeIndex = pinecone
  ? pinecone.index(process.env.PINECONE_INDEX_NAME || 'documind-vectors')
  : null;

// Helper function to generate embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
}

// Search documents by semantic similarity
export async function searchDocuments(
  query: string,
  userId: string,
  topK: number = 10
) {
  if (!pineconeIndex) {
    throw new Error('Pinecone not configured');
  }
  
  const embedding = await generateEmbedding(query);

  const results = await pineconeIndex.query({
    vector: embedding,
    topK,
    includeMetadata: true,
    filter: {
      userId,
    },
  });

  return results.matches;
}
