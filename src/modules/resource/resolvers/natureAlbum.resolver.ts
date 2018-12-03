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
export class NatureAlbumResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    @Query('getNatureAlbum')
    @Permission('user')
    async getNatureAlbum(req, body: { first: number, after?: number, before?: number, status?: number }) {
        const { data } = await this.resourceBroker.call('natureAlbum.getNatureAlbum', body);
        // this.resourceCache.updateResourceCache(data, 'natureAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureAlbumById')
    @Permission('user')
    async getNatureAlbumById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('natureAlbum.getNatureAlbumById', body);
        // this.resourceCache.updateResourceCache(data, 'natureAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureAlbumByIds')
    @Permission('user')
    async getNatureAlbumByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('natureAlbum.getNatureAlbumByIds', body);
        // this.resourceCache.updateResourceCache(data, 'natureAlbum');
        return { code: 200, message: 'success', data };
    }

    @Mutation('createNatureAlbum')
    @Permission('editor')
    async createNatureAlbum(req, body) {
        const { data } = await this.resourceBroker.call('natureAlbum.createNatureAlbum', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateNatureAlbum')
    @Permission('editor')
    async updateNatureAlbum(req, body) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('natureAlbum.updateNatureAlbum', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteNatureAlbum')
    @Permission('editor')
    async deleteNatureAlbum(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('natureAlbum.deleteNatureAlbum', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedNatureAlbum')
    @Permission('editor')
    async revertDeletedNatureAlbum(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('natureAlbum.revertDeletedNatureAlbum', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteNatureAlbum')
    @Permission('user')
    async favoriteNatureAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('natureAlbum.favoriteNatureAlbum', {
            userId: context.user.id,
            natureAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchNatureAlbum')
    @Permission('editor')
    async searchNatureAlbum(req, body: { keyword: string }) {
        const { total, data } = await this.resourceBroker.call('natureAlbum.searchNatureAlbum', { keyword: body.keyword });
        // this.resourceCache.updateResourceCache(data, 'natureAlbum');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyNatureAlbum')
    @Permission('user')
    async buyNatureAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('natureAlbum.getNatureAlbumById', { id: body.id });
        try {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: -1 * data.price,
                type: 'natureAlbum',
                extraInfo: JSON.stringify(data),
            });
        } catch (e) {
            return { code: e.code, message: e.details };
        }
        try {
            const { data } = await this.resourceBroker.call('natureAlbum.buyNatureAlbum', {
                userId: context.user.id,
                natureAlbumId: body.id,
            });
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: data.price,
                type: 'natureAlbumRollback',
                extraInfo: JSON.stringify(data),
            });
            return { code: e.code, message: e.details };
        }
    }

    @Mutation('startNatureAlbum')
    @Permission('user')
    async startNatureAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('natureAlbum.startNatureAlbum', {
            userId: context.user.id,
            natureAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishNatureAlbum')
    @Permission('user')
    async finishNatureAlbum(req, body: { id: string, duration: number }, context) {
        const { data } = await this.resourceBroker.call('natureAlbum.finishNatureAlbum', {
            userId: context.user.id,
            natureAlbumId: body.id,
            duration: body.duration,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureAlbumRecordByNatureAlbumId')
    @Permission('user')
    async getNatureAlbumRecordByNatureAlbumId(req, body: { natureAlbumId: string }, context) {
        const { data } = await this.resourceBroker.call('natureAlbum.getNatureAlbumRecordByNatureAlbumId', {
            userId: context.user.id,
            natureAlbumId: body.natureAlbumId,
        });
        // this.resourceCache.updateResourceCache(data, 'natureAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('searchNatureAlbumRecord')
    @Permission('editor')
    async searchNatureAlbumRecord(req, body, context) {
        const { data } = await this.resourceBroker.call('natureAlbum.searchNatureAlbumRecord', {
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
