import 'reflect-metadata';

import { DynamicModule, Global, UseGuards, Inject, Module, OnModuleInit } from '@nestjs/common';
// import { PATH_METADATA } from '@nestjs/common/constants';
import { APP_GUARD } from '@nestjs/core';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
// import { RESOLVER_TYPE_METADATA } from '@nestjs/graphql/dist/graphql.constants';
// import { __ as t, configure as i18nConfigure } from 'i18n';

// import { PERMISSION_DEFINITION, RESOURCE_DEFINITION } from '../../common/decorators';
// import { Permission, Resource } from '../../common/interfaces';
// import { NotaddGrpcClientFactory } from '../../grpc/grpc.client-factory';
import { AuthService } from './auth/auth.service';
import { UserResolver } from './resolvers/user.resolver';
import { MoleculerModule } from 'nestjs-moleculer';

// @Global()
@Module({
    imports: [
        MoleculerModule.forRoot({
            namespace: 'sati',
            // logger: bindings => new Logger(),
            transporter: 'TCP'
        })],
    providers: [
        AuthService,
        UserResolver,
    ],
    exports: [AuthService],
})
export class UserModule implements OnModuleInit {
    private readonly metadataScanner: MetadataScanner;

    constructor(
        @Inject(ModulesContainer) private readonly modulesContainer: ModulesContainer,
        @Inject(AuthService) private readonly authService: AuthService,
    ) {
        this.metadataScanner = new MetadataScanner();
    }

    static forRoot(): DynamicModule {
        return {
            module: UserModule,
        };
    }

    async onModuleInit() {
        // await this.authService.saveResourcesAndPermissions(this.scanResourcesAndPermissions());
    }

    // private scanResourcesAndPermissions() {
    //     const metadataMap: Map<string, { resource: Resource, permissions: Permission[] }> = new Map();
    //     this.modulesContainer.forEach(module => {
    //         module.components.forEach(component => {
    //             const isResolverOrController =
    //                 Reflect.getMetadataKeys(component.instance.constructor)
    //                     .filter(key => [RESOLVER_TYPE_METADATA, PATH_METADATA]
    //                         .includes(key)).length > 0;
    //
    //             if (isResolverOrController) {
    //                 const resource: Resource = Reflect.getMetadata(RESOURCE_DEFINITION, component.instance.constructor);
    //                 const prototype = Object.getPrototypeOf(component.instance);
    //
    //                 if (prototype) {
    //                     const permissions: Permission[] = this.metadataScanner.scanFromPrototype(component.instance, prototype, name => {
    //                         return Reflect.getMetadata(PERMISSION_DEFINITION, component.instance, name);
    //                     });
    //
    //                     if (resource) {
    //                         resource.name = t(resource.name);
    //                         permissions.forEach(permission => {
    //                             permission.name = t(permission.name);
    //                         });
    //                         metadataMap.set(resource.identify, { resource, permissions });
    //                     }
    //                 }
    //             }
    //         });
    //     });
    //     return metadataMap;
    // }
}
