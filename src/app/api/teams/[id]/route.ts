import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { authMiddleware } from '@/middleware/authMiddleware';
import { TeamController } from '@/controllers/teamController';
import { UpdateTeamBody } from '@/types';

// Define AuthRequest locally
interface AuthRequest extends NextRequest {
  user?: { userId: string };
}

// PUT handler
export async function PUT(req: AuthRequest, context: { params: Promise<{ id: string }> }) {
  const authError = await authMiddleware(req);
  if (authError) return authError;

  try {
    await connectDB();
    const params = await context.params; // Resolve Promise
    const teamId = params.id;
    const body = await req.json() as UpdateTeamBody;
    const result = await TeamController.updateTeam(req.user!.userId, teamId, body);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

// DELETE handler
export async function DELETE(req: AuthRequest, context: { params: Promise<{ id: string }> }) {
  const authError = await authMiddleware(req);
  if (authError) return authError;

  try {
    await connectDB();
    const params = await context.params; // Resolve Promise
    const teamId = params.id;
    const result = await TeamController.deleteTeam(req.user!.userId, teamId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}