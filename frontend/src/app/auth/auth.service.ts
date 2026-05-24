import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

const AUTH_STORAGE_KEY = 'auth-user';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userState = signal<AuthUser | null>(this.readStoredUser());

  readonly user = computed(() => this.userState());
  readonly isLoggedIn = computed(() => this.userState() !== null);

  login(payload: LoginPayload): Observable<AuthUser> {
    return this.http
      .get<
        Array<{ id: number; username: string; password: string; email: string }>
      >('/api/users')
      .pipe(
        map((users) => {
          const matchedUser = users.find(
            (user) => user.username === payload.username && user.password === payload.password
          );

          if (!matchedUser) {
            throw new HttpErrorResponse({
              status: 401,
              error: { message: 'invalid username or password' }
            });
          }

          return {
            id: matchedUser.id,
            username: matchedUser.username,
            email: matchedUser.email
          } satisfies AuthUser;
        }),
        tap((user) => {
          this.userState.set(user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        })
      );
  }

  logout(): void {
    this.userState.set(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private readStoredUser(): AuthUser | null {
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }
}
