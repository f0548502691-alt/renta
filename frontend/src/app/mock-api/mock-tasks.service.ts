import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { TaskItem } from '../models/task-item.model';
import { InMemoryDataService } from './in-memory-data.service';

@Injectable()
export class MockTasksService {
  private readonly data = inject(InMemoryDataService);

  getById(id: number): Observable<TaskItem> {
    return this.data.getTaskById(id);
  }

  getAll(): Observable<TaskItem[]> {
    return this.data.getTasks();
  }

  getByUserId(userId: number): Observable<TaskItem[]> {
    return this.data.getTasksByUserId(userId);
  }

  create(payload: Omit<TaskItem, 'id'>): Observable<TaskItem> {
    return this.data.addTask(payload);
  }

  update(id: number, payload: Omit<TaskItem, 'id'>): Observable<TaskItem> {
    return this.data.updateTask(id, payload);
  }

  delete(id: number): Observable<void> {
    return this.data.deleteTask(id);
  }
}
