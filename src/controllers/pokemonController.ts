import { PokemonService } from '@/services/pokemonService';
import { PokemonListResponse, Pokemon } from '@/types';

export class PokemonController {
  static async getPokemon(limit: number, offset: number, name?: string): Promise<PokemonListResponse | Pokemon> {
    if (name) {
      return await PokemonService.getPokemonByName(name);
    }
    return await PokemonService.getPokemonList(limit, offset);
  }
}