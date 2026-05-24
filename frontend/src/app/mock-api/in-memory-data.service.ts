import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import type { AuthUser, LoginPayload } from '../auth/auth.service';
import type { Category } from '../models/category.model';
import type { TaskItem } from '../models/task-item.model';
import { TaskStatus } from '../models/task-status.enum';
import type { User } from '../models/user.model';

type UserPayload = Omit<User, 'id'>;
type TaskPayload = Omit<TaskItem, 'id'>;
type CategoryPayload = Omit<Category, 'id'>;

const NETWORK_DELAY_MS = 120;

@Injectable()
export class InMemoryDataService {
  private users: User[] = [
    { id: 1, username: 'demo', password: '123456', email: 'demo@example.com' },
    { id: 2, username: 'sara', password: 'abcdef', email: 'sara@example.com' }
  ];

  private categories: Category[] = [
    { id: 1, name: 'Work', description: 'Work related tasks' },
    { id: 2, name: 'Personal', description: 'Personal tasks' }
  ];

  private tasks: TaskItem[] = [
    {
      id: 1,
      name: 'Prepare sprint board',
      description: 'Create tasks for sprint planning',
      date: new Date().toISOString(),
      status: TaskStatus.InProgress,
      userId: 1,
      categoryId: 1
    },
    {
      id: 2,
      name: 'Buy groceries',
      description: 'Milk, bread, and eggs',
      date: new Date().toISOString(),
      status: TaskStatus.Completed,
      userId: 2,
      categoryId: 2
    }
  ];

  private userIdSequence = 3;
  private categoryIdSequence = 3;
  private taskIdSequence = 3;

