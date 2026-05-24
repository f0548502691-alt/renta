import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { TaskItem } from '../models/task-item.model';
import { TasksService } from '../services/tasks.service';
import { CapitalizeWordsPipe } from '../shared/pipes/capitalize-words.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [CapitalizeWordsPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly tasksService = inject(TasksService);
  protected readonly user = this.authService.user;
  protected readonly tasks = signal<TaskItem[]>([]);
  protected readonly isLoadingTasks = signal(false);
  protected readonly tasksError = signal('');

  constructor() {
    effect((onCleanup) => {
      const currentUser = this.user();
      if (!currentUser) {
        this.tasks.set([]);
        this.tasksError.set('');
        return;
      }

      this.isLoadingTasks.set(true);
      this.tasksError.set('');

      const subscription = this.tasksService.getByUserId(currentUser.id).subscribe({
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

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
