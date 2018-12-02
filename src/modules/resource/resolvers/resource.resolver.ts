import { Inject, Optional, UseGuards, UseInterceptors } from '@nestjs/common';
// import { GraphqlCacheInterceptor } from '../../../common/interceptors/graphqlCache.interceptor';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
// import { __ as t } from 'i18n';

import { Permission } from '../../../common/decorators';
import { CommonResult } from '../../../common/interfaces';
// import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';
import { AuthGuard } from '../auth/auth.guard';

import { isArray } from 'lodash';
import { ResourceCache } from '../cache/resource.cache';
// import { ErrorsInterceptor } from '../../../common/interceptors/errors.interceptor';
import { InjectBroker } from 'nestjs-moleculer';
import { ServiceBroker } from 'moleculer';
import { ErrorsInterceptor, GraphqlCacheInterceptor, LoggingInterceptor } from 'src/common/interceptors';

@Resolver()
@UseGuards(AuthGuard)
// @Resource({ name: 'user_manage', identify: 'user:manage' })
@UseInterceptors(ErrorsInterceptor)
@UseInterceptors(LoggingInterceptor)
// @UseInterceptors(GraphqlCacheInterceptor)
export class ResourceResolver {
    onModuleInit() {
        // this.mindfulnessServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('MindfulnessService');
        // this.natureServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('NatureService');
        // this.wanderServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('WanderService');
        // this.sceneServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('SceneService');
        // this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
        // this.homeServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('HomeService');
    }

