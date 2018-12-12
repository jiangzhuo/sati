import { CacheModule, DynamicModule, Global, Module, OnModuleInit } from '@nestjs/common';
// import { PATH_METADATA } from '@nestjs/common/constants';
// import { PERMISSION_DEFINITION, RESOURCE_DEFINITION } from '../../common/decorators';
// import { Permission, Resource } from '../../common/interfaces';
// import { NotaddGrpcClientFactory } from '../../grpc/grpc.client-factory';
// import { ResourceResolver } from './resolvers/resource.resolver';
import { MoleculerModule } from 'nestjs-moleculer';
import { MindfulnessResolver } from './resolvers/mindfulness.resolver';
import { NatureResolver } from './resolvers/nature.resolver';
import { WanderResolver } from './resolvers/wander.resolver';
import { HomeResolver } from './resolvers/home.resolver';
import { SceneResolver } from './resolvers/scene.resolver';
import { MindfulnessAlbumResolver } from './resolvers/mindfulnessAlbum.resolver';
import { NatureAlbumResolver } from './resolvers/natureAlbum.resolver';
import { WanderAlbumResolver } from './resolvers/wanderAlbum.resolver';
// import { RESOLVER_TYPE_METADATA } from '@nestjs/graphql/dist/graphql.constants';
// import { __ as t, configure as i18nConfigure } from 'i18n';

// @Global()
@Module({
    imports: [CacheModule.register({ ttl: 60 }),
        MoleculerModule.forRoot({
            namespace: 'sati',
            // logger: bindings => new Logger(),
            transporter: 'TCP',
            logLevel: process.env.LOG_LEVEL,
        })],
    providers: [
        // NotaddGrpcClientFactory,
        // ResourceResolver,
        MindfulnessResolver,
        MindfulnessAlbumResolver,
        NatureResolver,
        NatureAlbumResolver,
        WanderResolver,
        WanderAlbumResolver,
        HomeResolver,
        SceneResolver,
    ],
})
export class ResourceModule implements OnModuleInit {
    constructor(
    ) {
    }

    static forRoot(): DynamicModule {
        return {
            module: ResourceModule,
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
