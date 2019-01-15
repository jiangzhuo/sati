import * as Sentry from '@sentry/node';
import { ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    private logger = new Logger('Interceptor');

    intercept(context: ExecutionContext, calls$: Observable<any>): Observable<any> {
        return calls$.pipe(catchError((error, caught) => {
            if (error instanceof HttpException) {
                const code = error.getStatus();
                const message = error.getResponse();
                this.logger.error(`${code}\t${message}`);
                return Promise.resolve({
                    code,
                    message,
                });
            }
            if (error.code) {
                const code = error.code;
                const message = error.message || error.details || JSON.stringify(error.data) || '';
                this.logger.error(`${code}\t${message}`);
                return Promise.resolve({
                    code,
                    message,
                });
            } else {
                Sentry.captureException(error);
                const code = 500;
                const message = error.message || 'unknow error';
                this.logger.error(`${code}\t${message}`);
                return Promise.resolve({
                    code,
                    message,
                });
            }
        }));
    }
}
