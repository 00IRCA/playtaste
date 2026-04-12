import type { Game } from './game';
import type { List } from './list';

export interface ListWithGames extends List {
  games: Game[];
}
