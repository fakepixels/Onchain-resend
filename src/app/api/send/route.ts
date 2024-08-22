import { EmailTemplate } from '../../../components/EmailTemplate';
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function POST(request: Request) {
     try {
       const { firstName, email } = await request.json();

       const { data, error } = await resend.emails.send({
         from: 'My app <delivered@resend.dev>',
         to: [email],
         subject: 'Welcome to Our Newsletter!',
         react: EmailTemplate({ firstName }),
       });

       if (error) {
         console.error('Email error:', error);
         return Response.json({ error: 'Failed to send email' }, { status: 500 });
       }

       return Response.json({ success: true, data });
     } catch (error) {
       console.error('Unexpected error:', error);
       return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
     }
   }