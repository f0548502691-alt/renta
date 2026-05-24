# Angular auth flow demo

This Angular project demonstrates:

- **Custom Directive**: `appInvalidControl` colors invalid form controls.
- **Custom Pipe**: `capitalizeWords` transforms usernames for display.
- **Guard**: `authGuard` blocks `/dashboard` for unauthenticated users.
- **Lazy Loading**: `auth` and `dashboard` routes are lazy-loaded.
- **Interceptor**:
  - `mockUserControllerInterceptor` simulates backend user controller status codes.
  - `httpStatusInterceptor` normalizes server status-code messages.

## Login statuses

The mock user controller interceptor returns:

- `400` when username/password are missing.
- `401` when credentials are incorrect.
- `200` when credentials are valid.

Demo credentials:

- username: `demo`
- password: `123456`

## Run the app

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.
