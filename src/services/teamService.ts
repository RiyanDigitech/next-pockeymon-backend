import Team from '@/models/Team';
import { CreateTeamBody, UpdateTeamBody, TeamPayload } from '@/types';

// Interface for MongoDB error
interface MongoError {
  code?: number;
  message: string;
}

export class TeamService {
  // Helper: Validate Pokémon name via PokéAPI
  private static async validatePokemonName(name: string): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) {
      throw new Error(`Invalid Pokémon name: ${name}`);
    }
  }

  static async createTeam(userId: string, body: CreateTeamBody): Promise<TeamPayload> {
    const { name, pokemons } = body;

    // Check if team name already exists
    const existingTeam = await Team.findOne({ userId, name });
    if (existingTeam) {
      throw new Error('Team name already exists');
    }

    // Validation: Max 6 Pokémon
    if (pokemons.length > 6) {
      throw new Error('Maximum 6 Pokémon allowed per team');
    }

    // No duplicates in team
    const uniquePokemons = new Set(pokemons.map((name) => name.toLowerCase()));
    if (uniquePokemons.size !== pokemons.length) {
      throw new Error('Duplicate Pokémon in team');
    }

    // Validate Pokémon names
    for (const name of pokemons) {
      try {
        await this.validatePokemonName(name);
      } catch (error) {
        throw new Error(`Invalid Pokémon name: ${name}`);
      }
    }

    // Check if any Pokémon is already in another team
    const existingTeams = await Team.find({ userId });
    const allExistingPokemons = existingTeams.flatMap((t) => t.pokemons.map((name: string) => name.toLowerCase()));
    const duplicates = pokemons.filter((name) => allExistingPokemons.includes(name.toLowerCase()));
    if (duplicates.length > 0) {
      throw new Error(`Pokémon already in another team: ${duplicates.join(', ')}`);
    }

    // Create team
    try {
      const team = new Team({ userId, name, pokemons });
      await team.save();
      return {
        id: team._id.toString(),
        name: team.name,
        pokemons: team.pokemons,
      };
    } catch (_error: unknown) {
      const mongoError = _error as MongoError;
      if (mongoError.code === 11000) {
        throw new Error('Team name already exists');
      }
      throw new Error('Failed to create team');
    }
  }

  static async updateTeam(userId: string, teamId: string, body: UpdateTeamBody): Promise<TeamPayload> {
    const team = await Team.findOne({ _id: teamId, userId });
    if (!team) {
      throw new Error('Team not found');
    }

    if (body.name) {
      // Check unique name
      const existingTeam = await Team.findOne({ userId, name: body.name, _id: { $ne: teamId } });
      if (existingTeam) {
        throw new Error('Team name already exists');
      }
      team.name = body.name;
    }

    if (body.pokemons) {
      // Max 6
      if (body.pokemons.length > 6) {
        throw new Error('Maximum 6 Pokémon allowed per team');
      }

      // No duplicates in new list
      const uniquePokemons = new Set(body.pokemons.map((name) => name.toLowerCase()));
      if (uniquePokemons.size !== body.pokemons.length) {
        throw new Error('Duplicate Pokémon in team');
      }

      // Validate Pokémon names
      for (const name of body.pokemons) {
        try {
          await this.validatePokemonName(name);
        } catch (error) {
          throw new Error(`Invalid Pokémon name: ${name}`);
        }
      }

      // Check if any new Pokémon is in other teams
      const existingTeams = await Team.find({ userId, _id: { $ne: teamId } });
      const allExistingPokemons = existingTeams.flatMap((t) => t.pokemons.map((name: string) => name.toLowerCase()));
      const duplicates = body.pokemons.filter((name) => allExistingPokemons.includes(name.toLowerCase()));
      if (duplicates.length > 0) {
        throw new Error(`Pokémon already in another team: ${duplicates.join(', ')}`);
      }

      team.pokemons = body.pokemons;
    }

    try {
      await team.save();
      return {
        id: team._id.toString(),
        name: team.name,
        pokemons: team.pokemons,
      };
    } catch (_error: unknown) {
      const mongoError = _error as MongoError;
      if (mongoError.code === 11000) {
        throw new Error('Team name already exists');
      }
      throw new Error('Failed to update team');
    }
  }

  static async getAllTeams(userId: string): Promise<TeamPayload[]> {
    const teams = await Team.find({ userId });
    return teams.map((team) => ({
      id: team._id.toString(),
      name: team.name,
      pokemons: team.pokemons,
    }));
  }

  static async deleteTeam(userId: string, teamId: string): Promise<void> {
    const team = await Team.findOne({ _id: teamId, userId });
    if (!team) {
      throw new Error('Team not found');
    }
    await Team.deleteOne({ _id: teamId });
  }
}