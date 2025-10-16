import { PokemonListResponse, Pokemon, PokemonType } from '@/types';

export class PokemonService {
  // Fetch Pokémon list
  static async getPokemonList(limit: number = 10, offset: number = 0): Promise<PokemonListResponse> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list');
    }
    const data: PokemonListResponse = await response.json();
    return data;
  }

  // Fetch single Pokémon by name
  static async getPokemonByName(name: string): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) {
      throw new Error('Pokémon not found');
    }
    const data = await response.json();
    return {
      id: data.id.toString(),
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map((t: PokemonType) => t.type.name), // Use PokemonType instead of any
      baseExperience: data.base_experience,
    };
  }
}