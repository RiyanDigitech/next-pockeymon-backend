import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    (req as any).user = decoded; // TODO: Replace with proper type
    return null;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Access token expired' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}