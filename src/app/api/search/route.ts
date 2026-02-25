import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { searchDocuments } from '@/lib/pinecone';
import { answerQuestion } from '@/lib/openai';
import { rateLimit } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Rate limiting based on plan
    const limits = {
      FREE: 100,
      PRO: Infinity,
      ENTERPRISE: Infinity,
    };

    const limit = limits[user.plan as keyof typeof limits];
    if (limit !== Infinity) {
      const { success } = await rateLimit(`queries:${userId}`, limit, 2592000); // 30 days
      if (!success) {
        return NextResponse.json(
          { error: 'Query limit reached. Please upgrade your plan.' },
          { status: 429 }
        );
      }
    }

    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Search similar documents using vector search
    const results = await searchDocuments(query, user.id, 5);

    if (!results || results.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find any relevant documents to answer your question.",
        sources: [],
      });
    }

    // Extract context from matched documents
    const context = results
      .map((match) => match.metadata?.content as string)
      .filter(Boolean);

    // Generate answer using OpenAI
    const answer = await answerQuestion(query, context);

    // Get document details for sources
    const documentIds = [
      ...new Set(results.map((r) => r.metadata?.documentId as string)),
    ];
    const { data: documents } = await supabaseAdmin
      .from('documents')
      .select('id, title, file_name')
      .in('id', documentIds);

    // Save query to database
    await supabaseAdmin.from('queries').insert({
      user_id: user.id,
      query,
      response: answer,
      document_ids: documentIds,
    });

    return NextResponse.json({
      answer,
      sources: documents || [],
      matches: results.length,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process query' },
      { status: 500 }
    );
  }
}
