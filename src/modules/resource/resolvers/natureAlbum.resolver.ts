import { Inject, Logger, Optional, UseGuards, UseInterceptors } from '@nestjs/common';
// import { GraphqlCacheInterceptor } from '../../../common/interceptors/graphqlCache.interceptor';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from '../../../common/decorators';
import { AuthGuard } from '../../user/auth/auth.guard';
import { InjectBroker } from 'nestjs-moleculer';
import { ServiceBroker } from 'moleculer';
import { ErrorsInterceptor, LoggingInterceptor } from '../../../common/interceptors';

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

    private logger = new Logger('natureAlbum');

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
    async createNatureAlbum(req, body, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('natureAlbum.createNatureAlbum', body.data);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateNatureAlbum')
    @Permission('editor')
    async updateNatureAlbum(req, body, context, resolveInfo) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('natureAlbum.updateNatureAlbum', body.data);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteNatureAlbum')
    @Permission('editor')
    async deleteNatureAlbum(req, body: { id: string }, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('natureAlbum.deleteNatureAlbum', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedNatureAlbum')
    @Permission('editor')
    async revertDeletedNatureAlbum(req, body: { id: string }, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('natureAlbum.revertDeletedNatureAlbum', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
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
    async searchNatureAlbum(req, body) {
        const { total, data } = await this.resourceBroker.call('natureAlbum.searchNatureAlbum', body);
        // this.resourceCache.updateResourceCache(data, 'natureAlbum');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyNatureAlbum')
    @Permission('user')
    async buyNatureAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('natureAlbum.buyNatureAlbum', {
            userId: context.user.id,
            natureAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
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
