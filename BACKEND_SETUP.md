# Task Management Backend Setup

## Projects

- `src/TaskManagement.Api` - Web API layer (controllers + DI).
- `src/DAL` - entities + `AppDbContext`.
- `src/BLL` - generic repository + specific repositories.

## Required migration commands

Run from `src/TaskManagement.Api`:

```bash
dotnet ef migrations add InitialCreate --project ../DAL --startup-project .
dotnet ef database update --project ../DAL --startup-project .
```

## Angular integration check

The API is ready for Angular (`http://localhost:4200`) with CORS policy `AngularClient`.

Main endpoints:

- `GET /api/users/{id}`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

- `GET /api/tasks/{id}`
- `GET /api/tasks`
- `GET /api/tasks/user/{userId}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

- `GET /api/categories/{id}`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

`TaskStatus` is serialized as string (`InProgress`, `Completed`, `Finished`) for simpler Angular handling.
