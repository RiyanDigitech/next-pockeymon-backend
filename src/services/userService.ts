import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { SignupBody, LoginBody, UserPayload } from '@/types';

export class UserService {
  // Only create user, no token
  static async createUser(body: SignupBody): Promise<UserPayload> {
    const { name, email, password, phone } = body;

    if (!name || !email || !password || !phone) {
      throw new Error('All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }

  // Login: return payload + token
  static async loginUser(email: string, password: string): Promise<{ payload: UserPayload; token: string }> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const payload: UserPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    return { payload, token };
  }


  static async getAllUsers(): Promise<UserPayload[]> {
    const users = await User.find({}).select('-password -__v');  // Explicitly exclude password/__v
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));
  }
}