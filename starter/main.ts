import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Sati');

    const app = await NestFactory.create(AppModule);

    await app.listen(5000, '0.0.0.0', () => {
        logger.log('Sati GraphQL IDE Server started on: http://localhost:5000/graphql');
    });
}

bootstrap();
