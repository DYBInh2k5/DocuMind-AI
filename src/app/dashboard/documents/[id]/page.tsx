import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { DeleteDocumentButton } from '@/components/delete-document-button';

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const { id } = await params;

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!user) {
    redirect('/');
  }

  const { data: document } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!document) {
    redirect('/dashboard/documents');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-6 py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{document.title}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {document.file_name} · {Math.max(1, Math.round(document.file_size / 1024))} KB
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Uploaded: {new Date(document.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/documents"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Back
            </Link>
            <DeleteDocumentButton documentId={document.id} />
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Summary</h2>
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
            {document.summary || 'No summary available.'}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Content Preview</h2>
          <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
            {document.content}
          </pre>
        </div>
      </main>
    </div>
  );
}
