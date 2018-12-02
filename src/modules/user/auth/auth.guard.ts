import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { PERMISSION_DEFINITION } from '../../../common/decorators';

export const ROLE_MAP = {
    sadmin: 0b0001,
    admin:  0b0010,
    editor: 0b0100,
    anony:  0b1000,
};

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlCtx = GqlExecutionContext.create(context);
        const user = gqlCtx.getContext().user;
        const handlerPerm = Reflect.getMetadata(PERMISSION_DEFINITION, context.getClass().prototype, context.getHandler().name);
        if (handlerPerm) {
            if (handlerPerm === 'anony') {
                return true;
            } else {
                return !!(user.role & ROLE_MAP[handlerPerm]);
            }
        } else {
            // 没有权限设置的谁都可以访问
            return true;
        }
        // if (user && user.username === 'sadmin') return true;
        //
        // const userPerm: string[] = [];
        // user && user.roles.length && user.roles.forEach(role => {
        //     role.permissions && role.permission.length && role.permissions.forEach(permission => {
        //         userPerm.push(permission.identify);
        //     });
        // });
        // if (handlerPerm && !userPerm.includes(handlerPerm.identify)) {
        //     return false;
        // }
        // return true;
    }
}
