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
export class MindfulnessAlbumResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    @Query('getMindfulnessAlbum')
    @Permission('anony')
    async getMindfulnessAlbum(req, body: { first: number, after?: number, before?: number, status?: number }) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.getMindfulnessAlbum', body);
        // this.resourceCache.updateResourceCache(data, 'mindfulnessAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessAlbumById')
    @Permission('anony')
    async getMindfulnessAlbumById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.getMindfulnessAlbumById', body);
        // this.resourceCache.updateResourceCache(data, 'mindfulnessAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessAlbumByIds')
    @Permission('anony')
    async getMindfulnessAlbumByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.getMindfulnessAlbumByIds', body);
        // this.resourceCache.updateResourceCache(data, 'mindfulnessAlbum');
        return { code: 200, message: 'success', data };
    }

    @Mutation('createMindfulnessAlbum')
    @Permission('editor')
    async createMindfulnessAlbum(req, body) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.createMindfulnessAlbum', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateMindfulnessAlbum')
    @Permission('editor')
    async updateMindfulnessAlbum(req, body) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.updateMindfulnessAlbum', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteMindfulnessAlbum')
    @Permission('editor')
    async deleteMindfulnessAlbum(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.deleteMindfulnessAlbum', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedMindfulnessAlbum')
    @Permission('editor')
    async revertDeletedMindfulnessAlbum(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.revertDeletedMindfulnessAlbum', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteMindfulnessAlbum')
    @Permission('user')
    async favoriteMindfulnessAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.favoriteMindfulnessAlbum', {
            userId: context.user.id,
            mindfulnessAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchMindfulnessAlbum')
    @Permission('editor')
    async searchMindfulnessAlbum(req, body) {
        const { total, data } = await this.resourceBroker.call('mindfulnessAlbum.searchMindfulnessAlbum', body);
        // this.resourceCache.updateResourceCache(data, 'mindfulnessAlbum');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyMindfulnessAlbum')
    @Permission('user')
    async buyMindfulnessAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.buyMindfulnessAlbum', {
            userId: context.user.id,
            mindfulnessAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('startMindfulnessAlbum')
    @Permission('user')
    async startMindfulnessAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.startMindfulnessAlbum', {
            userId: context.user.id,
            mindfulnessAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishMindfulnessAlbum')
    @Permission('user')
    async finishMindfulnessAlbum(req, body: { id: string, duration: number }, context) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.finishMindfulnessAlbum', {
            userId: context.user.id,
            mindfulnessAlbumId: body.id,
            duration: body.duration,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessAlbumRecordByMindfulnessAlbumId')
    @Permission('user')
    async getMindfulnessAlbumRecordByMindfulnessAlbumId(req, body: { mindfulnessAlbumId: string }, context) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.getMindfulnessAlbumRecordByMindfulnessAlbumId', {
            userId: context.user.id,
            mindfulnessAlbumId: body.mindfulnessAlbumId,
        });
        // this.resourceCache.updateResourceCache(data, 'mindfulnessAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('searchMindfulnessAlbumRecord')
    @Permission('editor')
    async searchMindfulnessAlbumRecord(req, body, context) {
        const { data } = await this.resourceBroker.call('mindfulnessAlbum.searchMindfulnessAlbumRecord', {
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