    constructor(
        // @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory,
        @Optional() @Inject(ResourceCache) private readonly resourceCache: ResourceCache,
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    // private mindfulnessServiceInterface;
    // private natureServiceInterface;
    // private wanderServiceInterface;
    // private sceneServiceInterface;
    // private userServiceInterface;

    // private homeServiceInterface;

    @Query('sayMindfulnessHello')
    async sayMindfulnessHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('mindfulness.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('sayNatureHello')
    async sayNatureHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('nature.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('sayWanderHello')
    async sayWanderHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('wander.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('saySceneHello')
    async saySceneHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('scene.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('sayHomeHello')
    async sayHomeHello(req, body: { name: string }) {
        // const { msg } = await this.homeServiceInterface.sayHello({ name: body.name });
        // return { code: 200, message: 'success', data: msg };
        const { msg } = await this.resourceBroker.call('home.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('getMindfulness')
    @Permission('anony')
    async getMindfulness(req, body: { first: number, after?: number , before?: number }) {
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
        const { data } = await this.resourceBroker.call('mindfulness.getMindfulnessById', { id: body.id });
        await this.userBroker.call('user.changeBalance', {
            id: context.user.id,
            changeValue: -1 * data.price,
            type: 'mindfulness',
            extraInfo: JSON.stringify(data),
        });
        try {
            const { data } = await this.resourceBroker.call('mindfulness.buyMindfulness', {
                userId: context.user.id,
                mindfulnessId: body.id,
            });
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: data.price,
                type: 'mindfulnessRollback',
                extraInfo: JSON.stringify(data),
            });
            return { code: e.code, message: e.details };
        }
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
    async createMindfulness(req, body) {
        const { data } = await this.resourceBroker.call('mindfulness.createMindfulness', body.data);
        // this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateMindfulness')
    @Permission('editor')
    async updateMindfulness(req, body) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('mindfulness.updateMindfulness', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteMindfulness')
    @Permission('editor')
    async deleteMindfulness(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('mindfulness.deleteMindfulness', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedMindfulness')
    @Permission('editor')
    async revertDeletedMindfulness(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('mindfulness.revertDeletedMindfulness', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getNature')
    @Permission('anony')
    async getNature(req, body: { first: number, after?: number , before?: number }) {
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
    @Permission('anony')
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
    async searchNature(req, body: { keyword: string }) {
        const { total, data } = await this.resourceBroker.call('nature.searchNature', { keyword: body.keyword });
        // this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyNature')
    @Permission('user')
    async buyNature(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('nature.getNatureById', { id: body.id });
        try {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: -1 * data.price,
                type: 'nature',
                extraInfo: JSON.stringify(data),
            });
        } catch (e) {
            return { code: e.code, message: e.details };
        }
        try {
            const { data } = await this.resourceBroker.call('nature.buyNature', {
                userId: context.user.id,
                natureId: body.id,
            });
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: data.price,
                type: 'natureRollback',
                extraInfo: JSON.stringify(data),
            });
            return { code: e.code, message: e.details };
        }
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

    @Query('getWander')
    @Permission('anony')
    async getWander(req, body: { first: number, after?: number , before?: number }) {
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

    @Query('getWanderRecordByWanderId')
    @Permission('user')
    async getWanderRecordByWanderId(req, body: { wanderId: string }, context) {
        const { data } = await this.resourceBroker.call('wander.getWanderRecordByWanderId', {
            userId: context.user.id,
            wanderId: body.wanderId,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbum')
    @Permission('anony')
    async getWanderAlbum(req, body: { first: number, after?: number , before?: number }) {
        const { data } = await this.resourceBroker.call('wander.getWanderAlbum', body);
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumById')
    @Permission('anony')
    async getWanderAlbumById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wander.getWanderAlbumById', body);
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumByIds')
    @Permission('anony')
    async getWanderAlbumByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('wander.getWanderAlbumByIds', body);
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumRecordByWanderAlbumId')
    @Permission('user')
    async getWanderAlbumRecordByWanderAlbumId(req, body: { wanderAlbumId: string }, context) {
        const { data } = await this.resourceBroker.call('wander.getWanderAlbumRecordByWanderAlbumId', {
            userId: context.user.id,
            wanderAlbumId: body.wanderAlbumId,
        });
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderByWanderAlbumId')
    @Permission('anony')
    async getWanderByWanderAlbumId(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wander.getWanderByWanderAlbumId', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getScene')
    @Permission('anony')
    async getScene(req, body: { first: number, after?: string }) {
        const { data } = await this.resourceBroker.call('scene.getScene', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getSceneById')
    @Permission('anony')
    async getSceneById(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('scene.getSceneById', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getSceneByIds')
    @Permission('anony')
    async getSceneByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('scene.getSceneByIds', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('createScene')
    @Permission('editor')
    async createScene(req, body: { name: string }) {
        const { data } = await this.resourceBroker.call('scene.createScene', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateScene')
    @Permission('editor')
    async updateScene(req, body: { id: string, name: string }) {
        const { data } = await this.resourceBroker.call('scene.updateScene', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteScene')
    @Permission('editor')
    async deleteScene(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('scene.deleteScene', body);
        return { code: 200, message: 'success', data };
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

    @Mutation('favoriteWander')
    @Permission('user')
    async favoriteWander(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wander.favoriteWander', {
            userId: context.user.id,
            wanderId: body.id,
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

    @Query('searchWander')
    @Permission('editor')
    async searchWander(req, body: { keyword: string }) {
        const { total, data } = await this.resourceBroker.call('wander.searchWander', { keyword: body.keyword });
        // this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyWander')
    @Permission('user')
    async buyWander(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wander.getWanderById', { id: body.id });
        try {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: -1 * data.price,
                type: 'wander',
                extraInfo: JSON.stringify(data),
            });
        } catch (e) {
            return { code: e.code, message: e.details };
        }
        try {
            const { data } = await this.resourceBroker.call('wander.buyWander', {
                userId: context.user.id,
                wanderId: body.id,
            });
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userBroker.call('user.changeBalance', {
                id: context.user.id,
                changeValue: data.price,
                type: 'wanderRollback',
                extraInfo: JSON.stringify(data),
            });
            return { code: e.code, message: e.details };
        }
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

    @Mutation('createWanderAlbum')
    @Permission('editor')
    async createWanderAlbum(req, body) {
        const { data } = await this.resourceBroker.call('wander.createWanderAlbum', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateWanderAlbum')
    @Permission('editor')
    async updateWanderAlbum(req, body) {
        body.data.id = body.id;
        const { data } = await this.resourceBroker.call('wander.updateWanderAlbum', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteWanderAlbum')
    @Permission('editor')
    async deleteWanderAlbum(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wander.deleteWanderAlbum', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedWanderAlbum')
    @Permission('editor')
    async revertDeletedWanderAlbum(req, body: { id: string }) {
        const { data } = await this.resourceBroker.call('wander.revertDeletedWanderAlbum', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteWanderAlbum')
    @Permission('anony')
    async favoriteWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wander.favoriteWanderAlbum', {
            userId: context.user.id,
            wanderAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderAlbumRecord')
    @Permission('editor')
    async searchWanderAlbumRecord(req, body, context) {
        const { data } = await this.resourceBroker.call('wander.searchWanderAlbumRecord', {
            userId: context.user.id,
            page: body.page,
            limit: body.limit,
            sort: body.sort,
            favorite: body.favorite,
            boughtTime: body.boughtTime,
        });
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderAlbum')
    @Permission('editor')
    async searchWanderAlbum(req, body: { keyword: string }) {
        const { total, data } = await this.resourceBroker.call('wander.searchWanderAlbum', { keyword: body.keyword });
        // this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Mutation('buyWanderAlbum')
    @Permission('user')
    async buyWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.resourceBroker.call('wander.getWanderAlbumById', { id: body.id });
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
            const { data } = await this.resourceBroker.call('wander.buyWanderAlbum', {
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
        const { data } = await this.resourceBroker.call('wander.startWanderAlbum', {
            userId: context.user.id,
            wanderAlbumId: body.id,
        });
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishWanderAlbum')
    @Permission('user')
    async finishWanderAlbum(req, body: { id: string, duration: number }, context) {
        const { data } = await this.resourceBroker.call('wander.finishWanderAlbum', {
            userId: context.user.id,
            wanderAlbumId: body.id,
            duration: body.duration,
        });
        return { code: 200, message: 'success', data };
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
    async getNew(req, body: { first: number, after?: number, before?: number }) {
        // const mindfulnessResponse = await this.mindfulnessServiceInterface.getMindfulness(body);
        // const natureResponse = await this.natureServiceInterface.getNature(body);
        // const wanderResponse = await this.wanderServiceInterface.getWander(body);
        // const wanderAlbumResponse = await this.wanderServiceInterface.getWanderAlbum(body);
        // const data = this.resourceCache.getResourceByCreateTime(body.first, body.after,body.before).map((resource) => {
        //     return {
        //         resourceId: resource.id,
        //         type: resource.type,
        //         name: resource.name,
        //         description: resource.description,
        //         background: resource.background,
        //         price: resource.price,
        //         author: resource.author,
        //         createTime: resource.createTime,
        //         updateTime: resource.updateTime,
        //     };
        // });
        const { data } = await this.resourceBroker.call('home.getNew', body);
        return { code: 200, message: 'success', data };
    }
}
