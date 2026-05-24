import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { User } from '../models/user.model';
import { InMemoryDataService } from './in-memory-data.service';

@Injectable()
export class MockUsersService {
  private readonly data = inject(InMemoryDataService);

  getById(id: number): Observable<User> {
    return this.data.getUserById(id);
  }

  getAll(): Observable<User[]> {
    return this.data.getUsers();
  }

  create(payload: Omit<User, 'id'>): Observable<User> {
    return this.data.addUser(payload);
  }

  update(id: number, payload: Omit<User, 'id'>): Observable<User> {
    return this.data.updateUser(id, payload);
  }

  delete(id: number): Observable<void> {
    return this.data.deleteUser(id);
  }
}
