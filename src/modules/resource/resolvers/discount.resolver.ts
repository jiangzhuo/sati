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
export class DiscountResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    private logger = new Logger('discount');

    @Query('sayDiscountHello')
    async sayDiscountHello(req, body: { name: string }) {
        const { msg } = await this.resourceBroker.call('discount.sayHello', { name: body.name });
        return { code: 200, message: 'success', data: msg };
    }

    @Query('getDiscount')
    @Permission('anony')
    async getDiscount(req, body) {
        const { data } = await this.resourceBroker.call('discount.getDiscount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getFree')
    @Permission('anony')
    async getFree(req, body) {
        body.discount = 0;
        const { data } = await this.resourceBroker.call('discount.getDiscount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getDiscountByPageAndLimit')
    @Permission('editor')
    async getDiscountByPageAndLimit(req, body) {
        const { data } = await this.resourceBroker.call('discount.getDiscount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('countDiscount')
    @Permission('editor')
    async countDiscount(req, body) {
        const { data } = await this.resourceBroker.call('discount.countDiscount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getDiscountByIds')
    @Permission('anony')
    async getDiscountByIds(req, body: { ids: [string] }) {
        const { data } = await this.resourceBroker.call('discount.getDiscountByIds', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('createDiscount')
    @Permission('editor')
    async createDiscount(req, body, context, resolveInfo) {
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(body.data)}`);
        const { data } = await this.resourceBroker.call('discount.createDiscount', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateDiscount')
    @Permission('editor')
    async updateDiscount(req, body, context, resolveInfo) {
        body.data.id = body.id;
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(body.data)}`);
        const { data } = await this.resourceBroker.call('discount.updateDiscount', body.data);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deleteDiscount')
    @Permission('editor')
    async deleteDiscount(req, body, context, resolveInfo) {
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(body)}`);
        const { data } = await this.resourceBroker.call('discount.deleteDiscount', body);
        return { code: 200, message: 'success', data };
    }
}
