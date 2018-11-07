import * as Sentry from '@sentry/node';
import { hostname } from 'os';

Sentry.init({ dsn: 'https://f788de537d2648cb96b4b9f5081165c1@sentry.io/1318216', serverName: hostname() });

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { APP_CONFIG } from './configurations/app.config';
import * as os from 'os';

async function bootstrap() {
    const logger = new Logger('Notadd');
    logger.log(APP_CONFIG.banner);

    const app = await NestFactory.create(AppModule, { cors: true });

    await app.listen(5000, '0.0.0.0', () => {
        logger.log('Notadd GraphQL IDE Server started on: http://localhost:5000/graphql');
    });
}

bootstrap();
