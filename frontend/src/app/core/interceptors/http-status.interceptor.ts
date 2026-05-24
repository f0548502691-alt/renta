import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const STATUS_MESSAGES: Record<number, string> = {
  0: 'אין תקשורת עם השרת כרגע.',
  400: 'הבקשה לא תקינה. בדוק את הנתונים שנשלחו.',
  401: 'שם משתמש או סיסמה שגויים.',
  403: 'אין הרשאה לבצע את הפעולה.',
  404: 'המשאב המבוקש לא נמצא.',
  500: 'שגיאת שרת פנימית. נסה שוב מאוחר יותר.'
};

export const httpStatusInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const fallbackMessage = STATUS_MESSAGES[error.status] ?? 'אירעה שגיאה לא צפויה.';
        const originalMessage =
          typeof error.error === 'object' && error.error && 'message' in error.error
            ? String(error.error.message)
            : undefined;

        return throwError(
          () =>
            new HttpErrorResponse({
              ...error,
              error: {
                ...((typeof error.error === 'object' && error.error) || {}),
                message: originalMessage ?? fallbackMessage
              }
            })
        );
      }

      return throwError(() => error);
    })
  );
};
