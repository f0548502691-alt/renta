import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/categories';

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.endpoint}/${id}`);
  }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.endpoint);
  }

  create(payload: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.endpoint, payload);
  }

  update(id: number, payload: Omit<Category, 'id'>): Observable<Category> {
    return this.http.put<Category>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
