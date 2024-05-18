import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { Actor } from './actor';
import { MiddlewareService } from '../services/middleware.service';
import { HandleErrorService } from '../services/handleError.service';

@Injectable({ providedIn: 'root' })
export class ActorService extends HandleErrorService {
  constructor(private middlewareService: MiddlewareService) {
    super();
  }

  /** GET actors from the server */
  getActors(): Observable<Actor[]> {
    return this.middlewareService.get$<Actor[]>('actors').pipe(
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
      tap((actors) => {
        console.log('fetched actors ', actors);
      }),
      catchError(this.handleError<Actor[]>('getActors', []))
    );
  }

  /** GET actor by id. Return `undefined` when id not found */
  getActorNo404<Data>(id: number): Observable<Actor> {
    const url = `actor-detail/?id=${id}`;
    return this.middlewareService.get$<Actor[]>(url).pipe(
      switchMap((response) =>
        of(response && response.data ? response.data[0] : ({} as Actor))
      ),
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        console.log(`${outcome} actor id=${id}`);
      }),
      catchError(this.handleError<Actor>(`getActor id=${id}`))
    );
  }

  /** GET actor by id. Will 404 if id not found */
  getActor(id: number): Observable<Actor> {
    const url = `actor-detail/${id}`;
    return this.middlewareService.get$<Actor>(url).pipe(
      switchMap((response) => of(response.data as Actor)),
      catchError(this.handleError<Actor>(`getActor id=${id}`))
    );
  }

  /* GET actors whose name contains search term */
  searchActors(keySearch: string): Observable<Actor[]> {
    if (!keySearch.trim()) {
      // if not search term, return empty actor array.
      return of([]);
    }
    return this.middlewareService
      .get$<Actor[]>(`actors/?name=${keySearch}`)
      .pipe(
        switchMap((response) => {
          const payload = response?.data;
          let result;
          if (Array.isArray(payload)) {
            result = payload;
          } else {
            result = payload ? [payload] : [];
          }
          return of(result);
        }),
        tap((x) =>
          x.length
            ? console.log(`found actors matching "${keySearch}"`)
            : console.log(`no actors matching "${keySearch}"`)
        ),
        catchError(this.handleError<Actor[]>('searchActors', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new actor to the server */
  addActor(actor: Actor): Observable<Actor> {
    return this.middlewareService
      .post$<Actor, Actor>('actor', { data: actor })
      .pipe(
        switchMap((response) => of(response?.data as Actor)),
        tap((newActor: Actor) =>
          console.log(`added actor w/ id=${newActor.id}`)
        ),
        catchError(this.handleError<Actor>('addActor'))
      );
  }

  /** DELETE: delete the actor from the server */
  deleteActor(id: number): Observable<number> {
    const url = `actor/${id}`;

    return this.middlewareService
      .delete$<Actor, number>(url, { data: { id: id } as Actor })
      .pipe(
        switchMap((response) => of(response?.data as number)),
        tap((_) => console.log(`deleted actor id=${id}`)),
        catchError(this.handleError<number>('deleteActor'))
      );
  }

  /** PUT: update the actor on the server */
  updateActor(actor: Actor): Observable<unknown> {
    const url = 'actor';
    return this.middlewareService.patch$(url, { data: actor }).pipe(
      switchMap((response) => of(response?.data)),
      tap((_) => console.log(`updated actor id=${actor.id}`)),
      catchError(this.handleError<unknown>('updateActor'))
    );
  }
}
