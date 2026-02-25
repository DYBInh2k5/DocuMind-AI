import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;

// Answer questions about documents using context
export async function answerQuestion(
  question: string,
  context: string[]
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI not configured');
  }
  
  const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided document context. 
If the answer cannot be found in the context, say "I don't have enough information to answer that question."`;

  const userPrompt = `Context from documents:
${context.join('\n\n---\n\n')}

Question: ${question}

Please provide a detailed answer based on the context above.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content || 'No response generated.';
}

// Generate document summary
export async function generateSummary(content: string): Promise<string> {
  if (!openai) {
    return 'Summary not available (OpenAI not configured)';
  }
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that creates concise summaries of documents.',
      },
      {
        role: 'user',
        content: `Please provide a brief summary (3-5 sentences) of the following document:\n\n${content}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 500,
  });

  return response.choices[0].message.content || 'Summary not available.';
}
