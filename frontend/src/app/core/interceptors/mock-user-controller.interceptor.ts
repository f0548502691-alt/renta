import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';

interface LoginBody {
  username?: string;
  password?: string;
}

export const mockUserControllerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (req.url !== '/api/users/login' || req.method !== 'POST') {
    return next(req);
  }

  const body = (req.body ?? {}) as LoginBody;
  const username = (body.username ?? '').trim();
  const password = (body.password ?? '').trim();

  if (!username || !password) {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 400,
          error: { message: 'username and password are required' },
          url: req.url
        })
    );
  }

  if (username !== 'demo' || password !== '123456') {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          error: { message: 'invalid username or password' },
          url: req.url
        })
    );
  }

  return of(
    new HttpResponse({
      status: 200,
      body: { username }
    })
  ).pipe(delay(350));
};
