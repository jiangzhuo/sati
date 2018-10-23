import { HttpException, Inject, Optional, UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { __ as t } from 'i18n';

import { Permission, Resource } from '../../../common/decorators';
import { CommonResult } from '../../../common/interfaces';
import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';
import { AuthGuard } from '../auth/auth.guard';

import { isArray } from 'lodash';
import { ResourceCache } from '../cache/resource.cache';

@Resolver()
@UseGuards(AuthGuard)
// @Resource({ name: 'user_manage', identify: 'user:manage' })
export class ResourceResolver {
    onModuleInit() {
        this.mindfulnessServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('MindfulnessService');
        this.natureServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('NatureService');
        this.wanderServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('WanderService');
        this.sceneServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('SceneService');
        this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
        this.homeServiceInterface = this.notaddGrpcClientFactory.resourceModuleClient.getService('HomeService');
    }

    constructor(
        @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory,
        @Optional() @Inject(ResourceCache) private readonly resourceCache: ResourceCache
    ) {
    }

    private mindfulnessServiceInterface;
    private natureServiceInterface;
    private wanderServiceInterface;
    private sceneServiceInterface;
    private userServiceInterface;
    private homeServiceInterface;

    @Query('sayMindfulnessHello')
    async sayMindfulnessHello(req, body: { name: string }) {
        const { msg } = await this.mindfulnessServiceInterface.sayHello({ name: body.name }).toPromise();
        return { code: 200, message: 'success', data: msg };
    }

    @Query('sayNatureHello')
    async sayNatureHello(req, body: { name: string }) {
        const { msg } = await this.natureServiceInterface.sayHello({ name: body.name }).toPromise();
        return { code: 200, message: 'success', data: msg };
    }

    @Query('sayWanderHello')
    async sayWanderHello(req, body: { name: string }) {
        const { msg } = await this.wanderServiceInterface.sayHello({ name: body.name }).toPromise();
        return { code: 200, message: 'success', data: msg };
    }

    @Query('saySceneHello')
    async saySceneHello(req, body: { name: string }) {
        const { msg } = await this.sceneServiceInterface.sayHello({ name: body.name }).toPromise();
        return { code: 200, message: 'success', data: msg };
    }

    @Query('getMindfulness')
    @Permission('user')
    async getMindfulness(req, body: { first: number, after?: string }) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulness(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessById')
    @Permission('user')
    async getMindfulnessById(req, body: { id: string }) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulnessById(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessByIds')
    @Permission('user')
    async getMindfulnessByIds(req, body: { ids: [string] }) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulnessByIds(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessRecordByMindfulnessId')
    @Permission('user')
    async getMindfulnessRecordByMindfulnessId(req, body: { mindfulnessId: string }, context) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulnessRecordByMindfulnessId({
            userId: context.user.id,
            mindfulnessId: body.mindfulnessId
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchMindfulnessRecord')
    @Permission('editor')
    async searchMindfulnessRecord(req, body, context) {
        const { data } = await this.mindfulnessServiceInterface.searchMindfulnessRecord({
            userId: context.user.id,
            page: body.page,
            limit: body.limit,
            sort: body.sort,
            favorite: body.favorite,
            boughtTime: body.boughtTime
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteMindfulness')
    @Permission('user')
    async favoriteMindfulness(req, body: { id: string }, context) {
        const { data } = await this.mindfulnessServiceInterface.favoriteMindfulness({
            userId: context.user.id,
            mindfulnessId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchMindfulness')
    @Permission('editor')
    async searchMindfulness(req, body: { keyword: string }) {
        const { data } = await this.mindfulnessServiceInterface.searchMindfulness({ keyword: body.keyword }).toPromise();
        this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyMindfulness')
    @Permission('user')
    async buyMindfulness(req, body: { id: string }, context) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulnessById({ id: body.id }).toPromise();
        try {
            await this.userServiceInterface.changeBalance({
                id: context.user.id,
                changeValue: -1 * data.price,
                type: 'mindfulness',
                extraInfo: JSON.stringify(data)
            }).toPromise();
        } catch (e) {
            return { code: e.code, message: e.details };
        }
        try {
            const { data } = await this.mindfulnessServiceInterface.buyMindfulness({
                userId: context.user.id,
                mindfulnessId: body.id
            }).toPromise();
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userServiceInterface.changeBalance({
                id: context.user.id,
                changeValue: data.price,
                type: 'mindfulnessRollback',
                extraInfo: JSON.stringify(data)
            }).toPromise();
            return { code: e.code, message: e.details };
        }
    }

    @Mutation('startMindfulness')
    @Permission('user')
    async startMindfulness(req, body: { id: string }, context) {
        const { data } = await this.mindfulnessServiceInterface.startMindfulness({
            userId: context.user.id,
            mindfulnessId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishMindfulness')
    @Permission('user')
    async finishMindfulness(req, body: { id: string, duration: number }, context) {
        const { data } = await this.mindfulnessServiceInterface.finishMindfulness({
            userId: context.user.id,
            mindfulnessId: body.id,
            duration: body.duration
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createMindfulness')
    @Permission('editor')
    async createMindfulness(req, body) {
        const { data } = await this.mindfulnessServiceInterface.createMindfulness(body.data).toPromise();
        this.resourceCache.updateResourceCache(data, 'mindfulness');
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateMindfulness')
    @Permission('editor')
    async updateMindfulness(req, body) {
        body.data.id = body.id;
        const { data } = await this.mindfulnessServiceInterface.updateMindfulness(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteMindfulness')
    @Permission('editor')
    async deleteMindfulness(req, body: { id: string }) {
        const { data } = await this.mindfulnessServiceInterface.deleteMindfulness(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedMindfulness')
    @Permission('editor')
    async revertDeletedMindfulness(req, body: { id: string }) {
        const { data } = await this.mindfulnessServiceInterface.revertDeletedMindfulness(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getNature')
    @Permission('user')
    async getNature(req, body: { first: number, after?: string }) {
        const { data } = await this.natureServiceInterface.getNature(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureById')
    @Permission('user')
    async getNatureById(req, body: { id: string }) {
        const { data } = await this.natureServiceInterface.getNatureById(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureByIds')
    @Permission('user')
    async getNatureByIds(req, body: { ids: [string] }) {
        const { data } = await this.natureServiceInterface.getNatureByIds(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureRecordByNatureId')
    @Permission('user')
    async getNatureRecordByNatureId(req, body: { natureId: string }, context) {
        const { data } = await this.natureServiceInterface.getNatureRecordByNatureId({
            userId: context.user.id,
            natureId: body.natureId
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createNature')
    @Permission('editor')
    async createNature(req, body) {
        const { data } = await this.natureServiceInterface.createNature(body.data).toPromise();
        this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateNature')
    @Permission('editor')
    async updateNature(req, body) {
        body.data.id = body.id;
        const { data } = await this.natureServiceInterface.updateNature(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteNature')
    @Permission('editor')
    async deleteNature(req, body: { id: string }) {
        const { data } = await this.natureServiceInterface.deleteNature(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedNature')
    @Permission('editor')
    async revertDeletedNature(req, body: { id: string }) {
        const { data } = await this.natureServiceInterface.revertDeletedNature(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteNature')
    @Permission('user')
    async favoriteNature(req, body: { id: string }, context) {
        const { data } = await this.natureServiceInterface.favoriteNature({
            userId: context.user.id,
            natureId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchNatureRecord')
    @Permission('editor')
    async searchNatureRecord(req, body, context) {
        const { data } = await this.natureServiceInterface.searchNatureRecord({
            userId: context.user.id,
            page: body.page,
            limit: body.limit,
            sort: body.sort,
            favorite: body.favorite,
            boughtTime: body.boughtTime
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchNature')
    @Permission('editor')
    async searchNature(req, body: { keyword: string }) {
        const { data } = await this.natureServiceInterface.searchNature({ keyword: body.keyword }).toPromise();
        this.resourceCache.updateResourceCache(data, 'nature');
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyNature')
    @Permission('user')
    async buyNature(req, body: { id: string }, context) {
        const { data } = await this.natureServiceInterface.getNatureById({ id: body.id }).toPromise();
        try {
            await this.userServiceInterface.changeBalance({
                id: context.user.id,
                changeValue: -1 * data.price,
                type: 'nature',
                extraInfo: JSON.stringify(data)
            }).toPromise();
        } catch (e) {
            return { code: e.code, message: e.details };
        }
        try {
            const { data } = await this.natureServiceInterface.buyNature({
                userId: context.user.id,
                natureId: body.id
            }).toPromise();
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userServiceInterface.changeBalance({
                id: context.user.id,
                changeValue: data.price,
                type: 'natureRollback',
                extraInfo: JSON.stringify(data)
            }).toPromise();
            return { code: e.code, message: e.details };
        }
    }

    @Mutation('startNature')
    @Permission('user')
    async startNature(req, body: { id: string }, context) {
        const { data } = await this.natureServiceInterface.startNature({
            userId: context.user.id,
            natureId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishNature')
    @Permission('user')
    async finishNature(req, body: { id: string, duration: number }, context) {
        const { data } = await this.natureServiceInterface.finishNature({
            userId: context.user.id,
            natureId: body.id,
            duration: body.duration
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWander')
    @Permission('user')
    async getWander(req, body: { first: number, after?: string }) {
        const { data } = await this.wanderServiceInterface.getWander(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderById')
    @Permission('user')
    async getWanderById(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.getWanderById(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderByIds')
    @Permission('user')
    async getWanderByIds(req, body: { ids: [string] }) {
        const { data } = await this.wanderServiceInterface.getWanderByIds(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderRecordByWanderId')
    @Permission('user')
    async getWanderRecordByWanderId(req, body: { wanderId: string }, context) {
        const { data } = await this.wanderServiceInterface.getWanderRecordByWanderId({
            userId: context.user.id,
            wanderId: body.wanderId
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbum')
    @Permission('user')
    async getWanderAlbum(req, body: { first: number, after?: string }) {
        const { data } = await this.wanderServiceInterface.getWanderAlbum(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumById')
    @Permission('user')
    async getWanderAlbumById(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.getWanderAlbumById(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumByIds')
    @Permission('user')
    async getWanderAlbumByIds(req, body: { ids: [string] }) {
        const { data } = await this.wanderServiceInterface.getWanderAlbumByIds(body).toPromise();
        this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumRecordByWanderAlbumId')
    @Permission('user')
    async getWanderAlbumRecordByWanderAlbumId(req, body: { wanderAlbumId: string }, context) {
        const { data } = await this.wanderServiceInterface.getWanderAlbumRecordByWanderAlbumId({
            userId: context.user.id,
            wanderAlbumId: body.wanderAlbumId
        }).toPromise();
        this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderByWanderAlbumId')
    @Permission('user')
    async getWanderByWanderAlbumId(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.getWanderByWanderAlbumId(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getScene')
    @Permission('user')
    async getScene(req, body: { first: number, after?: string }) {
        const { data } = await this.sceneServiceInterface.getScene(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getSceneById')
    @Permission('user')
    async getSceneById(req, body: { id: string }) {
        const { data } = await this.sceneServiceInterface.getSceneById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getSceneByIds')
    @Permission('user')
    async getSceneByIds(req, body: { ids: [string] }) {
        const { data } = await this.sceneServiceInterface.getSceneByIds(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createScene')
    @Permission('editor')
    async createScene(req, body: { name: string }) {
        const { data } = await this.sceneServiceInterface.createScene(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateScene')
    @Permission('editor')
    async updateScene(req, body: { id: string, name: string }) {
        const { data } = await this.sceneServiceInterface.updateScene(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteScene')
    @Permission('editor')
    async deleteScene(req, body: { id: string }) {
        const { data } = await this.sceneServiceInterface.deleteScene(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createWander')
    @Permission('editor')
    async createWander(req, body) {
        const { data } = await this.wanderServiceInterface.createWander(body.data).toPromise();
        this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateWander')
    @Permission('editor')
    async updateWander(req, body) {
        body.data.id = body.id;
        const { data } = await this.wanderServiceInterface.updateWander(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteWander')
    @Permission('editor')
    async deleteWander(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.deleteWander(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedWander')
    @Permission('editor')
    async revertDeletedWander(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.revertDeletedWander(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteWander')
    @Permission('user')
    async favoriteWander(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.favoriteWander({
            userId: context.user.id,
            wanderId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderRecord')
    @Permission('editor')
    async searchWanderRecord(req, body, context) {
        const { data } = await this.wanderServiceInterface.searchWanderRecord({
            userId: context.user.id,
            page: body.page,
            limit: body.limit,
            sort: body.sort,
            favorite: body.favorite,
            boughtTime: body.boughtTime
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchWander')
    @Permission('editor')
    async searchWander(req, body: { keyword: string }) {
        const { data } = await this.wanderServiceInterface.searchWander({ keyword: body.keyword }).toPromise();
        this.resourceCache.updateResourceCache(data, 'wander');
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyWander')
    @Permission('user')
    async buyWander(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.getWanderById({ id: body.id }).toPromise();
        try {
            await this.userServiceInterface.changeBalance({
                id: context.user.id,
                changeValue: -1 * data.price,
                type: 'wander',
                extraInfo: JSON.stringify(data)
            }).toPromise();
        } catch (e) {
            return { code: e.code, message: e.details };
        }
        try {
            const { data } = await this.wanderServiceInterface.buyWander({
                userId: context.user.id,
                wanderId: body.id
            }).toPromise();
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userServiceInterface.changeBalance({
                id: context.user.id,
                changeValue: data.price,
                type: 'wanderRollback',
                extraInfo: JSON.stringify(data)
            }).toPromise();
            return { code: e.code, message: e.details };
        }
    }

    @Mutation('startWander')
    @Permission('user')
    async startWander(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.startWander({
            userId: context.user.id,
            wanderId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishWander')
    @Permission('user')
    async finishWander(req, body: { id: string, duration: number }, context) {
        const { data } = await this.wanderServiceInterface.finishWander({
            userId: context.user.id,
            wanderId: body.id,
            duration: body.duration
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createWanderAlbum')
    @Permission('editor')
    async createWanderAlbum(req, body) {
        const { data } = await this.wanderServiceInterface.createWanderAlbum(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateWanderAlbum')
    @Permission('editor')
    async updateWanderAlbum(req, body) {
        body.data.id = body.id;
        const { data } = await this.wanderServiceInterface.updateWanderAlbum(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteWanderAlbum')
    @Permission('editor')
    async deleteWanderAlbum(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.deleteWanderAlbum(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedWanderAlbum')
    @Permission('editor')
    async revertDeletedWanderAlbum(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.revertDeletedWanderAlbum(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteWanderAlbum')
    @Permission('user')
    async favoriteWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.favoriteWanderAlbum({
            userId: context.user.id,
            wanderAlbumId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderAlbumRecord')
    @Permission('editor')
    async searchWanderAlbumRecord(req, body, context) {
        const { data } = await this.wanderServiceInterface.searchWanderAlbumRecord({
            userId: context.user.id,
            page: body.page,
            limit: body.limit,
            sort: body.sort,
            favorite: body.favorite,
            boughtTime: body.boughtTime
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderAlbum')
    @Permission('editor')
    async searchWanderAlbum(req, body: { keyword: string }) {
        const { data } = await this.wanderServiceInterface.searchWanderAlbum({ keyword: body.keyword }).toPromise();
        this.resourceCache.updateResourceCache(data, 'wanderAlbum');
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyWanderAlbum')
    @Permission('user')
    async buyWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.getWanderAlbumById({ id: body.id }).toPromise();
        try {
            await this.userServiceInterface.changeBalance({
                id: context.user.id,
                changeValue: -1 * data.price,
                type: 'wanderAlbum',
                extraInfo: JSON.stringify(data)
            }).toPromise();
        } catch (e) {
            return { code: e.code, message: e.details };
        }
        try {
            const { data } = await this.wanderServiceInterface.buyWanderAlbum({
                userId: context.user.id,
                wanderAlbumId: body.id
            }).toPromise();
            return { code: 200, message: 'success', data };
        } catch (e) {
            await this.userServiceInterface.changeBalance({
                id: context.user.id,
                changeValue: data.price,
                type: 'wanderAlbumRollback',
                extraInfo: JSON.stringify(data)
            }).toPromise();
            return { code: e.code, message: e.details };
        }
    }

    @Mutation('startWanderAlbum')
    @Permission('user')
    async startWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.startWanderAlbum({
            userId: context.user.id,
            wanderAlbumId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishWanderAlbum')
    @Permission('user')
    async finishWanderAlbum(req, body: { id: string, duration: number }, context) {
        const { data } = await this.wanderServiceInterface.finishWanderAlbum({
            userId: context.user.id,
            wanderAlbumId: body.id,
            duration: body.duration
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getHome')
    @Permission('user')
    async getHome(req, body: { first: number, after?: string }) {
        const { data } = await this.homeServiceInterface.getHome(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getHomeById')
    @Permission('user')
    async getHomeById(req, body: { id: string }) {
        const { data } = await this.homeServiceInterface.getHomeById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createHome')
    @Permission('editor')
    async createHome(req, body) {
        const { data } = await this.homeServiceInterface.createHome(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateHome')
    @Permission('editor')
    async updateHome(req, body) {
        body.data.id = body.id;
        const { data } = await this.homeServiceInterface.updateHome(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteHome')
    @Permission('editor')
    async deleteHome(req, body: { id: string }) {
        const { data } = await this.homeServiceInterface.deleteHome(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getNew')
    @Permission('user')
    async getNew(req, body: { first: number, after?: string }) {
        // const mindfulnessResponse = await this.mindfulnessServiceInterface.getMindfulness(body).toPromise();
        // const natureResponse = await this.natureServiceInterface.getNature(body).toPromise();
        // const wanderResponse = await this.wanderServiceInterface.getWander(body).toPromise();
        // const wanderAlbumResponse = await this.wanderServiceInterface.getWanderAlbum(body).toPromise();
        const data = this.resourceCache.getResourceByCreateTime(body.first, body.after).map((resource) => {
            return {
                resourceId: resource.id,
                type: resource.type,
                name: resource.name,
                description: resource.description,
                background: resource.background,
                price: resource.price,
                author: resource.author,
                createTime: resource.createTime,
                updateTime: resource.updateTime
            };
        });
        return { code: 200, message: 'success', data };
    }
}
