import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import type { AuthUser, LoginPayload } from '../auth/auth.service';
import { InMemoryDataService } from './in-memory-data.service';

const AUTH_STORAGE_KEY = 'auth-user';

@Injectable()
export class MockAuthService {
  private readonly data = inject(InMemoryDataService);
  private readonly userState = signal<AuthUser | null>(this.readStoredUser());

  readonly user = computed(() => this.userState());
  readonly isLoggedIn = computed(() => this.userState() !== null);

  login(payload: LoginPayload): Observable<AuthUser> {
    return this.data.login(payload).pipe(
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
