import { UserService } from '@/services/userService';
import { SignupBody, LoginBody, AuthResponse, UserPayload } from '@/types';

export class AuthController {
  // Signup: No token
  static async signup(body: SignupBody): Promise<Omit<AuthResponse, 'token'>> {
    const payload = await UserService.createUser(body);
    return { message: 'User created successfully', details: payload };
  }

  // Login: With token
  static async login(body: LoginBody): Promise<AuthResponse> {
    const { payload, token } = await UserService.loginUser(body.email, body.password);
    return { message: 'Login successful', details: payload, token };
  }
 
}