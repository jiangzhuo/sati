import './hackNestLogger';
import * as Sentry from '@sentry/node';
import { hostname } from 'os';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
// import * as fs from 'fs';
import express = require('express');
import * as http from 'http';
import * as https from 'https';
// import * as path from 'path';
// import { ACMClient } from 'acm-client';
import { NacosConfigClient } from 'nacos';

async function bootstrap() {
    // 初始化Logger
    const logger = new Logger('sati');

    // 初始化ACM或者配置
    const acm = new NacosConfigClient({
    // const acm = new ACMClient({
        endpoint: 'acm.aliyun.com', // acm 控制台查看
        namespace: process.env.ACM_NAMESPACE || 'c21ca12b-4a71-4092-82bc-e8fcaaf1f89f', // acm 控制台查看
        accessKey: process.env.ACM_ACCESS_KEY_ID || 'LTAIhIOInA2pDmga', // acm 控制台查看
        secretKey: process.env.ACM_ACCESS_KEY_SECRET || '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL', // acm 控制台查看
        requestTimeout: parseInt(process.env.ACM_TIMEOUT) || 6000, // 请求超时时间，默认6s
    });
    await acm.ready();
    // const allConfigs = await acm.getConfigs();
    const allConfigs = [
        { dataId: 'ACM_NAMESPACE', group: 'sati' },
        { dataId: 'ACM_ACCESS_KEY_ID', group: 'sati' },
        { dataId: 'ACM_ACCESS_KEY_SECRET', group: 'sati' },
        { dataId: 'ACM_TIMEOUT', group: 'sati' },
        { dataId: 'SENTRY_DSN', group: 'sati' },
        { dataId: 'SSL_PRIVATE_KEY', group: 'sati' },
        { dataId: 'SSL_CERTIFICATE', group: 'sati' },
        { dataId: 'SSL_CA', group: 'sati' },
        { dataId: 'HTTP_PORT', group: 'sati' },
        { dataId: 'HTTPS_PORT', group: 'sati' },
        { dataId: 'LOG_LEVEL', group: 'sati' },
        { dataId: 'OSS_REGION', group: 'sati' },
        { dataId: 'OSS_ACCESS_KEY_ID', group: 'sati' },
        { dataId: 'OSS_ACCESS_KEY_SECRET', group: 'sati' },
        { dataId: 'OSS_BUCKET', group: 'sati' },
        { dataId: 'OSS_BASE_URL', group: 'sati' },
        { dataId: 'BASE_URL', group: 'sati' },
        { dataId: 'WHITELIST_OPERATION_NAME', group: 'sati' },
        { dataId: 'AUTH_TOKEN_SECRET_KEY', group: 'sati' },
    ];
    const getAllConfigPromise = [];
    allConfigs.forEach((config) => {
        getAllConfigPromise.push(acm.getConfig(config.dataId, config.group).then((content) => {
            return { config, content };
        }));
    });
    const allConfigResult = await Promise.all(getAllConfigPromise);
    allConfigResult.forEach((res) => {
        process.env[res.config.dataId] = res.content;
        // logger.log(`${res.config.dataId}    -   ${res.content}`);
        acm.subscribe(res.config, (content) => {
            process.env[res.config.dataId] = content;
        });
    });
    logger.log('init config finished');

    // 初始化sentry
    Sentry.init({ dsn: process.env.SENTRY_DSN, serverName: hostname() });

    // setInterval(() => {
    //     console.log(process.env.acm_test, process.env.acm_test_JSON);
    // }, 1000);

    const privateKey = process.env.SSL_PRIVATE_KEY;
    const certificate = process.env.SSL_CERTIFICATE;
    const ca = process.env.SSL_CA;

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca,
    };

    const server = express();
    const app = await NestFactory.create(AppModule, server, { cors: true, httpsOptions: credentials });
    await app.init();

    http.createServer(server).listen(parseInt(process.env.HTTP_PORT, 10));
    https.createServer(credentials, server).listen(parseInt(process.env.HTTPS_PORT, 10));
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
