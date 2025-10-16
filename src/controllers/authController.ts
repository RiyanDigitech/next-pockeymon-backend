import { UserService } from '@/services/userService';
import { SignupBody, LoginBody, AuthResponse } from '@/types';

export class AuthController {
  static async signup(body: SignupBody): Promise<Omit<AuthResponse, 'token'>> {
    const payload = await UserService.createUser(body);
    return { message: 'User created successfully', details: payload };
  }

  static async login(body: LoginBody): Promise<AuthResponse> {
    const { payload, token } = await UserService.loginUser(body.email, body.password);
    return { message: 'Login successful', details: payload, token };
  }
}