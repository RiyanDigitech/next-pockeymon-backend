// import { NextResponse, NextRequest } from 'next/server';
// import { connectDB } from '@/lib/db';
// import { authMiddleware } from '@/middleware/authMiddleware';
// import { TeamController } from '@/controllers/teamController';
// import { UpdateTeamBody, AuthRequest } from '@/types'; // Import AuthRequest from your types file

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   // Run the middleware. It will add the 'user' property to 'req' if successful.
//   const authError = await authMiddleware(req as AuthRequest);
//   if (authError) return authError;

//   // Now you can safely access req.user
//   const authenticatedRequest = req as AuthRequest;

//   try {
//     await connectDB();
//     const teamId = params.id;
//     const body = (await req.json()) as UpdateTeamBody;
//     const result = await TeamController.updateTeam(authenticatedRequest.user!.userId, teamId, body);
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 400 });
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   // Run the middleware
//   const authError = await authMiddleware(req as AuthRequest);
//   if (authError) return authError;

//   // Cast to AuthRequest to access the user property
//   const authenticatedRequest = req as AuthRequest;

//   try {
//     await connectDB();
//     const teamId = params.id;
//     const result = await TeamController.deleteTeam(authenticatedRequest.user!.userId, teamId);
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 400 });
//   }
// }
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { authMiddleware } from '@/middleware/authMiddleware';
import { TeamController } from '@/controllers/teamController';
import { UpdateTeamBody } from '@/types';

interface AuthRequest extends NextRequest {
  user?: { userId: string };
}

// ✅ Works in Next.js 15.5.x and earlier 14.x — no RouteContext needed
export async function PUT(
  req: AuthRequest,
  { params }: { params: { id: string } }
) {
  const authError = await authMiddleware(req);
  if (authError) return authError;

  try {
    await connectDB();
    const teamId = params.id;
    const body = (await req.json()) as UpdateTeamBody;
    const result = await TeamController.updateTeam(req.user!.userId, teamId, body);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  req: AuthRequest,
  { params }: { params: { id: string } }
) {
  const authError = await authMiddleware(req);
  if (authError) return authError;

  try {
    await connectDB();
    const teamId = params.id;
    const result = await TeamController.deleteTeam(req.user!.userId, teamId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
