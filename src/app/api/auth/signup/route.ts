import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AuthController } from '@/controllers/authController';
import { SignupBody } from '@/types';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: SignupBody = await req.json();  // Body parse yahan, lekin validation controller/service mein
    const result = await AuthController.signup(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}