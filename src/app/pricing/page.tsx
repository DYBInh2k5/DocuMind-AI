import Link from 'next/link';
import { STRIPE_PLANS } from '@/lib/stripe';
import { SignInButton } from '@/components/sign-in-button';
import { auth } from '@clerk/nextjs/server';

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">📄</div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              DocuMind AI
            </span>
          </Link>
          <Link
            href={userId ? '/dashboard' : '/'}
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
          >
            {userId ? 'Dashboard' : 'Home'}
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-extrabold text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {STRIPE_PLANS.FREE.name}
            </h3>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                ${STRIPE_PLANS.FREE.price}
              </span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>
            <ul className="mb-8 space-y-4">
              {STRIPE_PLANS.FREE.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            {!userId ? (
              <SignInButton mode="modal">
                <button className="w-full rounded-lg border-2 border-blue-600 py-3 font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900">
                  Get Started
                </button>
              </SignInButton>
            ) : (
              <button className="w-full rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-400" disabled>
                Current Plan
              </button>
            )}
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 shadow-2xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-gray-900">
              POPULAR
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              {STRIPE_PLANS.PRO.name}
            </h3>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-white">
                ${STRIPE_PLANS.PRO.price}
              </span>
              <span className="text-blue-100">/month</span>
            </div>
            <ul className="mb-8 space-y-4">
              {STRIPE_PLANS.PRO.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full rounded-lg bg-white py-3 font-semibold text-blue-600 hover:bg-blue-50">
              {userId ? 'Upgrade to Pro' : 'Get Started'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {STRIPE_PLANS.ENTERPRISE.name}
            </h3>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                ${STRIPE_PLANS.ENTERPRISE.price}
              </span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>
            <ul className="mb-8 space-y-4">
              {STRIPE_PLANS.ENTERPRISE.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
              {userId ? 'Upgrade to Enterprise' : 'Get Started'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
