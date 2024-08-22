import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailTemplate } from '../../components/EmailTemplate';
import { Resend } from 'resend';

// Use RESEND_API_KEY instead of NEXT_PUBLIC_RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, email } = req.body; // Assuming these are sent from the client

    const { data, error } = await resend.emails.send({
      from: 'Company Name <delivered@resend.dev>',
      to: [email],
      subject: 'Welcome to Smart Wallet',
      react: EmailTemplate({ firstName }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(400).json({ error: 'Failed to send email' });
    }

    // Call the create API to create a contact
    const createResponse = await fetch('/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!createResponse.ok) {
      const createError = await createResponse.text();
      console.error('Error creating contact:', createError);
      return res.status(400).json({ error: 'Failed to create contact' });
    }

    return res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};