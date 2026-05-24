import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TaskItem } from '../models/task-item.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/tasks';

  getById(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.endpoint}/${id}`);
  }

  getAll(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.endpoint);
  }

  getByUserId(userId: number): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.endpoint}/user/${userId}`);
  }

  create(payload: Omit<TaskItem, 'id'>): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.endpoint, payload);
  }

  update(id: number, payload: Omit<TaskItem, 'id'>): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
