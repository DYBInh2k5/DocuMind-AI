import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

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
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            + Upload Document
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              Documents
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              Queries Used
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-3xl font-bold text-purple-600">Free</div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              Current Plan
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Ask AI Assistant
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Ask a question about your documents..."
              className="flex-1 rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Recent Documents
          </h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl opacity-50">📄</div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              No documents yet. Upload your first document to get started!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
