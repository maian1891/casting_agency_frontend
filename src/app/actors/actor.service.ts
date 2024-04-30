import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Actor } from './actor';
import { AuthService } from '../user/auth.service';

@Injectable({ providedIn: 'root' })
export class ActorService {
  private actorsUrl = 'api/actors'; // URL to web api

  constructor(private auth: AuthService, private http: HttpClient) {}

  /** GET actors from the server */
  getActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.actorsUrl, this.getHeaders()).pipe(
      tap((_) => console.log('fetched actor')),
      catchError(this.handleError<Actor[]>('getActors', []))
    );
  }

  /** GET actor by id. Return `undefined` when id not found */
  getActorNo404<Data>(id: number): Observable<Actor> {
    const url = `${this.actorsUrl}/?id=${id}`;
    return this.http.get<Actor[]>(url, this.getHeaders()).pipe(
      map((actors) => actors[0]), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        console.log(`${outcome} actor id=${id}`);
      }),
      catchError(this.handleError<Actor>(`getActor id=${id}`))
    );
  }

  /** GET actor by id. Will 404 if id not found */
  getActor(id: number): Observable<Actor> {
    const url = `${this.actorsUrl}/${id}`;
    return this.http.get<Actor>(url, this.getHeaders()).pipe(
      tap((_) => console.log(`fetched actor id=${id}`)),
      catchError(this.handleError<Actor>(`getActor id=${id}`))
    );
  }

  /* GET actors whose name contains search term */
  searchActors(keySearch: string): Observable<Actor[]> {
    if (!keySearch.trim()) {
      // if not search term, return empty actor array.
      return of([]);
    }
    return this.http
      .get<Actor[]>(`${this.actorsUrl}/?name=${keySearch}`, this.getHeaders())
      .pipe(
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
    return this.http
      .post<Actor>(this.actorsUrl, actor, this.getHeaders(true))
      .pipe(
        tap((newActor: Actor) =>
          console.log(`added actor w/ id=${newActor.id}`)
        ),
        catchError(this.handleError<Actor>('addActor'))
      );
  }

  /** DELETE: delete the actor from the server */
  deleteActor(id: number): Observable<Actor> {
    const url = `${this.actorsUrl}/${id}`;

    return this.http.delete<Actor>(url, this.getHeaders(true)).pipe(
      tap((_) => console.log(`deleted actor id=${id}`)),
      catchError(this.handleError<Actor>('deleteActor'))
    );
  }

  /** PUT: update the actor on the server */
  updateActor(actor: Actor): Observable<any> {
    return this.http.put(this.actorsUrl, actor, this.getHeaders(true)).pipe(
      tap((_) => console.log(`updated actor id=${actor.id}`)),
      catchError(this.handleError<any>('updateActor'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // log to console instead
      return of(result as T);
    };
  }

  private getHeaders(isJson: boolean = false) {
    let header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.auth.activeJWT()}`
      ),
    };

    if (isJson) header.headers.append('Content-Type', 'application/json');

    return header;
  }
}
