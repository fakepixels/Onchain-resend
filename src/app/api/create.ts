import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailTemplate } from '../../components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email } = req.body;

    // Create contact
    const contactResult = await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
    });

    if (contactResult.error) {
      console.error('Resend API error (create contact):', contactResult.error);
      return res.status(400).json({ error: 'Failed to create contact' });
    }

    // Send email
    const emailResult = await resend.emails.send({
      from: 'Company Name <delivered@resend.dev>',
      to: [email],
      subject: 'Welcome to Smart Wallet',
      react: EmailTemplate({ firstName }),
    });

    if (emailResult.error) {
      console.error('Resend API error (send email):', emailResult.error);
      return res.status(400).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({
      message: 'Contact created and email sent successfully',
      contact: contactResult.data,
      email: emailResult.data,
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};