  login(payload: LoginPayload): Observable<AuthUser> {
    const user = this.users.find(
      (candidate) =>
        candidate.username === payload.username && candidate.password === payload.password
    );

    if (!user) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { message: 'invalid username or password' }
          })
      );
    }

    return of({
      id: user.id,
      username: user.username,
      email: user.email
    }).pipe(delay(NETWORK_DELAY_MS));
  }

  getUsers(): Observable<User[]> {
    return of(this.users.map((user) => this.withUserTasks(user))).pipe(delay(NETWORK_DELAY_MS));
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find((candidate) => candidate.id === id);
    if (!user) {
      return this.notFound('User');
    }

    return of(this.withUserTasks(user)).pipe(delay(NETWORK_DELAY_MS));
  }

  addUser(payload: UserPayload): Observable<User> {
    const created: User = { ...payload, id: this.userIdSequence++ };
    this.users = [...this.users, created];
    return of(created).pipe(delay(NETWORK_DELAY_MS));
  }

  updateUser(id: number, payload: UserPayload): Observable<User> {
    const index = this.users.findIndex((candidate) => candidate.id === id);
    if (index < 0) {
      return this.notFound('User');
    }

    const updated: User = { ...payload, id };
    this.users = [
      ...this.users.slice(0, index),
      updated,
      ...this.users.slice(index + 1)
    ];
    return of(updated).pipe(delay(NETWORK_DELAY_MS));
  }

  deleteUser(id: number): Observable<void> {
    const exists = this.users.some((candidate) => candidate.id === id);
    if (!exists) {
      return this.notFound('User');
    }

    this.users = this.users.filter((candidate) => candidate.id !== id);
    this.tasks = this.tasks.filter((task) => task.userId !== id);
    return of(void 0).pipe(delay(NETWORK_DELAY_MS));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories.map((category) => this.withCategoryTasks(category))).pipe(
      delay(NETWORK_DELAY_MS)
    );
  }

  getCategoryById(id: number): Observable<Category> {
    const category = this.categories.find((candidate) => candidate.id === id);
    if (!category) {
      return this.notFound('Category');
    }

    return of(this.withCategoryTasks(category)).pipe(delay(NETWORK_DELAY_MS));
  }

  addCategory(payload: CategoryPayload): Observable<Category> {
    const created: Category = { ...payload, id: this.categoryIdSequence++ };
    this.categories = [...this.categories, created];
    return of(created).pipe(delay(NETWORK_DELAY_MS));
  }

  updateCategory(id: number, payload: CategoryPayload): Observable<Category> {
    const index = this.categories.findIndex((candidate) => candidate.id === id);
    if (index < 0) {
      return this.notFound('Category');
    }

    const updated: Category = { ...payload, id };
    this.categories = [
      ...this.categories.slice(0, index),
      updated,
      ...this.categories.slice(index + 1)
    ];
    return of(updated).pipe(delay(NETWORK_DELAY_MS));
  }

  deleteCategory(id: number): Observable<void> {
    const exists = this.categories.some((candidate) => candidate.id === id);
    if (!exists) {
      return this.notFound('Category');
    }

    this.categories = this.categories.filter((candidate) => candidate.id !== id);
    this.tasks = this.tasks.filter((task) => task.categoryId !== id);
    return of(void 0).pipe(delay(NETWORK_DELAY_MS));
  }

  getTasks(): Observable<TaskItem[]> {
    return of(this.tasks.map((task) => this.withTaskRelations(task))).pipe(delay(NETWORK_DELAY_MS));
  }

  getTaskById(id: number): Observable<TaskItem> {
    const task = this.tasks.find((candidate) => candidate.id === id);
    if (!task) {
      return this.notFound('Task');
    }

    return of(this.withTaskRelations(task)).pipe(delay(NETWORK_DELAY_MS));
  }

  getTasksByUserId(userId: number): Observable<TaskItem[]> {
    const userTasks = this.tasks.filter((task) => task.userId === userId);
    return of(userTasks.map((task) => this.withTaskRelations(task))).pipe(delay(NETWORK_DELAY_MS));
  }

  addTask(payload: TaskPayload): Observable<TaskItem> {
    if (!this.users.some((user) => user.id === payload.userId)) {
      return this.notFound('User');
    }

    if (!this.categories.some((category) => category.id === payload.categoryId)) {
      return this.notFound('Category');
    }

    const created: TaskItem = { ...payload, id: this.taskIdSequence++ };
    this.tasks = [...this.tasks, created];
    return of(this.withTaskRelations(created)).pipe(delay(NETWORK_DELAY_MS));
  }

  updateTask(id: number, payload: TaskPayload): Observable<TaskItem> {
    const index = this.tasks.findIndex((candidate) => candidate.id === id);
    if (index < 0) {
      return this.notFound('Task');
    }

    if (!this.users.some((user) => user.id === payload.userId)) {
      return this.notFound('User');
    }

    if (!this.categories.some((category) => category.id === payload.categoryId)) {
      return this.notFound('Category');
    }

    const updated: TaskItem = { ...payload, id };
    this.tasks = [
      ...this.tasks.slice(0, index),
      updated,
      ...this.tasks.slice(index + 1)
    ];
    return of(this.withTaskRelations(updated)).pipe(delay(NETWORK_DELAY_MS));
  }

  deleteTask(id: number): Observable<void> {
    const exists = this.tasks.some((candidate) => candidate.id === id);
    if (!exists) {
      return this.notFound('Task');
    }

    this.tasks = this.tasks.filter((candidate) => candidate.id !== id);
    return of(void 0).pipe(delay(NETWORK_DELAY_MS));
  }

  private withUserTasks(user: User): User {
    return {
      ...user,
      tasks: this.tasks.filter((task) => task.userId === user.id).map((task) => this.withTaskRelations(task))
    };
  }

  private withCategoryTasks(category: Category): Category {
    return {
      ...category,
      tasks: this.tasks
        .filter((task) => task.categoryId === category.id)
        .map((task) => this.withTaskRelations(task))
    };
  }

  private withTaskRelations(task: TaskItem): TaskItem {
    const user = this.users.find((candidate) => candidate.id === task.userId);
    const category = this.categories.find((candidate) => candidate.id === task.categoryId);
    return {
      ...task,
      user,
      category
    };
  }

  private notFound(entityName: string): Observable<never> {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 404,
          error: { message: `${entityName} not found` }
        })
    );
  }
}
