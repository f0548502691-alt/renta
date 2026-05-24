import type { TaskItem } from './task-item.model';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  tasks?: TaskItem[];
}
