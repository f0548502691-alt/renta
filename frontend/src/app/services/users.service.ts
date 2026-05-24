import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/users';

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/${id}`);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoint);
  }

  create(payload: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.endpoint, payload);
  }

  update(id: number, payload: Omit<User, 'id'>): Observable<User> {
    return this.http.put<User>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
