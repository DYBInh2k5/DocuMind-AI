import { Pinecone } from '@pinecone-database/pinecone';

const pineconeApiKey = process.env.PINECONE_API_KEY;
const openAiKey = process.env.OPENAI_API_KEY;

const pinecone = pineconeApiKey
  ? new Pinecone({
      apiKey: pineconeApiKey,
    })
  : null;

export const pineconeIndex = pinecone
  ? pinecone.index(process.env.PINECONE_INDEX_NAME || 'documind-vectors')
  : null;

type EmbeddingInputType = 'passage' | 'query';

// Helper function to generate embeddings
export async function generateEmbedding(
  text: string,
  inputType: EmbeddingInputType = 'passage'
): Promise<number[]> {
  if (openAiKey) {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  }

  if (!pineconeApiKey) {
    throw new Error('No embedding provider configured');
  }

  const model = process.env.PINECONE_EMBEDDING_MODEL || 'llama-text-embed-v2';
  const response = await fetch('https://api.pinecone.io/embed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': pineconeApiKey,
      'X-Pinecone-Api-Version': '2025-10',
    },
    body: JSON.stringify({
      model,
      parameters: {
        input_type: inputType,
        truncate: 'END',
      },
      inputs: [{ text }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinecone embed failed: ${errorText}`);
  }

  const data = await response.json();
  return data.data[0].values;
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
  
  const embedding = await generateEmbedding(query, 'query');

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
