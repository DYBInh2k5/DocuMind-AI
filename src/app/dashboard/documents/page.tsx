import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { DeleteDocumentButton } from '@/components/delete-document-button';

const PAGE_SIZE = 10;

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page || 1) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!user) {
    redirect('/');
  }

  const [{ count }, { data: documents }] = await Promise.all([
    supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabaseAdmin
      .from('documents')
      .select('id, title, file_name, file_size, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to),
  ]);

  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Documents</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} / {totalPages} · {total} documents
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-xl bg-white shadow dark:bg-gray-800">
          {documents && documents.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">{document.title}</p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{document.file_name}</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {Math.max(1, Math.round(document.file_size / 1024))} KB ·{' '}
                      {new Date(document.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/documents/${document.id}`}
                      className="rounded border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950"
                    >
                      View
                    </Link>
                    <DeleteDocumentButton documentId={document.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
              No documents found.
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={currentPage > 1 ? `/dashboard/documents?page=${currentPage - 1}` : '#'}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              currentPage > 1
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                : 'cursor-not-allowed border border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600'
            }`}
          >
            Previous
          </Link>

          <Link
            href={currentPage < totalPages ? `/dashboard/documents?page=${currentPage + 1}` : '#'}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              currentPage < totalPages
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                : 'cursor-not-allowed border border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600'
            }`}
          >
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}
