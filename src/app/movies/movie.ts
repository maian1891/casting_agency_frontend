import { Actor } from "../actors/actor";

export interface Movie {
  id: number;
  title: string;
  releaseDate: Date;
  actors: Actor[]
}
