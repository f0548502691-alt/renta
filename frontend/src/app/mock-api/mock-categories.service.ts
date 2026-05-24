import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { Category } from '../models/category.model';
import { InMemoryDataService } from './in-memory-data.service';

@Injectable()
export class MockCategoriesService {
  private readonly data = inject(InMemoryDataService);

  getById(id: number): Observable<Category> {
    return this.data.getCategoryById(id);
  }

  getAll(): Observable<Category[]> {
    return this.data.getCategories();
  }

  create(payload: Omit<Category, 'id'>): Observable<Category> {
    return this.data.addCategory(payload);
  }

  update(id: number, payload: Omit<Category, 'id'>): Observable<Category> {
    return this.data.updateCategory(id, payload);
  }

  delete(id: number): Observable<void> {
    return this.data.deleteCategory(id);
  }
}
