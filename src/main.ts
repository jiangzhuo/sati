import * as Sentry from '@sentry/node';
import { hostname } from 'os';

Sentry.init({ dsn: 'https://f788de537d2648cb96b4b9f5081165c1@sentry.io/1318216', serverName: hostname() });

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { APP_CONFIG } from './configurations/app.config';
import * as os from 'os';
import * as fs from 'fs';
import express = require('express');
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

async function bootstrap() {
    const logger = new Logger('Notadd');
    logger.log(APP_CONFIG.banner);

    const privateKey = fs.readFileSync(path.join(__dirname, './ssl/privkey.pem'), 'utf8');
    const certificate = fs.readFileSync(path.join(__dirname, './ssl/cert.pem'), 'utf8');
    const ca = fs.readFileSync(path.join(__dirname, './ssl/chain.pem'), 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca,
    };

    const server = express();
    const app = await NestFactory.create(AppModule, server);
    await app.init();

    http.createServer(server).listen(5000);
    https.createServer(credentials, server).listen(442);
    // const app = await NestFactory.create(AppModule, { cors: true, httpsOptions: credentials });
    // await app.listen(5000, '0.0.0.0', () => {
    //     logger.log('Notadd GraphQL IDE Server started on: http://localhost:5000/graphql');
    // });
    // const app = await NestFactory.create(AppModule, { cors: true });
    // await app.listen(5000, '0.0.0.0', () => {
    //     logger.log('Notadd GraphQL IDE Server started on: http://localhost:5000/graphql');
    // });
}

bootstrap();
