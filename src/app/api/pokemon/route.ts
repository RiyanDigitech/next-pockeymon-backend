import { NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { PokemonController } from '@/controllers/pokemonController';
import { AuthRequest } from '@/types';

export async function GET(req: AuthRequest) {
  const authError = await authMiddleware(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const name = searchParams.get('name') || undefined;

    const result = await PokemonController.getPokemon(limit, offset, name);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}