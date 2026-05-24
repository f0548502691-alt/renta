import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { CategoriesService } from '../services/categories.service';
import { TasksService } from '../services/tasks.service';
import { UsersService } from '../services/users.service';
import { InMemoryDataService } from './in-memory-data.service';
import { MockAuthService } from './mock-auth.service';
import { MockCategoriesService } from './mock-categories.service';
import { MockTasksService } from './mock-tasks.service';
import { MockUsersService } from './mock-users.service';

export function provideMockApiServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    InMemoryDataService,
    MockAuthService,
    MockUsersService,
    MockTasksService,
    MockCategoriesService,
    { provide: AuthService, useExisting: MockAuthService },
    { provide: UsersService, useExisting: MockUsersService },
    { provide: TasksService, useExisting: MockTasksService },
    { provide: CategoriesService, useExisting: MockCategoriesService }
  ]);
}
