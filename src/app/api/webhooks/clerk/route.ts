import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { supabaseAdmin } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/resend';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const svix_id = headersList.get('svix-id');
    const svix_timestamp = headersList.get('svix-timestamp');
    const svix_signature = headersList.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
    }

    const body = await req.text();
    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (evt.type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses[0]?.email_address;
        const name = `${first_name || ''} ${last_name || ''}`.trim();

        if (!email) break;

        // Create user in database
        await supabaseAdmin.from('users').insert({
          clerk_id: id,
          email,
          name: name || null,
          plan: 'FREE',
        });

        // Send welcome email
        await sendWelcomeEmail(email, name || 'User');
        break;
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses[0]?.email_address;
        const name = `${first_name || ''} ${last_name || ''}`.trim();

        if (!email) break;

        // Update user in database
        await supabaseAdmin
          .from('users')
          .update({
            email,
            name: name || null,
          })
          .eq('clerk_id', id);
        break;
      }

      case 'user.deleted': {
        const { id } = evt.data;

        if (!id) break;

        // Delete user from database (cascade will handle related records)
        await supabaseAdmin.from('users').delete().eq('clerk_id', id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Clerk webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
