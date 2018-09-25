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

    @Query('getWanderAlbum')
    async getWanderAlbum(req, body: { take: number, after?: string }) {
        const { data } = await this.wanderServiceInterface.getWander(body).toPromise();
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
}
