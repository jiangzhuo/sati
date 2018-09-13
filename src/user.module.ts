import { DynamicModule, Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { InjectEntityManager, InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { __ as t, configure as i18nConfigure } from 'i18n';
import { EntityManager, In, Not, Repository } from 'typeorm';

import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { User } from './entities/user.entity';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { CryptoUtil } from './utils/crypto.util';
import { NotaddGrpcClientFactory } from './grpc/grpc.client-factory';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
        AuthService,
        UserResolver, UserService,
        CryptoUtil,
        NotaddGrpcClientFactory,
    ],
    exports: [AuthService, UserService]
})
export class UserModule implements OnModuleInit {
    private readonly metadataScanner: MetadataScanner;

    constructor(
        @Inject(UserService) private readonly userService: UserService,
        @Inject(ModulesContainer) private readonly modulesContainer: ModulesContainer,
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(User) private readonly userRepo: Repository<User>
    ) {
        this.metadataScanner = new MetadataScanner();
    }

    static forRoot(options: { i18n: 'en-US' | 'zh-CN' }): DynamicModule {
        i18nConfigure({
            locales: ['en-US', 'zh-CN'],
            defaultLocale: options.i18n,
            directory: __dirname + '/i18n'
        });
        return {
            module: UserModule
        };
    }

    async onModuleInit() {
        // await this.loadResourcesAndPermissions();
        // await this.createDefaultRole();
        // await this.createDefaultInfoGroup();
        // await this.createSuperAdmin();
    }
}
