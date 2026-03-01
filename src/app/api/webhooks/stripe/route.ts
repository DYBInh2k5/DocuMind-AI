import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendPaymentConfirmation } from '@/lib/resend';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId || !plan) break;

        // Update user's plan and subscription
        await supabaseAdmin
          .from('users')
          .update({
            plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('clerk_id', userId);

        // Get user email
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('email')
          .eq('clerk_id', userId)
          .single();

        if (user) {
          const planDetails = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
          await sendPaymentConfirmation(
            user.email,
            planDetails.name,
            planDetails.price
          );
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        // Get user by stripe customer ID
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!user) break;

        if (event.type === 'customer.subscription.deleted') {
          // Downgrade to free plan
          await supabaseAdmin
            .from('users')
            .update({
              plan: 'FREE',
              stripe_subscription_id: null,
            })
            .eq('id', user.id);
        } else {
          // Update subscription ID if changed
          await supabaseAdmin
            .from('users')
            .update({
              stripe_subscription_id: subscription.id,
            })
            .eq('id', user.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        // Get user and send notification email
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('email')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          // Could send a payment failed email here
          console.log('Payment failed for user:', user.email);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Webhook handler failed';
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
