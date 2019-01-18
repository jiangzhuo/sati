import { Inject, Logger, Optional, UseGuards, UseInterceptors } from '@nestjs/common';
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
export class MindfulnessResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    private logger = new Logger('mindfulness');

    @Query('sayMindfulnessHello')
    async sayMindfulnessHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('mindfulness.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('getMindfulness')
    @Permission('anony')
    async getMindfulness(req, body: { first: number, after?: number, before?: number, status?: number }) {
        const { data } = await this.resourceBroker.call('mindfulness.getMindfulness', body);
        // this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessById')
    @Permission('anony')
    async getMindfulnessById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('mindfulness.getMindfulnessById', body);
        // this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessByIds')
    @Permission('anony')
    async getMindfulnessByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('mindfulness.getMindfulnessByIds', body);
        // this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessRecordByMindfulnessId')
    @Permission('user')
    async getMindfulnessRecordByMindfulnessId(req, body: { mindfulnessId: string }, context) {
        const { data } = await this.resourceBroker.call('mindfulness.getMindfulnessRecordByMindfulnessId', {
            userId: context.user.id,
            mindfulnessId: body.mindfulnessId,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchMindfulnessRecord')
    @Permission('editor')
    async searchMindfulnessRecord(req, body, context) {
        const { data } = await this.resourceBroker.call('mindfulness.searchMindfulnessRecord', {
            userId: context.user.id,
            page: body.page,
            limit: body.limit,
            sort: body.sort,
            favorite: body.favorite,
            boughtTime: body.boughtTime,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteMindfulness')
    @Permission('user')
    async favoriteMindfulness(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('mindfulness.favoriteMindfulness', {
            userId: context.user.id,
            mindfulnessId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchMindfulness')
    @Permission('editor')
    async searchMindfulness(req, body) {
        const { total, data } = await this.resourceBroker.call('mindfulness.searchMindfulness', body);
        // this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyMindfulness')
    @Permission('user')
    async buyMindfulness(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('mindfulness.buyMindfulness', {
            userId: context.user.id,
            mindfulnessId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('startMindfulness')
    @Permission('user')
    async startMindfulness(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('mindfulness.startMindfulness', {
            userId: context.user.id,
            mindfulnessId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishMindfulness')
    @Permission('user')
    async finishMindfulness(req, body: { id: string, duration: number }, context) {
        const { data } = await this.resourceBroker.call('mindfulness.finishMindfulness', {
            userId: context.user.id,
            mindfulnessId: body.id,
            duration: body.duration,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('createMindfulness')
    @Permission('editor')
    async createMindfulness(req, body, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('mindfulness.createMindfulness', body.data);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateMindfulness')
    @Permission('editor')
    async updateMindfulness(req, body, context, resolveInfo) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('mindfulness.updateMindfulness', body.data);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteMindfulness')
    @Permission('editor')
    async deleteMindfulness(req, body: { id: string }, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('mindfulness.deleteMindfulness', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedMindfulness')
    @Permission('editor')
    async revertDeletedMindfulness(req, body: { id: string }, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('mindfulness.revertDeletedMindfulness', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }
}
