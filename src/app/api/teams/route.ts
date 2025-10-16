import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { authMiddleware } from '@/middleware/authMiddleware';
import { TeamController } from '@/controllers/teamController';
import { CreateTeamBody } from '@/types';

// Define AuthRequest type specifically for this route
interface AuthRequest extends NextRequest {
  user?: { userId: string };
}

export async function GET(req: AuthRequest) {
  const authError = await authMiddleware(req);
  if (authError) return authError;

  try {
    await connectDB();
    const result = await TeamController.getAllTeams(req.user!.userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: AuthRequest) {
  const authError = await authMiddleware(req);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await req.json() as CreateTeamBody;
    const result = await TeamController.createTeam(req.user!.userId, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}