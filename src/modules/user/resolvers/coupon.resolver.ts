import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { Permission, Resource } from '../../../common/decorators';
import { CommonResult } from '../../../common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { ServiceBroker } from 'moleculer';
import { InjectBroker } from 'nestjs-moleculer';
import { ErrorsInterceptor, LoggingInterceptor } from '../../../common/interceptors';

@Resolver()
@UseGuards(AuthGuard)
// @Resource({ name: 'user_manage', identify: 'user:manage' })
@UseInterceptors(ErrorsInterceptor)
@UseInterceptors(LoggingInterceptor)
export class CouponResolver {
    onModuleInit() {
        // this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
    }

    constructor(
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    private logger = new Logger('coupon');

    @Query('getCoupon')
    async getCoupon(req, body, context) {
        const { data } = await this.userBroker.call('coupon.getCoupon', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('generateCoupon')
    @Permission('admin')
    async generateCoupon(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('coupon.generateCoupon', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('useCoupon')
    @Permission('user')
    async useCoupon(req, body, context) {
        const { data } = await this.userBroker.call('coupon.useCoupon', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('disableCoupon')
    @Permission('admin')
    async disableCoupon(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('coupon.disableCoupon', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('enableCoupon')
    @Permission('admin')
    async enableCoupon(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('coupon.enableCoupon', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }
}
