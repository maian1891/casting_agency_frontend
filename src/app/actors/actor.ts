import { Movie } from '../movies/movie';

export interface Actor {
  id: number;
  name: string;
  age: number;
  gender: string;
  movies: Movie[];
}
