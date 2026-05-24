import type { Category } from './category.model';
import { TaskStatus } from './task-status.enum';
import type { User } from './user.model';

export interface TaskItem {
  id: number;
  name: string;
  description?: string;
  date: string;
  status: TaskStatus;
  userId: number;
  categoryId: number;
  user?: User;
  category?: Category;
}
