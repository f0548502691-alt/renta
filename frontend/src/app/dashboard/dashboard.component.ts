import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Category } from '../models/category.model';
import { TaskItem } from '../models/task-item.model';
import { TaskStatus } from '../models/task-status.enum';
import { CategoriesService } from '../services/categories.service';
import { TasksService } from '../services/tasks.service';
import { CapitalizeWordsPipe } from '../shared/pipes/capitalize-words.pipe';

type AddTaskForm = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<TaskStatus>;
  categoryId: FormControl<number | null>;
}>;

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, CapitalizeWordsPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly tasksService = inject(TasksService);
  private readonly categoriesService = inject(CategoriesService);
  protected readonly user = this.authService.user;
  protected readonly tasks = signal<TaskItem[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly isLoadingTasks = signal(false);
  protected readonly isLoadingCategories = signal(false);
  protected readonly tasksError = signal('');
  protected readonly categoriesError = signal('');
  protected readonly isAddingTask = signal(false);
  protected readonly addTaskMessage = signal('');
  protected readonly statusOptions: readonly TaskStatus[] = [
    TaskStatus.InProgress,
    TaskStatus.Completed,
    TaskStatus.Finished
  ];
  protected readonly addTaskForm: AddTaskForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)]
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(1000)] }),
    status: new FormControl(TaskStatus.InProgress, { nonNullable: true, validators: [Validators.required] }),
    categoryId: new FormControl<number | null>(null, { validators: [Validators.required] })
  });

  constructor() {
    effect((onCleanup) => {
      const currentUser = this.user();
      if (!currentUser) {
        this.tasks.set([]);
        this.categories.set([]);
        this.tasksError.set('');
        this.categoriesError.set('');
        this.addTaskMessage.set('');
        this.addTaskForm.reset({
          name: '',
          description: '',
          status: TaskStatus.InProgress,
          categoryId: null
        });
        return;
      }

      this.isLoadingTasks.set(true);
      this.isLoadingCategories.set(true);
      this.tasksError.set('');
      this.categoriesError.set('');
      this.addTaskMessage.set('');

      const tasksSubscription = this.tasksService.getByUserId(currentUser.id).subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.isLoadingTasks.set(false);
        },
        error: (error: HttpErrorResponse) => {
          const message = (error.error?.message as string | undefined) ?? 'אירעה שגיאה בטעינת המשימות.';
          this.tasks.set([]);
          this.tasksError.set(message);
          this.isLoadingTasks.set(false);
        }
      });

      const categoriesSubscription = this.categoriesService.getAll().subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.syncCategorySelection(categories);
          this.isLoadingCategories.set(false);
        },
        error: (error: HttpErrorResponse) => {
          const message =
            (error.error?.message as string | undefined) ?? 'אירעה שגיאה בטעינת הקטגוריות.';
          this.categories.set([]);
          this.categoriesError.set(message);
          this.isLoadingCategories.set(false);
        }
      });

      onCleanup(() => {
        tasksSubscription.unsubscribe();
        categoriesSubscription.unsubscribe();
      });
    });
  }

  protected addTask(): void {
    const currentUser = this.user();
    if (!currentUser) {
      return;
    }

    if (this.addTaskForm.invalid) {
      this.addTaskForm.markAllAsTouched();
      this.addTaskMessage.set('יש למלא שם משימה ולבחור קטגוריה.');
      return;
    }

    const formValue = this.addTaskForm.getRawValue();
    const taskName = formValue.name.trim();
    if (!taskName) {
      this.addTaskForm.controls.name.setErrors({ required: true });
      this.addTaskMessage.set('שם המשימה הוא שדה חובה.');
      return;
    }

    if (formValue.categoryId === null) {
      this.addTaskMessage.set('יש לבחור קטגוריה לפני הוספת משימה.');
      return;
    }

    this.isAddingTask.set(true);
    this.addTaskMessage.set('');

    this.tasksService
      .create({
        name: taskName,
        description: formValue.description.trim() || undefined,
        date: new Date().toISOString(),
        status: formValue.status,
        userId: currentUser.id,
        categoryId: formValue.categoryId
      })
      .subscribe({
        next: (createdTask) => {
          this.tasks.update((tasks) => [...tasks, createdTask]);
          this.addTaskForm.reset({
            name: '',
            description: '',
            status: TaskStatus.InProgress,
            categoryId: formValue.categoryId
          });
          this.addTaskMessage.set('המשימה נוספה בהצלחה.');
          this.isAddingTask.set(false);
        },
        error: (error: HttpErrorResponse) => {
          const message =
            (error.error?.message as string | undefined) ?? 'אירעה שגיאה בהוספת המשימה.';
          this.addTaskMessage.set(message);
          this.isAddingTask.set(false);
        }
      });
  }

  private syncCategorySelection(categories: Category[]): void {
    if (categories.length === 0) {
      this.addTaskForm.controls.categoryId.setValue(null);
      return;
    }

    const selectedCategoryId = this.addTaskForm.controls.categoryId.value;
    const hasSelectedCategory = categories.some((category) => category.id === selectedCategoryId);
    if (!hasSelectedCategory) {
      this.addTaskForm.controls.categoryId.setValue(categories[0].id);
    }
  }
}
