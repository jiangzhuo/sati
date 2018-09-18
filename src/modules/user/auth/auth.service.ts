import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { __ as t } from 'i18n';
import * as jwt from 'jsonwebtoken';

import { Permission, Resource } from '../../../common/interfaces';
import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';

@Injectable()
export class AuthService implements OnModuleInit {
    onModuleInit() {
        this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
    }

    constructor(
        @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory
    ) { }

    private userServiceInterface;

    async validateUser(req: any) {
        /**
         * whitelist
         */
        const whiteList = ['IntrospectionQuery', 'upload', 'sayHello', 'loginBySMSCode', 'loginByMobileAndPassword',
            'sendRegisterVerificationCode', 'sendLoginVerificationCode', 'registerBySMSCode'];
        if (req.body && whiteList.includes(req.body.operationName)) {
            return;
        }

        let token = req.headers.authorization as string;
        if (!token) {
            throw new AuthenticationError(t('Request header lacks authorization parameters，it should be: Authorization or authorization'));
        }

        if (['Bearer ', 'bearer '].includes(token.slice(0, 7))) {
            token = token.slice(7);
        } else {
            throw new AuthenticationError(t('The authorization code prefix is incorrect. it should be: Bearer or bearer'));
        }

        try {
            const decodedToken = <{ userId: string }>jwt.verify(token, 'secretKey');
            const { data } = await this.userServiceInterface.findUserInfoById({ userId: decodedToken.userId }).toPromise();
            return data;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthenticationError(t('The authorization code is incorrect'));
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthenticationError(t('The authorization code has expired'));
            }
        }
    }
}
