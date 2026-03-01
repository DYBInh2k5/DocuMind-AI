import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { UploadDocumentButton } from '@/components/upload-document-button';
import { AskAssistant } from '@/components/ask-assistant';
import { DeleteDocumentButton } from '@/components/delete-document-button';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  if (!user) {
    redirect('/');
  }

  const [{ count: documentCount }, { count: queryCount }, { data: recentDocuments }] = await Promise.all([
    supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabaseAdmin
      .from('queries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabaseAdmin
      .from('documents')
      .select('id, title, file_name, file_size, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              DocuMind AI
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300"
            >
              Upgrade
            </Link>
            <Link
              href="/api/auth/signout"
              className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300"
            >
              Sign Out
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Documents
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Upload and manage your documents
            </p>
          </div>
          <UploadDocumentButton />
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-3xl font-bold text-blue-600">{documentCount || 0}</div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              Documents
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-3xl font-bold text-green-600">{queryCount || 0}</div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              Queries Used
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-3xl font-bold text-purple-600">{user.plan}</div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              Current Plan
            </div>
          </div>
        </div>

        <AskAssistant />

        {/* Documents List */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Documents</h2>
            <Link
              href="/dashboard/documents"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          {recentDocuments && recentDocuments.length > 0 ? (
            <div className="space-y-3">
              {recentDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{document.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{document.file_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                      <p>{Math.max(1, Math.round(document.file_size / 1024))} KB</p>
                      <p>{new Date(document.created_at).toLocaleDateString()}</p>
                    </div>
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl opacity-50">📄</div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                No documents yet. Upload your first document to get started!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
