import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/auth/login-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  checkUser(email: string) {
    const url = `${this.apiUrl}/users?email=${encodeURIComponent(email)}`;

    return this.http.get<LoginResponse>(url).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404 && error.error?.message === 'User not found') {
          return throwError(() => new Error('USER_NOT_FOUND'));
        }

        const backendMessage = error.error?.message || error.message || 'Unexpected error';
        return throwError(() => new Error(backendMessage));
      }),
    );
  }

  createUser(email: string) {
    const url = `${this.apiUrl}/users`;

    return this.http.post<{ id: string; email: string; createdAt: string }>(url, { email }).pipe(
      switchMap(() => this.checkUser(email)),
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || error.message || 'Error al crear usuario';
        return throwError(() => new Error(message));
      }),
    );
  }
}
