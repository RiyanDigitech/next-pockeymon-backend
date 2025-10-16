import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authMiddleware } from '@/middleware/authMiddleware';
import { UserController } from '@/controllers/userController';

export async function GET(req: NextRequest) {
  const authError = await authMiddleware(req);
  if (authError) return authError;  // If middleware returns error response

  try {
    await connectDB();
    const result = await UserController.getAllUsers();
    return NextResponse.json(result, { status: 200 });
  }catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}