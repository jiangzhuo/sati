import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

// import { AppResolver } from './app.resolver';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { GraphQLConfigService } from './graphql-config.service';
// import { NotaddGrpcClientFactory } from './grpc/grpc.client-factory';
import { UserModule } from './modules/user/user.module';
import { ResourceModule } from './modules/resource/resource.module';
import { StatsModule } from './modules/stats/stats.module';
import { UploadModule } from './modules/upload/upload.module';


@Global()
@Module({
    imports: [
        GraphQLModule.forRootAsync({
            useClass: GraphQLConfigService
        }),
        UploadModule,
        ResourceModule,
        StatsModule,
        UserModule.forRoot(),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorsInterceptor
        }
    ],
    exports: []
})
export class AppModule { }
