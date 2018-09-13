import { Inject } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { __ as t } from 'i18n';

import { CommonResult } from '../interfaces/common-result.interface';
import { CreateUserInput, UpdateUserInput, UserInfoData } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Resolver()
export class UserResolver {
    constructor(
        @Inject(UserService) private readonly userService: UserService
    ) { }

    @Query('login')
    async login(req, body: { mobile: string, password: string }): Promise<CommonResult> {
        const data = await this.userService.login(body.mobile, body.password);
        return { code: 200, message: t('Login success'), data };
    }

    @Mutation('register')
    async register(req, body: { registerUserInput: CreateUserInput }): Promise<CommonResult> {
        await this.userService.register(body.registerUserInput);
        return { code: 200, message: t('Registration success') };
    }

    @Mutation('createUser')
    async createUser(req, body: { createUserInput: CreateUserInput }): Promise<CommonResult> {
        await this.userService.createUser(body.createUserInput);
        return { code: 200, message: t('Create user successfully') };
    }

    @Mutation('updateCurrentUserInfo')
    async updateCurrentUserInfo(req, body: { updateCurrentUserInput: UpdateUserInput }, context): Promise<CommonResult> {
        await this.userService.updateUserInfo(context.user.id, body.updateCurrentUserInput);
        return { code: 200, message: t('Update current login user information successfully') };
    }

    @Query('findCurrentUserInfo')
    async findCurrentUserInfo(req, body, context): Promise<CommonResult> {
        const data = await this.userService.findUserInfoById(context.user.id) as UserInfoData;
        return { code: 200, message: t('Query the current login user information successfully'), data };
    }
}
