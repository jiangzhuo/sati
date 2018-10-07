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
    }

    constructor(
        @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory
    ) { }

    private mindfulnessServiceInterface;
    private natureServiceInterface;
    private wanderServiceInterface;
    private sceneServiceInterface;

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
    async getMindfulness(req, body: { take: number, after?: string }) {
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

    @Mutation('favoriteMindfulness')
    async favoriteMindfulness(req, body: { id: string }, context) {
        const { data } = await this.mindfulnessServiceInterface.favoriteMindfulness({
            userId: context.user.id,
            mindfulnessId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
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

    @Query('getNature')
    async getNature(req, body: { take: number, after?: string }) {
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

    @Mutation('favoriteNature')
    async favoriteNature(req, body: { id: string }, context) {
        const { data } = await this.natureServiceInterface.favoriteNature({
            userId: context.user.id,
            natureId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
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
    async getWander(req, body: { take: number, after?: string }) {
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
    async getWanderAlbum(req, body: { take: number, after?: string }) {
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
    async getScene(req, body: { take: number, after?: string }) {
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

    @Mutation('favoriteWander')
    async favoriteWander(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.favoriteWander({
            userId: context.user.id,
            wanderId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
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

    @Mutation('favoriteWanderAlbum')
    async favoriteWanderAlbum(req, body: { id: string }, context) {
        const { data } = await this.wanderServiceInterface.favoriteWanderAlbum({
            userId: context.user.id,
            wanderAlbumId: body.id
        }).toPromise();
        return { code: 200, message: 'success', data };
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
}
