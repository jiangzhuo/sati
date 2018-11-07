import { Injectable, CacheInterceptor, ExecutionContext } from '@nestjs/common';

@Injectable()
export class GraphqlCacheInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const parameters = context.getArgByIndex(1);
        const graphqlContext = context.getArgByIndex(3);
        if (graphqlContext.operation.operation !== 'query') {
            return undefined;
        }
        const fieldName = graphqlContext.fieldName;
        // console.log(`${fieldName}|${JSON.stringify(parameters)}`)
        return `${fieldName}|${JSON.stringify(parameters)}`;
    }
}
