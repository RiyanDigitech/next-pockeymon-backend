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
  token?: string; // Optional
}

export interface AuthRequest extends NextRequest {
  user?: { userId: string };
}