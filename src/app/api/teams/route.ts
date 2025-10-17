// src/app/api/teams/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { authMiddleware } from '@/middleware/authMiddleware';
import { TeamController } from '@/controllers/teamController';
// CORRECT: AuthRequest aur doosri types ko global types file se import karein
import { CreateTeamBody, AuthRequest } from '@/types';

// INCORRECT: Yahan se local interface ko DELETE kar dein
/*
interface AuthRequest extends NextRequest {
  user?: { userId: string };
}
*/

// export async function GET(req: NextRequest) { // Change to NextRequest
//   const authError = await authMiddleware(req as AuthRequest);
//   if (authError) return authError;

//   try {
//     await connectDB();
//     // Cast karein jab req.user ki zaroorat ho
//     const result = await TeamController.getAllTeams((req as AuthRequest).user!.userId);
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest) {
  const authError = await authMiddleware(req as AuthRequest);
  if (authError) return authError;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await TeamController.getAllTeams(
      (req as AuthRequest).user!.userId,
      page,
      limit
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) { // Change to NextRequest
  const authError = await authMiddleware(req as AuthRequest);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await req.json() as CreateTeamBody;
    // Cast karein jab req.user ki zaroorat ho
    const result = await TeamController.createTeam((req as AuthRequest).user!.userId, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}