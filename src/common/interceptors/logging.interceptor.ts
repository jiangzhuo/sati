import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger('Interceptor');

    intercept(
        context: ExecutionContext,
        call$: Observable<any>,
    ): Observable<any> {
        // console.log('Before...');
        // console.log(context.getArgByIndex(2));
        const graphqlCtx = context.getArgByIndex(2);
        const now = Date.now();
        this.logger.log(`${graphqlCtx.user && graphqlCtx.user.id}\t${graphqlCtx.udid}\t${graphqlCtx.clientIp}\t${graphqlCtx.operationName}`);
        return call$.pipe(tap(() => {
            // tslint:disable-next-line:max-line-length
            this.logger.log(`${graphqlCtx.user && graphqlCtx.user.id}\t${graphqlCtx.udid}\t${graphqlCtx.clientIp}\t${graphqlCtx.operationName}\t${Date.now() - now}`);
            // console.log(`After... ${Date.now() - now}ms`);
        }));
    }
}
