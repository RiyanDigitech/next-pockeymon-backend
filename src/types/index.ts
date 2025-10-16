import { NextRequest } from 'next/server';

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  message: string;
  details?: UserPayload;
  token?: string;
}

export interface AuthRequest extends NextRequest {
  user?: { userId: string };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface Pokemon {
  id: string;
  name: string;
  image: string;
  types: string[];
  baseExperience: number;
}

// New: Type for PokéAPI's type object
export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}