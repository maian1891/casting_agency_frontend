import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../user/auth.service';

export interface RequestDataModel<TData> {
  data: TData;
  additionalHeaders?: HttpHeaders;
}

export interface ResponseDataModel<TData> {
  success: TData;
  data?: TData;
}

@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  apiServerUrl = process.env['API_SERVER_URL'];

  constructor(private httpClient: HttpClient, private auth: AuthService) {}

  private createHeader(headers?: HttpHeaders) {
    let additionalHeaders = headers || new HttpHeaders();
    additionalHeaders = additionalHeaders.set(
      'Content-Type',
      'application/json'
    );

    additionalHeaders = additionalHeaders.set(
      'Authorization',
      `Bearer ${this.auth.activeJWT()}`
    );
    return additionalHeaders;
  }

  post$<TRequest, TResponse>(
    path: string,
    request: RequestDataModel<TRequest>
  ): Observable<ResponseDataModel<TResponse>> {
    const url = `${this.apiServerUrl}${path}`;
    return this.httpClient
      .post<ResponseDataModel<TResponse>>(url, request.data, {
        observe: 'response',
        headers: this.createHeader(request?.additionalHeaders),
      })
      .pipe(
        take(1),
        map((r) => r.body ?? ({} as ResponseDataModel<TResponse>))
      );
  }

  get$<TResponse>(path: string): Observable<ResponseDataModel<TResponse>> {
    const url = `${this.apiServerUrl}${path}`;
    return this.httpClient
      .get<ResponseDataModel<TResponse>>(url, {
        observe: 'response',
        headers: this.createHeader(),
      })
      .pipe(
        take(1),
        tap(console.log),
        map((r) => r.body ?? ({} as ResponseDataModel<TResponse>))
      );
  }

  patch$<TRequest, TResponse>(
    path: string,
    request: RequestDataModel<TRequest>
  ): Observable<ResponseDataModel<TResponse>> {
    const url = `${this.apiServerUrl}${path}`;
    return this.httpClient
      .patch<ResponseDataModel<TResponse>>(url, request.data, {
        observe: 'response',
        headers: this.createHeader(request?.additionalHeaders),
      })
      .pipe(
        take(1),
        map((r) => r.body ?? ({} as ResponseDataModel<TResponse>))
      );
  }

  delete$<TRequest, TResponse>(
    path: string,
    request: RequestDataModel<TRequest>
  ): Observable<ResponseDataModel<TResponse>> {
    const url = `${this.apiServerUrl}${path}`;
    return this.httpClient
      .request<ResponseDataModel<TResponse>>('delete', url, {
        body: request?.data,
        observe: 'response',
        headers: this.createHeader(request?.additionalHeaders),
      })
      .pipe(
        take(1),
        map((r) => r.body ?? ({} as ResponseDataModel<TResponse>))
      );
  }
}
