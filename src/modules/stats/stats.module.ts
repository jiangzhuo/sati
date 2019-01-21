import 'reflect-metadata';

import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';

import { StatsResolver } from './resolvers/stats.resolver';
import { MoleculerModule } from 'nestjs-moleculer';
import * as jaeger from 'moleculer-jaeger';

// @Global()
@Module({
    imports: [
        MoleculerModule.forRoot({
            namespace: 'sati',
            metrics: true,
            // logger: bindings => new Logger(),
            transporter: process.env.TRANSPORTER,
            logLevel: 'info',
        }),
        MoleculerModule.forFeature([{
            name: 'jaeger',
            schema: jaeger,
        }]),
    ],
    providers: [
        StatsResolver,
    ]
})
export class StatsModule implements OnModuleInit {
    private readonly metadataScanner: MetadataScanner;

    constructor(
        @Inject(ModulesContainer) private readonly modulesContainer: ModulesContainer,
    ) {
        this.metadataScanner = new MetadataScanner();
    }

    static forRoot(): DynamicModule {
        return {
            module: StatsModule,
        };
    }

    async onModuleInit() {
    }
}
