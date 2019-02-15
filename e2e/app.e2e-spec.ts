// import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
// import { CatsService } from '../../src/cats/cats.service';
import { INestApplication } from '@nestjs/common';
import { createTestClient } from 'apollo-server-testing';
import { GraphQLModule } from '@nestjs/graphql';
import supertest from 'supertest';

const mongoUnit = require('mongo-unit');

describe('Cats', () => {
    let app: INestApplication;
    // let queryClient;

    beforeAll(async () => {
        const mongoUrl = await mongoUnit.start();
        console.log(mongoUrl);
        console.log(11111111);
        process.env = {
        };
        const module = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile();

        app = module.createNestApplication();
        await app.init();


        // const graphqlModule = module.get<GraphQLModule>(GraphQLModule);
        // // console.log(graphqlModule.apolloServer);
        // // //
        // const { query, mutate } = createTestClient(graphqlModule.apolloServer);
        // queryClient = query;
    }, 1000000);

    it(`/GET cats`, async () => {
        // return true;

        // let res = await queryClient({query:'query helloStat {  helloStat {    code    message  }}'});
        // console.log(res);
        const res = await supertest(app.getHttpServer())
            .post('/graphql')
            .send({
                query: 'query helloStat {  helloStat {    code    message  }}',
            });
        expect(res.status).toBe(200);

    });

    afterAll(async () => {
        await app.close();
    });
});
