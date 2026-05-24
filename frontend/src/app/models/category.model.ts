import type { TaskItem } from './task-item.model';

export interface Category {
  id: number;
  name: string;
  description?: string;
  tasks?: TaskItem[];
}
