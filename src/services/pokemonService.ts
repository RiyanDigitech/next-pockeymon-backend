import { PokemonListResponse, Pokemon, PokemonType } from '@/types';

// Interface for raw PokéAPI response
interface RawPokemonResponse {
  id: number;
  name: string;
  sprites: { front_default: string | null } | null; // Allow null for sprites
  types: PokemonType[];
  base_experience: number;
}

export class PokemonService {
  // Fetch Pokémon list
  static async getPokemonList(limit: number = 10, offset: number = 0): Promise<PokemonListResponse> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list');
    }
    const data = await response.json();
    // Type guard for PokemonListResponse
    if (
      !data ||
      typeof data !== 'object' ||
      !('results' in data) ||
      !Array.isArray(data.results) ||
      !('count' in data)
    ) {
      throw new Error('Invalid Pokémon list response');
    }
    return data as PokemonListResponse;
  }

  // Fetch single Pokémon by name
  static async getPokemonByName(name: string): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) {
      throw new Error('Pokémon not found');
    }
    const data = await response.json();
    // Type guard for RawPokemonResponse
    if (
      !data ||
      typeof data !== 'object' ||
      !('id' in data) ||
      typeof data.id !== 'number' ||
      !('name' in data) ||
      typeof data.name !== 'string' ||
      !('sprites' in data) ||
      (data.sprites !== null && typeof data.sprites !== 'object') ||
      !('types' in data) ||
      !Array.isArray(data.types) ||
      !('base_experience' in data) ||
      typeof data.base_experience !== 'number'
    ) {
      throw new Error('Invalid Pokémon response');
    }
    // Type assertion to RawPokemonResponse
    const pokemonData = data as RawPokemonResponse;
    // Handle null sprites
    if (pokemonData.sprites === null || pokemonData.sprites.front_default === null) {
      throw new Error('Pokémon sprite not available');
    }
    return {
      id: pokemonData.id.toString(),
      name: pokemonData.name,
      image: pokemonData.sprites.front_default,
      types: pokemonData.types.map((t: PokemonType) => t.type.name),
      baseExperience: pokemonData.base_experience,
    };
  }
}