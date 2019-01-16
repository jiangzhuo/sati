import { UseGuards, UseInterceptors } from '@nestjs/common';
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
export class NatureResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    @Query('sayNatureHello')
    async sayNatureHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('nature.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('getNature')
    @Permission('anony')
    async getNature(req, body: { first: number, after?: number, before?: number, status?: number }) {
        const { data } = await this.resourceBroker.call('nature.getNature', body);
        // this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureById')
    @Permission('anony')
    async getNatureById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('nature.getNatureById', body);
        // this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureByIds')
    @Permission('anony')
    async getNatureByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('nature.getNatureByIds', body);
        // this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureRecordByNatureId')
    @Permission('user')
    async getNatureRecordByNatureId(req, body: { natureId: string }, context) {
        const { data } = await this.resourceBroker.call('nature.getNatureRecordByNatureId', {
            userId: context.user.id,
            natureId: body.natureId,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('createNature')
    @Permission('editor')
    async createNature(req, body) {
        const { data } = await this.resourceBroker.call('nature.createNature', body.data);
        // this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateNature')
    @Permission('editor')
    async updateNature(req, body) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('nature.updateNature', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteNature')
    @Permission('editor')
    async deleteNature(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('nature.deleteNature', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedNature')
    @Permission('editor')
    async revertDeletedNature(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('nature.revertDeletedNature', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteNature')
    @Permission('user')
    async favoriteNature(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('nature.favoriteNature', {
            userId: context.user.id,
            natureId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchNatureRecord')
    @Permission('editor')
    async searchNatureRecord(req, body, context) {
        const { data } = await this.resourceBroker.call('nature.searchNatureRecord', {
            userId: context.user.id,
            page: body.page,
            limit: body.limit,
            sort: body.sort,
            favorite: body.favorite,
            boughtTime: body.boughtTime,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchNature')
    @Permission('editor')
    async searchNature(req, body) {
        const { total, data } = await this.resourceBroker.call('nature.searchNature', body);
        // this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyNature')
    @Permission('user')
    async buyNature(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('nature.buyNature', {
            userId: context.user.id,
            natureId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('startNature')
    @Permission('user')
    async startNature(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('nature.startNature', {
            userId: context.user.id,
            natureId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishNature')
    @Permission('user')
    async finishNature(req, body: { id: string, duration: number }, context) {
        const { data } = await this.resourceBroker.call('nature.finishNature', {
            userId: context.user.id,
            natureId: body.id,
            duration: body.duration,
        });
        return { code: 200, message: 'success', data };
    }
}
