import { HttpException, Inject, UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { __ as t } from 'i18n';

import { Permission, Resource } from '../../../common/decorators';
import { CommonResult } from '../../../common/interfaces';
import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';
import { AuthGuard } from '../auth/auth.guard';

@Resolver()
@UseGuards(AuthGuard)
// @Resource({ name: 'user_manage', identify: 'user:manage' })
export class UserResolver {
    onModuleInit() {
        this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
    }

    constructor(
        @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory
    ) { }

    private userServiceInterface;

    @Query('loginBySMSCode')
    async loginBySMSCode(req, body: { mobile: string, verificationCode: string }): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.loginBySMSCode(body).toPromise();
        return { code: 200, message: 'success', data: data.tokenInfo };
    }

    @Query('loginByMobileAndPassword')
    async loginByMobileAndPassword(req, body: { mobile: string, password: string }): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.loginByMobileAndPassword(body).toPromise();
        return { code: 200, message: 'success', data: data.tokenInfo };
    }

    // @Query('adminLogin')
    // async adminLogin(req, body: { username: string, password: string }): Promise<CommonResult> {
    //     const { code, message, data } = await this.userServiceInterface.login(body).toPromise();
    //     const userInfoData = data.userInfoData;
    //     if (userInfoData.username !== 'sadmin' && userInfoData.userRoles.map(v => v.id).includes(1)) {
    //         throw new HttpException(t('You are not authorized to access'), 401);
    //     }
    //     return { code, message, data: data.tokenInfo };
    // }

    @Mutation('registerBySMSCode')
    async registerBySMSCode(req, { registerUserInput, verificationCode }): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.registerBySMSCode({ registerUserInput, verificationCode }).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('sendLoginVerificationCode')
    async sendLoginVerificationCode(req, body): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.getLoginVerificationCode(body).toPromise();
        return { code: 200, message: 'success' };
    }
    // Its%queOress2
    @Query('sendRegisterVerificationCode')
    async sendRegisterVerificationCode(req, body): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.getRegisterVerificationCode(body).toPromise();
        return { code: 200, message: 'success' };
    }

    // @Mutation('createUser')
    // @Permission({ name: 'create_user', identify: 'user:createUser', action: 'create' })
    // async createUser(req, body): Promise<CommonResult> {
    //     return this.userServiceInterface.createUser(body).toPromise();
    // }

    // @Mutation('updateUserById')
    // async updateUserById(req, body): Promise<CommonResult> {
    //     return this.userServiceInterface.updateUserById(body).toPromise();
    // }

    @Mutation('updateCurrentUser')
    @Permission('user')
    async updateCurrentUser(req, body, context): Promise<CommonResult> {
        body.updateCurrentUserInput.id = context.user.id;
        const { data } = await this.userServiceInterface.updateUserById(body.updateCurrentUserInput).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateUserById')
    @Permission('user')
    async updateUserById(req, body, context): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.updateUserById(body.updateUserInput).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getCurrentUser')
    @Permission('user')
    async getCurrentUser(req, body, context): Promise<CommonResult> {
        if (context.user) {
            return { code: 200, message: 'userInfo from context', data: context.user };
        } else {
            return { code: 401, message: 'no userInfo in context', data: {} };
        }
        // return await this.userServiceInterface.updateCurrentUser({ userId: context.user.id }).toPromise();
    }

    @Query('getUserById')
    @Permission('user')
    async getUserById(req, body, context): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.getUserById(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getUserByMobile')
    @Permission('user')
    async getUserByMobile(req, body, context): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.getUserByMobile(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('getUser')
    @Permission('user')
    async getUser(req, body, context): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.getUser(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchUserAccount')
    @Permission('admin')
    async searchUserAccount(req, body, context): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.searchUserAccount(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('countUserAccount')
    @Permission('admin')
    async countUserAccount(req, body, context): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.countUserAccount(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Query('searchUser')
    @Permission('admin')
    async searchUser(req, body, context): Promise<CommonResult> {
        const { total, data } = await this.userServiceInterface.searchUser(body).toPromise();
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Query('countUser')
    @Permission('admin')
    async countUser(req, body, context): Promise<CommonResult> {
        const { data } = await this.userServiceInterface.countUser(body).toPromise();
        return { code: 200, message: 'success', data };
    }

    @Mutation('changeBalanceByAdmin')
    @Permission('admin')
    async changeBalanceByAdmin(req, body: { userId: string, changeValue: number, extraInfo: string }, context) {
        const { data } = await this.userServiceInterface.changeBalance({
            id: body.userId,
            changeValue: body.changeValue,
            type: 'changeByAdmin',
            extraInfo: JSON.stringify({ operatorId: context.user.id, operatorExtraInfo: body.extraInfo })
        }).toPromise();
        console.log(data);
        return { code: 200, message: 'success', data };
    }
}
