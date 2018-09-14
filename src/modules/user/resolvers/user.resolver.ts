import { HttpException, Inject } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { __ as t } from 'i18n';

// import { Permission, Resource } from '../../../common/decorators';
import { CommonResult } from '../../../common/interfaces';
import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';

@Resolver()
// @Resource({ name: 'user_manage', identify: 'user:manage' })
export class UserResolver {
    onModuleInit() {
        this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
    }

    constructor(
        @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory
    ) { }

    private userServiceInterface;

    @Query('loginByMobile')
    async loginByMobile(req, body: { mobile: string, verificationCode: string }): Promise<CommonResult> {
        const { code, message, data } = await this.userServiceInterface.loginByMobile(body).toPromise();
        return { code, message, data: data.tokenInfo };
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

    @Mutation('registerByMobile')
    async registerByMobile(req, { registerUserInput }): Promise<CommonResult> {
        return this.userServiceInterface.registerByMobile({ registerUserInput }).toPromise();
    }

    @Query('sendLoginVerificationCode')
    async sendLoginVerificationCode(req, { mobile }): Promise<CommonResult> {
        return this.userServiceInterface.getLoginVerificationCode(mobile).toPromise();
    }

    @Query('sendRegisterVerificationCode')
    async sendRegisterVerificationCode(req, { mobile }): Promise<CommonResult> {
        return this.userServiceInterface.getRegisterVerificationCode(mobile).toPromise();
    }

    // @Mutation('createUser')
    // @Permission({ name: 'create_user', identify: 'user:createUser', action: 'create' })
    // async createUser(req, body): Promise<CommonResult> {
    //     return this.userServiceInterface.createUser(body).toPromise();
    // }

    // @Mutation('updateUserInfoById')
    // async updateUserInfoById(req, body): Promise<CommonResult> {
    //     return this.userServiceInterface.updateUserInfoById(body).toPromise();
    // }

    @Mutation('updateCurrentUserInfo')
    async updateCurrentUserInfo(req, body, context): Promise<CommonResult> {
        body.userId = context.user.id;
        return this.userServiceInterface.updateCurrentUserInfo(body).toPromise();
    }

    // @Query('findUserInfoByIds')
    // @Permission({ name: 'find_user_info_by_ids', identify: 'user:findUserInfoByIds', action: 'find' })
    // async findUserInfoByIds(req, body: { userIds: number[] }): Promise<CommonResult> {
    //     return await this.userServiceInterface.findUserInfoByIds(body).toPromise();
    // }

    @Query('findCurrentUserInfo')
    async findCurrentUserInfo(req, body, context): Promise<CommonResult> {
        return this.userServiceInterface.findCurrentUserInfo({ userId: context.user.id }).toPromise();
    }
}
