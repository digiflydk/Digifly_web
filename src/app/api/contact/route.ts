import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = formSchema.parse(body);

    // In a real application, you would handle the form data here, e.g.:
    // - Send an email
    // - Save to a database (like Firestore)
    // - Trigger a workflow

    console.log('Contact form submitted:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ message: 'Message received successfully!' }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input.', details: error.errors }, { status: 400 });
    }
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
