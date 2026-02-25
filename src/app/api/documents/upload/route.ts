import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/redis';
import { pineconeIndex, generateEmbedding } from '@/lib/pinecone';
import { generateSummary } from '@/lib/openai';
import mammoth from 'mammoth';

export const runtime = 'nodejs';

// Import pdf-parse - use any type to bypass ESM module issues
const getPdfParse = async (): Promise<any> => {
  const pdfParse = await import('pdf-parse');
  return (pdfParse as any).default || pdfParse;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const { success, remaining } = await rateLimit(`upload:${userId}`, 10, 3600);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Vercel Serverless body size limit is ~10MB; enforce a safe limit
    const maxFileSizeBytes = 9 * 1024 * 1024; // 9MB
    if (file.size > maxFileSizeBytes) {
      return NextResponse.json(
        { error: 'File too large. Please upload files under 9MB.' },
        { status: 413 }
      );
    }

    // Get user from database
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check document limit based on plan
    const { count } = await supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const limits = {
      FREE: 10,
      PRO: 1000,
      ENTERPRISE: Infinity,
    };

    if (count && count >= limits[user.plan as keyof typeof limits]) {
      return NextResponse.json(
        { error: 'Document limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Extract text from file
    const buffer = await file.arrayBuffer();
    let content = '';

    if (file.type === 'application/pdf') {
      const pdfParse = await getPdfParse();
      const pdfData = await pdfParse(Buffer.from(buffer));
      content = pdfData.text;
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      content = result.value;
    } else if (file.type === 'text/plain') {
      content = await file.text();
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Generate summary
    const summary = await generateSummary(content.slice(0, 5000)); // First 5000 chars

    // Save document to database
    const { data: document, error } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: user.id,
        title: file.name.replace(/\.[^/.]+$/, ''),
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        content,
        summary,
        storage_path: `${user.id}/${Date.now()}-${file.name}`,
      })
      .select()
      .single();

    if (error) throw error;

    let embeddingWarning: string | null = null;

    // Generate embeddings and store in Pinecone (non-fatal if it fails)
    try {
      const chunks = chunkText(content, 1000); // Split into chunks
      const embeddings = await Promise.all(
        chunks.map(async (chunk, index) => ({
          id: `${document.id}-chunk-${index}`,
          values: await generateEmbedding(chunk, 'passage'),
          metadata: {
            documentId: document.id,
            userId: user.id,
            content: chunk,
            chunkIndex: index,
          },
        }))
      );

      if (pineconeIndex) {
        await pineconeIndex.namespace('').upsert(embeddings as any);
      } else {
        embeddingWarning = 'Pinecone not configured; embeddings skipped.';
      }
    } catch (embedError: any) {
      console.error('Embedding error:', embedError);
      embeddingWarning = 'Embedding failed; document uploaded without vector search.';
    }

    return NextResponse.json({ document, remaining, embeddingWarning });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// Helper function to split text into chunks
function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
