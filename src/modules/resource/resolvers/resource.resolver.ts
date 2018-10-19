import { HttpException, Inject, UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { __ as t } from 'i18n';

// import { Permission, Resource } from '../../../common/decorators';
import { CommonResult } from '../../../common/interfaces';
import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';
import { AuthGuard } from '../auth/auth.guard';

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
        @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory
    ) { }

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
    async getMindfulness(req, body: { first: number, after?: string }) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulness(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessById')
    async getMindfulnessById(req, body: { id: string }) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulnessById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessByIds')
    async getMindfulnessByIds(req, body: { ids: [string] }) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulnessByIds(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getMindfulnessRecordByMindfulnessId')
    async getMindfulnessRecordByMindfulnessId(req, body: { mindfulnessId: string }, context) {
        const { data } = await this.mindfulnessServiceInterface.getMindfulnessRecordByMindfulnessId({
            userId: context.user.id,
            mindfulnessId: body.mindfulnessId
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchMindfulnessRecord')
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
    async favoriteMindfulness(req, body: { id: string }, context) {
        const { data } = await this.mindfulnessServiceInterface.favoriteMindfulness({
            userId: context.user.id,
            mindfulnessId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchMindfulness')
    async searchMindfulness(req, body: { keyword: string }) {
        const { data } = await this.mindfulnessServiceInterface.searchMindfulness({ keyword: body.keyword }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyMindfulness')
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
    async startMindfulness(req, body: { id: string }, context) {
        const { data } = await this.mindfulnessServiceInterface.startMindfulness({
            userId: context.user.id,
            mindfulnessId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishMindfulness')
    async finishMindfulness(req, body: { id: string, duration: number }, context) {
        const { data } = await this.mindfulnessServiceInterface.finishMindfulness({
            userId: context.user.id,
            mindfulnessId: body.id,
            duration: body.duration
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createMindfulness')
    async createMindfulness(req, body) {
        const { data } = await this.mindfulnessServiceInterface.createMindfulness(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateMindfulness')
    async updateMindfulness(req, body) {
        body.data.id = body.id;
        const { data } = await this.mindfulnessServiceInterface.updateMindfulness(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteMindfulness')
    async deleteMindfulness(req, body: { id: string }) {
        const { data } = await this.mindfulnessServiceInterface.deleteMindfulness(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedMindfulness')
    async revertDeletedMindfulness(req, body: { id: string }) {
        const { data } = await this.mindfulnessServiceInterface.revertDeletedMindfulness(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getNature')
    async getNature(req, body: { first: number, after?: string }) {
        const { data } = await this.natureServiceInterface.getNature(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureById')
    async getNatureById(req, body: { id: string }) {
        const { data } = await this.natureServiceInterface.getNatureById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureByIds')
    async getNatureByIds(req, body: { ids: [string] }) {
        const { data } = await this.natureServiceInterface.getNatureByIds(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getNatureRecordByNatureId')
    async getNatureRecordByNatureId(req, body: { natureId: string }, context) {
        const { data } = await this.natureServiceInterface.getNatureRecordByNatureId({
            userId: context.user.id,
            natureId: body.natureId
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createNature')
    async createNature(req, body) {
        const { data } = await this.natureServiceInterface.createNature(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateNature')
    async updateNature(req, body) {
        body.data.id = body.id;
        const { data } = await this.natureServiceInterface.updateNature(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteNature')
    async deleteNature(req, body: { id: string }) {
        const { data } = await this.natureServiceInterface.deleteNature(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedNature')
    async revertDeletedNature(req, body: { id: string }) {
        const { data } = await this.natureServiceInterface.revertDeletedNature(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteNature')
    async favoriteNature(req, body: { id: string }, context) {
        const { data } = await this.natureServiceInterface.favoriteNature({
            userId: context.user.id,
            natureId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchNatureRecord')
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
    async searchNature(req, body: { keyword: string }) {
        const { data } = await this.natureServiceInterface.searchNature({ keyword: body.keyword }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyNature')
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
    async startNature(req, body: { id: string }, context) {
        const { data } = await this.natureServiceInterface.startNature({
            userId: context.user.id,
            natureId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishNature')
    async finishNature(req, body: { id: string, duration: number }, context) {
        const { data } = await this.natureServiceInterface.finishNature({
            userId: context.user.id,
            natureId: body.id,
            duration: body.duration
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWander')
    async getWander(req, body: { first: number, after?: string }) {
        const { data } = await this.wanderServiceInterface.getWander(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderById')
    async getWanderById(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.getWanderById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderByIds')
    async getWanderByIds(req, body: { ids: [string] }) {
        const { data } = await this.wanderServiceInterface.getWanderByIds(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderRecordByWanderId')
    async getWanderRecordByWanderId(req, body: { wanderId: string }, context) {
        const { data } = await this.wanderServiceInterface.getWanderRecordByWanderId({
            userId: context.user.id,
            wanderId: body.wanderId
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbum')
    async getWanderAlbum(req, body: { first: number, after?: string }) {
        const { data } = await this.wanderServiceInterface.getWanderAlbum(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumById')
    async getWanderAlbumById(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.getWanderAlbumById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumByIds')
    async getWanderAlbumByIds(req, body: { ids: [string] }) {
        const { data } = await this.wanderServiceInterface.getWanderAlbumByIds(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderAlbumRecordByWanderAlbumId')
    async getWanderAlbumRecordByWanderAlbumId(req, body: { wanderAlbumId: string }, context) {
        const { data } = await this.wanderServiceInterface.getWanderAlbumRecordByWanderAlbumId({
            userId: context.user.id,
            wanderAlbumId: body.wanderAlbumId
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getWanderByWanderAlbumId')
    async getWanderByWanderAlbumId(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.getWanderByWanderAlbumId(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getScene')
    async getScene(req, body: { first: number, after?: string }) {
        const { data } = await this.sceneServiceInterface.getScene(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getSceneById')
    async getSceneById(req, body: { id: string }) {
        const { data } = await this.sceneServiceInterface.getSceneById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getSceneByIds')
    async getSceneByIds(req, body: { ids: [string] }) {
        const { data } = await this.sceneServiceInterface.getSceneByIds(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createScene')
    async createScene(req, body: { name: string }) {
        const { data } = await this.sceneServiceInterface.createScene(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateScene')
    async updateScene(req, body: { id: string, name: string }) {
        const { data } = await this.sceneServiceInterface.updateScene(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteScene')
    async deleteScene(req, body: { id: string }) {
        const { data } = await this.sceneServiceInterface.deleteScene(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createWander')
    async createWander(req, body) {
        const { data } = await this.wanderServiceInterface.createWander(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateWander')
    async updateWander(req, body) {
        body.data.id = body.id;
        const { data } = await this.wanderServiceInterface.updateWander(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteWander')
    async deleteWander(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.deleteWander(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedWander')
    async revertDeletedWander(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.revertDeletedWander(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteWander')
    async favoriteWander(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.favoriteWander({
            userId: context.user.id,
            wanderId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderRecord')
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
    async searchWander(req, body: { keyword: string }) {
        const { data } = await this.wanderServiceInterface.searchWander({ keyword: body.keyword }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyWander')
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
    async startWander(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.startWander({
            userId: context.user.id,
            wanderId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishWander')
    async finishWander(req, body: { id: string, duration: number }, context) {
        const { data } = await this.wanderServiceInterface.finishWander({
            userId: context.user.id,
            wanderId: body.id,
            duration: body.duration
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createWanderAlbum')
    async createWanderAlbum(req, body) {
        const { data } = await this.wanderServiceInterface.createWanderAlbum(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateWanderAlbum')
    async updateWanderAlbum(req, body) {
        body.data.id = body.id;
        const { data } = await this.wanderServiceInterface.updateWanderAlbum(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteWanderAlbum')
    async deleteWanderAlbum(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.deleteWanderAlbum(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('revertDeletedWanderAlbum')
    async revertDeletedWanderAlbum(req, body: { id: string }) {
        const { data } = await this.wanderServiceInterface.revertDeletedWanderAlbum(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('favoriteWanderAlbum')
    async favoriteWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.favoriteWanderAlbum({
            userId: context.user.id,
            wanderAlbumId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchWanderAlbumRecord')
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
    async searchWanderAlbum(req, body: { keyword: string }) {
        const { data } = await this.wanderServiceInterface.searchWanderAlbum({ keyword: body.keyword }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('buyWanderAlbum')
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
    async startWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.startWanderAlbum({
            userId: context.user.id,
            wanderAlbumId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('finishWanderAlbum')
    async finishWanderAlbum(req, body: { id: string, duration: number }, context) {
        const { data } = await this.wanderServiceInterface.finishWanderAlbum({
            userId: context.user.id,
            wanderAlbumId: body.id,
            duration: body.duration
        }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getHome')
    async getHome(req, body: { first: number, after?: string }) {
        const { data } = await this.homeServiceInterface.getHome(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getHomeById')
    async getHomeById(req, body: { id: string }) {
        const { data } = await this.homeServiceInterface.getHomeById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('createHome')
    async createHome(req, body) {
        const { data } = await this.homeServiceInterface.createHome(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateHome')
    async updateHome(req, body) {
        body.data.id = body.id;
        const { data } = await this.homeServiceInterface.updateHome(body.data).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteHome')
    async deleteHome(req, body: { id: string }) {
        const { data } = await this.homeServiceInterface.deleteHome(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    // @Query('getNew')
    // async getNew(req, body: { first: number, after?: string }) {
    //     const mindfulnessResponse = await this.mindfulnessServiceInterface.getMindfulness(body).toPromise();
    //     const natureResponse = await this.natureServiceInterface.getNature(body).toPromise();
    //     const wanderResponse = await this.wanderServiceInterface.getWander(body).toPromise();
    //     const wanderAlbumResponse = await this.wanderServiceInterface.getWanderAlbum(body).toPromise();
    //     return { code: 200, message: 'success', data };
    // }
}
