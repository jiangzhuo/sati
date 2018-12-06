import { Inject, Optional, UseGuards, UseInterceptors } from '@nestjs/common';
// import { GraphqlCacheInterceptor } from '../../../common/interceptors/graphqlCache.interceptor';
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
export class WanderAlbumResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    @Query('getWanderAlbum')
    @Permission('anony')
    async getWanderAlbum(req, body: { first: number, after?: number, before?: number, status?: number }) {
        const { data } = await this.resourceBroker.call('wanderAlbum.getWanderAlbum', body);
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumById')
    @Permission('anony')
    async getWanderAlbumById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wanderAlbum.getWanderAlbumById', body);
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumByIds')
    @Permission('anony')
    async getWanderAlbumByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('wanderAlbum.getWanderAlbumByIds', body);
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Mutation('createWanderAlbum')
    @Permission('editor')
    async createWanderAlbum(req, body) {
        const { data } = await this.resourceBroker.call('wanderAlbum.createWanderAlbum', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateWanderAlbum')
    @Permission('editor')
    async updateWanderAlbum(req, body) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('wanderAlbum.updateWanderAlbum', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteWanderAlbum')
    @Permission('editor')
    async deleteWanderAlbum(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wanderAlbum.deleteWanderAlbum', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedWanderAlbum')
    @Permission('editor')
    async revertDeletedWanderAlbum(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wanderAlbum.revertDeletedWanderAlbum', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteWanderAlbum')
    @Permission('user')
    async favoriteWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wanderAlbum.favoriteWanderAlbum', {
            userId: context.user.id,
            wanderAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderAlbum')
    @Permission('editor')
    async searchWanderAlbum(req, body) {
        const { total, data } = await this.resourceBroker.call('wanderAlbum.searchWanderAlbum', body);
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyWanderAlbum')
    @Permission('user')
    async buyWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wanderAlbum.getWanderAlbumById', { id: body.id });
        try {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: -1 * data.price,
                type: 'wanderAlbum',
                extraInfo: JSON.stringify(data),
            });
        } catch (e) {
            return { code: e.code, message: e.details };
        }
        try {
            const { data } = await this.resourceBroker.call('wanderAlbum.buyWanderAlbum', {
                userId: context.user.id,
                wanderAlbumId: body.id,
            });
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: data.price,
                type: 'wanderAlbumRollback',
                extraInfo: JSON.stringify(data),
            });
            return { code: e.code, message: e.details };
        }
    }

    @Mutation('startWanderAlbum')
    @Permission('user')
    async startWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wanderAlbum.startWanderAlbum', {
            userId: context.user.id,
            wanderAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishWanderAlbum')
    @Permission('user')
    async finishWanderAlbum(req, body: { id: string, duration: number }, context) {
        const { data } = await this.resourceBroker.call('wanderAlbum.finishWanderAlbum', {
            userId: context.user.id,
            wanderAlbumId: body.id,
            duration: body.duration,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumRecordByWanderAlbumId')
    @Permission('user')
    async getWanderAlbumRecordByWanderAlbumId(req, body: { wanderAlbumId: string }, context) {
        const { data } = await this.resourceBroker.call('wanderAlbum.getWanderAlbumRecordByWanderAlbumId', {
            userId: context.user.id,
            wanderAlbumId: body.wanderAlbumId,
        });
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderAlbumRecord')
    @Permission('editor')
    async searchWanderAlbumRecord(req, body, context) {
        const { data } = await this.resourceBroker.call('wanderAlbum.searchWanderAlbumRecord', {
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
