import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { CommonResult } from '../../../common/interfaces';
import { AuthGuard } from '../../user/auth/auth.guard';
import { ServiceBroker } from 'moleculer';
import { InjectBroker } from 'nestjs-moleculer';
import { ErrorsInterceptor, LoggingInterceptor } from '../../../common/interceptors';

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

    private logger = new Logger('stat');

    @Query('loginBySMSCode')
    async loginBySMSCode(req, body: { mobile: string, verificationCode: string }, context, resolveInfo): Promise<CommonResult> {
        const { data } = await this.userBroker.call('stat.loginBySMSCode', body,
            {
                meta: {
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            });
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${body && body.mobile}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data: data.tokenInfo };
    }
}
