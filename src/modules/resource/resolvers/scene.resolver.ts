import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
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
export class SceneResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    private logger = new Logger('scene');

    @Query('saySceneHello')
    async saySceneHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('scene.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
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
    async createScene(req, body: { name: string }, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('scene.createScene', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateScene')
    @Permission('editor')
    async updateScene(req, body: { id: string, name: string }, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('scene.updateScene', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteScene')
    @Permission('editor')
    async deleteScene(req, body: { id: string }, context, resolveInfo) {
        const { data } = await this.resourceBroker.call('scene.deleteScene', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }
}
