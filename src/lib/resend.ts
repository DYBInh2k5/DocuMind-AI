import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@documind.ai';

// Welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.log('Resend not configured, skipping email');
    return null;
  }
  
  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Welcome to DocuMind AI! 🎉',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining DocuMind AI - Your intelligent document assistant.</p>
      <p>You can now:</p>
      <ul>
        <li>Upload and manage documents</li>
        <li>Search using AI-powered semantic search</li>
        <li>Ask questions about your documents</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a></p>
    `,
  });
}

// Document shared notification
export async function sendDocumentSharedEmail(
  email: string,
  documentName: string,
  sharedBy: string
) {
  if (!resend) {
    console.log('Resend not configured, skipping email');
    return null;
  }
  
  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `${sharedBy} shared a document with you`,
    html: `
      <h1>Document Shared</h1>
      <p><strong>${sharedBy}</strong> has shared <strong>${documentName}</strong> with you.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View Document</a></p>
    `,
  });
}

// Payment confirmation
export async function sendPaymentConfirmation(
  email: string,
  plan: string,
  amount: number
) {
  if (!resend) {
    console.log('Resend not configured, skipping email');
    return null;
  }
  
  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Payment Confirmation - DocuMind AI',
    html: `
      <h1>Payment Successful</h1>
      <p>Thank you for subscribing to the <strong>${plan}</strong> plan!</p>
      <p>Amount: $${amount}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a></p>
    `,
  });
}
