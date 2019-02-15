import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../../user/auth/auth.guard';
import { ServiceBroker } from 'moleculer';
import { InjectBroker } from 'nestjs-moleculer';
import { ErrorsInterceptor, LoggingInterceptor } from '../../../common/interceptors';
import { Permission } from '../../../common/decorators';

@Resolver()
@UseGuards(AuthGuard)
@UseInterceptors(ErrorsInterceptor)
@UseInterceptors(LoggingInterceptor)
export class StatsResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    private logger = new Logger('stats');

    @Query('helloStat')
    async helloStat() {
        return { code: 200, message: 'success' };
    }

    @Query('loginCount')
    @Permission('admin')
    async loginCount(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('userStats.loginCount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('registerCount')
    @Permission('admin')
    async registerCount(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('userStats.registerCount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('verificationCodeCount')
    @Permission('admin')
    async verificationCodeCount(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('userStats.verificationCodeCount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('renewTokenCount')
    @Permission('admin')
    async renewTokenCount(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('userStats.renewTokenCount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('userCount')
    @Permission('admin')
    async userCount(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('userStats.userCount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getOperation')
    @Permission('admin')
    async getOperation(req, body, context, resolveInfo) {
        const { data, total } = await this.userBroker.call('operation.getOperation', body);
        return { code: 200, message: 'success', data: { data, total } };
    }
}
