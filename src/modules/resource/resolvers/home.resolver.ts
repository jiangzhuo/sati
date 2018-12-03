import { Inject, Optional, UseGuards, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from '../../../common/decorators';
import { AuthGuard } from '../auth/auth.guard';
import { InjectBroker } from 'nestjs-moleculer';
import { ServiceBroker } from 'moleculer';
import { ErrorsInterceptor, LoggingInterceptor } from 'src/common/interceptors';

@Resolver()
@UseGuards(AuthGuard)
@UseInterceptors(ErrorsInterceptor)
@UseInterceptors(LoggingInterceptor)
export class HomeResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    @Query('sayHomeHello')
    async sayHomeHello(req, body: { name: string }) {
        // const { msg } = await this.homeServiceInterface.sayHello({ name: body.name });
        // return { code: 200, message: 'success', data: msg };
        const { msg } = await this.resourceBroker.call('home.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('getHome')
    @Permission('anony')
    async getHome(req, body: { first: number, after?: number, before?: number, position?: number }) {
        const { data } = await this.resourceBroker.call('home.getHome', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getHomeById')
    @Permission('anony')
    async getHomeById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('home.getHomeById', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('createHome')
    @Permission('editor')
    async createHome(req, body) {
        const { data } = await this.resourceBroker.call('home.createHome', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateHome')
    @Permission('editor')
    async updateHome(req, body) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('home.updateHome', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteHome')
    @Permission('editor')
    async deleteHome(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('home.deleteHome', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getNew')
    @Permission('anony')
    async getNew(req, body: { first: number, after?: number, before?: number, status?: number }) {
        const { data } = await this.resourceBroker.call('home.getNew', body);
        return { code: 200, message: 'success', data };
    }
}
