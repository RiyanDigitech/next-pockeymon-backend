import { UserService } from '@/services/userService';
import { UserPayload } from '@/types';

export class UserController {
  static async getAllUsers(): Promise<{ users: UserPayload[] }> {
    const users = await UserService.getAllUsers();
    return { users };
  }
}