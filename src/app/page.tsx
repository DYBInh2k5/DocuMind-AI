import Link from 'next/link';
import { SignInButton } from '@/components/sign-in-button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">📄</div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              DocuMind AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
            >
              Pricing
            </Link>
            <SignInButton mode="modal">
              <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-7xl">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Document Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
            Upload documents, ask questions, get instant AI-powered answers.
            <br />
            Search through your knowledge base with semantic understanding.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <SignInButton mode="modal">
              <button className="w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 sm:w-auto"
              >
                Get Started Free
              </button>
            </SignInButton>
            <Link
              href="/pricing"
              className="w-full rounded-lg border-2 border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 sm:w-auto"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              AI Search
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Semantic search through all your documents with natural language
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-4 text-4xl">💬</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Q&A Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ask questions and get instant answers from your documents
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-4 text-4xl">⚡</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Smart Summaries
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Auto-generate summaries and extract key insights instantly
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>
          © {new Date().getFullYear()} DocuMind AI. Built with Next.js, Supabase,
          and Pinecone.
        </p>
      </footer>
    </div>
  );
}
