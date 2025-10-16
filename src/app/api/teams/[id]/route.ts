import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { authMiddleware } from '@/middleware/authMiddleware';
import { TeamController } from '@/controllers/teamController';
import { UpdateTeamBody, AuthRequest } from '@/types';

// Route handler ke doosre argument ke liye ek saaf type define karein
// Yeh best practice hai aur build errors se bachata hai
type RouteContext = {
  params: {
    id: string;
  };
};

// =================================================================
//                        UPDATE A TEAM (PUT)
// =================================================================
export async function PUT(req: NextRequest, context: RouteContext) {
  // Middleware ko call karein. Kamyab hone par yeh 'req' mein 'user' daal dega.
  // Hum 'req' ko AuthRequest ke tor par cast karte hain taake middleware usay process kar sake.
  const authError = await authMiddleware(req as AuthRequest);
  if (authError) {
    return authError;
  }

  // Ab hum yaqeen se 'req' ko AuthRequest maan sakte hain
  const authenticatedRequest = req as AuthRequest;
  
  try {
    await connectDB();

    // Context object se 'params' aur phir 'id' nikalein
    const { params } = context;
    const teamId = params.id;
    
    const body = (await req.json()) as UpdateTeamBody;
    
    // Controller ko call karein
    const result = await TeamController.updateTeam(
      authenticatedRequest.user!.userId,
      teamId,
      body
    );
    
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // Aam errors ko handle karein
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// =================================================================
//                        DELETE A TEAM
// =================================================================
export async function DELETE(req: NextRequest, context: RouteContext) {
  // Middleware ko call karein
  const authError = await authMiddleware(req as AuthRequest);
  if (authError) {
    return authError;
  }
  
  // Ab 'req' authenticated hai
  const authenticatedRequest = req as AuthRequest;

  try {
    await connectDB();
    
    // Context se teamId nikalein
    const { params } = context;
    const teamId = params.id;
    
    // Controller ko call karein
    const result = await TeamController.deleteTeam(
      authenticatedRequest.user!.userId,
      teamId
    );
    
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
