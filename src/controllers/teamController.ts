import { TeamService } from '@/services/teamService';
import { CreateTeamBody, UpdateTeamBody, TeamPayload } from '@/types';

export class TeamController {
  static async createTeam(userId: string, body: CreateTeamBody): Promise<{ message: string; team: TeamPayload }> {
    const team = await TeamService.createTeam(userId, body);
    return { message: 'Team created', team };
  }

  static async updateTeam(userId: string, teamId: string, body: UpdateTeamBody): Promise<{ message: string; team: TeamPayload }> {
    const team = await TeamService.updateTeam(userId, teamId, body);
    return { message: 'Team updated', team };
  }

  static async getAllTeams(userId: string): Promise<{ teams: TeamPayload[] }> {
    const teams = await TeamService.getAllTeams(userId);
    return { teams };
  }

  static async deleteTeam(userId: string, teamId: string): Promise<{ message: string }> {
    await TeamService.deleteTeam(userId, teamId);
    return { message: 'Team deleted' };
  }
}