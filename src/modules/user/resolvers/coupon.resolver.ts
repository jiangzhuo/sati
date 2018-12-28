import { UseGuards, UseInterceptors } from '@nestjs/common';
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

    @Query('getCoupon')
    async getCoupon(req, body, context) {
        const { data } = await this.userBroker.call('coupon.getCoupon', body,
            {
                meta: {
                    userId: context.user.id,
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            });
        return { code: 200, message: 'success', data };
    }

    @Mutation('generateCoupon')
    @Permission('admin')
    async generateCoupon(req, body, context) {
        const { data } = await this.userBroker.call('coupon.generateCoupon',
            body,
            {
                meta: {
                    userId: context.user.id,
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            },
        );
        return { code: 200, message: 'success', data };
    }

    @Mutation('useCoupon')
    @Permission('user')
    async useCoupon(req, body, context) {
        const { data } = await this.userBroker.call('coupon.useCoupon',
            body,
            {
                meta: {
                    userId: context.user.id,
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            },
        );
        return { code: 200, message: 'success', data };
    }

    @Mutation('disableCoupon')
    @Permission('admin')
    async disableCoupon(req, body, context) {
        const { data } = await this.userBroker.call('coupon.disableCoupon',
            body,
            {
                meta: {
                    userId: context.user.id,
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            },
        );
        return { code: 200, message: 'success', data };
    }

    @Mutation('enableCoupon')
    @Permission('admin')
    async enableCoupon(req, body, context) {
        const { data } = await this.userBroker.call('coupon.enableCoupon',
            body,
            {
                meta: {
                    userId: context.user.id,
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            },
        );
        return { code: 200, message: 'success', data };
    }
}
