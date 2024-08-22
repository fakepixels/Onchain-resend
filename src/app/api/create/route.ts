import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function POST(request: Request) {
     try {
       const { firstName, email } = await request.json();

       const { data, error } = await resend.contacts.create({
         email,
         firstName,
         audienceId: process.env.RESEND_AUDIENCE_ID || '',
       });

       if (error) {
         console.error('Contact creation error:', error);
         return Response.json({ error: 'Failed to create contact' }, { status: 500 });
       }

       return Response.json({ success: true, data });
     } catch (error) {
       console.error('Unexpected error:', error);
       return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
     }
   }