export interface GameCover {
  url: string;
}

export interface Genre {
  name: string;
}

export interface Platform {
  name: string;
}

export interface Game {
  id: number;
  name: string;
  summary?: string;
  rating?: number;
  first_release_date?: number; // Unix timestamp
  cover?: GameCover;
  genres?: Genre[];
  platforms?: Platform[];
}
