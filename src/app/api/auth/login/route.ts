import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AuthController } from '@/controllers/authController';
import { LoginBody } from '@/types';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: LoginBody = await req.json();
    const result = await AuthController.login(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}