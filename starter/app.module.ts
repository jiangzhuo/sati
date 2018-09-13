import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../src';
// import { AppResolver } from './app.resolver';
import { GraphQLConfigService } from './graphql-config.service';

@Module({
    imports: [
        GraphQLModule.forRootAsync({
            useClass: GraphQLConfigService
        }),
        TypeOrmModule.forRoot({
          type: 'mongodb',
          host: '127.0.0.1',
          port: 27017,
          username: '',
          password: '',
          database: 'module_user',
          entities: [__dirname + '/../src/**/*.entity.ts'],
          logger: 'simple-console',
          logging: false,
          synchronize: true,
          dropSchema: false
        }),
        UserModule.forRoot({ i18n: 'zh-CN' })
    ],
    providers: [
    ],
    exports: []
})
export class AppModule { }
