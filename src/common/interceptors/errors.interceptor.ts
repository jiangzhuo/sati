import * as Sentry from '@sentry/node';
import { ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, calls$: Observable<any>): Observable<any> {
        return calls$.pipe(catchError((error, caught) => {
            if (error instanceof HttpException) {
                return Promise.resolve({
                    code: error.getStatus(),
                    message: error.getResponse(),
                });
            }
            if (error.code) {
                return Promise.resolve({
                    code: error.code,
                    message: error.message || error.details || JSON.stringify(error.data) || '',
                });
            } else {
                Sentry.captureException(error);
                return Promise.resolve({
                    code: 500,
                    message: error.message || 'unknow error',
                });
            }
        }));
    }
}
