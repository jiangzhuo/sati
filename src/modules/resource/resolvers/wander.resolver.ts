import { Inject, Optional, UseGuards, UseInterceptors } from '@nestjs/common';
// import { GraphqlCacheInterceptor } from '../../../common/interceptors/graphqlCache.interceptor';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from '../../../common/decorators';
import { AuthGuard } from '../auth/auth.guard';
import { InjectBroker } from 'nestjs-moleculer';
import { ServiceBroker } from 'moleculer';
import { ErrorsInterceptor, LoggingInterceptor } from '../../../common/interceptors';

@Resolver()
@UseGuards(AuthGuard)
@UseInterceptors(ErrorsInterceptor)
@UseInterceptors(LoggingInterceptor)
export class WanderResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    @Query('sayWanderHello')
    async sayWanderHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('wander.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Mutation('createWander')
    @Permission('editor')
    async createWander(req, body) {
        const { data } = await this.resourceBroker.call('wander.createWander', body.data);
        // this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateWander')
    @Permission('editor')
    async updateWander(req, body) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('wander.updateWander', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteWander')
    @Permission('editor')
    async deleteWander(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wander.deleteWander', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedWander')
    @Permission('editor')
    async revertDeletedWander(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wander.revertDeletedWander', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getWander')
    @Permission('anony')
    async getWander(req, body: { first: number, after?: number, before?: number, status?: number }) {
        const { data } = await this.resourceBroker.call('wander.getWander', body);
        // this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderById')
    @Permission('anony')
    async getWanderById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wander.getWanderById', body);
        // this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderByIds')
    @Permission('anony')
    async getWanderByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('wander.getWanderByIds', body);
        // this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Query('searchWander')
    @Permission('editor')
    async searchWander(req, body) {
        const { total, data } = await this.resourceBroker.call('wander.searchWander', body);
        // this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Query('getWanderByWanderAlbumId')
    @Permission('anony')
    async getWanderByWanderAlbumId(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wander.getWanderByWanderAlbumId', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteWander')
    @Permission('user')
    async favoriteWander(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wander.favoriteWander', {
            userId: context.user.id,
            wanderId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyWander')
    @Permission('user')
    async buyWander(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wander.buyWander', {
            userId: context.user.id,
            wanderId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('startWander')
    @Permission('user')
    async startWander(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wander.startWander', {
            userId: context.user.id,
            wanderId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishWander')
    @Permission('user')
    async finishWander(req, body: { id: string, duration: number }, context) {
        const { data } = await this.resourceBroker.call('wander.finishWander', {
            userId: context.user.id,
            wanderId: body.id,
            duration: body.duration,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderRecordByWanderId')
    @Permission('user')
    async getWanderRecordByWanderId(req, body: { wanderId: string }, context) {
        const { data } = await this.resourceBroker.call('wander.getWanderRecordByWanderId', {
            userId: context.user.id,
            wanderId: body.wanderId,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderRecord')
    @Permission('editor')
    async searchWanderRecord(req, body, context) {
        const { data } = await this.resourceBroker.call('wander.searchWanderRecord', {
            userId: context.user.id,
            page: body.page,
            limit: body.limit,
            sort: body.sort,
            favorite: body.favorite,
            boughtTime: body.boughtTime,
        });
        return { code: 200, message: 'success', data };
    }
}
