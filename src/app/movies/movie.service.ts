import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { Movie } from './movie';
import { HandleErrorService } from '../services/handleError.service';
import { MiddlewareService } from '../services/middleware.service';

@Injectable({ providedIn: 'root' })
export class MovieService extends HandleErrorService {
  constructor(private middlewareService: MiddlewareService) {
    super();
  }

  /** GET movies from the server */
  getMovies(): Observable<Movie[]> {
    return this.middlewareService.get$<Movie[]>('movies').pipe(
      switchMap((response) => {
        const data = response?.data;
        let result;
        if (Array.isArray(data)) {
          result = data;
        } else {
          result = data ? [data] : [];
        }
        return of(result);
      }),
      tap((_) => console.log('fetched movie')),
      catchError(this.handleError<Movie[]>('getMovies', []))
    );
  }

  /** GET movie by id. Return `undefined` when id not found */
  getMovieNo404<Data>(id: number): Observable<Movie> {
    const url = `movie-detail/?id=${id}`;
    return this.middlewareService.get$<Movie[]>(url).pipe(
      switchMap((response) =>
        of(response && response.data ? response.data[0] : ({} as Movie))
      ),
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        console.log(`${outcome} movie id=${id}`);
      }),
      catchError(this.handleError<Movie>(`getMovie id=${id}`))
    );
  }

  /** GET movie by id. Will 404 if id not found */
  getMovie(id: number): Observable<Movie> {
    const url = `movie-detail/${id}`;
    return this.middlewareService.get$<Movie>(url).pipe(
      switchMap((response) => of(response?.data as Movie)),
      catchError(this.handleError<Movie>(`getMovie id=${id}`))
    );
  }

  /* GET movies whose name contains search term */
  searchMovies(keySearch: string): Observable<Movie[]> {
    if (!keySearch.trim()) {
      // if not search term, return empty movie array.
      return of([]);
    }
    return this.middlewareService
      .get$<Movie[]>(`movies/?name=${keySearch}`)
      .pipe(
        switchMap((response) => {
          const data = response?.data;
          let result;
          if (Array.isArray(data)) {
            result = data;
          } else {
            result = data ? [data] : [];
          }
          return of(result);
        }),
        tap((x) =>
          x.length
            ? console.log(`found movies matching "${keySearch}"`)
            : console.log(`no movies matching "${keySearch}"`)
        ),
        catchError(this.handleError<Movie[]>('searchMovies', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new movie to the server */
  addMovie(movie: Movie): Observable<Movie> {
    return this.middlewareService
      .post$<Movie, Movie>('movie', { data: movie })
      .pipe(
        switchMap((response) => of(response?.data as Movie)),
        catchError(this.handleError<Movie>('addMovie'))
      );
  }

  /** DELETE: delete the movie from the server */
  deleteMovie(id: number): Observable<number> {
    const url = `movie/${id}`;

    return this.middlewareService
      .delete$<Movie, number>(url, { data: { id: id } as Movie })
      .pipe(
        switchMap((response) => of(response?.data as number)),
        tap((_) => console.log(`deleted movie id=${id}`)),
        catchError(this.handleError<number>('deleteMovie'))
      );
  }

  /** PUT: update the movie on the server */
  updateMovie(movie: Movie): Observable<unknown> {
    const url = 'movie';
    return this.middlewareService.patch$(url, { data: movie }).pipe(
      switchMap((response) => of(response?.data)),
      tap((_) => console.log(`updated movie id=${movie.id}`)),
      catchError(this.handleError<unknown>('updateMovie'))
    );
  }
}
