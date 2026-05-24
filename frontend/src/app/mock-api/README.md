# Mock API Services (No backend required)

This folder contains in-memory replacements for backend HTTP services.

## What is included

- `InMemoryDataService` - stores internal users, tasks, and categories data.
- `MockAuthService` - replaces `AuthService`.
- `MockUsersService` - replaces `UsersService`.
- `MockTasksService` - replaces `TasksService`.
- `MockCategoriesService` - replaces `CategoriesService`.
- `provideMockApiServices()` - provider factory for DI overrides.

## How to enable

In `app.config.ts`, add `provideMockApiServices()` to providers:

```ts
import { provideMockApiServices } from './mock-api/mock-api.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    // existing providers...
    provideMockApiServices()
  ]
};
```

When enabled, existing components can keep injecting the same services (`AuthService`, `UsersService`, `TasksService`, `CategoriesService`) without any code changes.
