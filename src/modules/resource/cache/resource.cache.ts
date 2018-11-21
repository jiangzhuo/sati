import { Inject, Injectable, Optional } from '@nestjs/common';
import { isArray } from 'lodash';
// import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';
import { InjectBroker } from 'nestjs-moleculer';
import { ServiceBroker } from 'moleculer';
// import { validateEach } from "@nestjs/common/utils/validate-each.util";
// import * as SortedMap from 'collections/sorted-map';
// import * as FastMap from 'collections/fast-map';
// var FastMap = require("collections/fast-map");
// var SortedMap = require("collections/sorted-map");

@Injectable()
export class ResourceCache {
    async onModuleInit(): Promise<any> {
        await this.initResourceCache();
        setInterval(() => {
            this.initResourceCache().then(() => {

            }).catch((e) => {
                console.log(e);
            });
        }, 60000);
    }

    constructor(
        @InjectBroker() private readonly broker: ServiceBroker
    ) {
    }

    private cache = new Map();
    private cacheSortedByCreateTime = [];

    public updateResourceCache(resources = [], type: string) {
        if (!isArray(resources) && resources !== null) {
            resources = [resources];
        }
        resources.forEach((resource) => {
            resource.type = type;
            this.cache.set(resource.id, resource);
        });
        this.cacheSortedByCreateTime = [...this.cache.entries()].sort(([key1, value1], [key2, value2]) => {
            return value2.createTime - value1.createTime;
        }).map(([key]) => key);
    }

    public getResourceByCreateTime(limit: number, after?: string) {
        const startIndex = this.cacheSortedByCreateTime.indexOf(after);
        const resourceIds = this.cacheSortedByCreateTime.slice(startIndex + 1, startIndex + 1 + limit);
        return resourceIds.map(resourceId => this.cache.get(resourceId));
    }

    private async initResourceCache() {
        // 初始化缓存
        const batchGetLimit = 1;
        try {

            // mindfulness
            let mindfulnessResult = await this.broker.call('mindfulness.getMindfulness', { first: batchGetLimit });
            while (mindfulnessResult.data.length &&
            mindfulnessResult.data.length !== 0 &&
            mindfulnessResult.data.some((mindfulness) => !this.cache.has(mindfulness.id))) {
                this.updateResourceCache(mindfulnessResult.data, 'mindfulness');
                mindfulnessResult = await this.broker.call('mindfulness.getMindfulness',
                    { first: batchGetLimit, after: mindfulnessResult.data[mindfulnessResult.data.length - 1].id });
            }
            // nature
            let natureResult = await this.broker.call('nature.getNature', { first: batchGetLimit });
            while (natureResult.data.length &&
            natureResult.data.length !== 0 &&
            natureResult.data.some((nature) => !this.cache.has(nature.id))) {
                this.updateResourceCache(natureResult.data, 'nature');
                natureResult = await this.broker.call('nature.getNature',
                    { first: batchGetLimit, after: natureResult.data[natureResult.data.length - 1].id });
            }
            // wander
            let wanderResult = await this.broker.call('wander.getWander', { first: batchGetLimit });
            while (wanderResult.data.length &&
            wanderResult.data.length !== 0 &&
            wanderResult.data.some((wander) => !this.cache.has(wander.id))) {
                this.updateResourceCache(wanderResult.data, 'wander');
                wanderResult = await this.broker.call('wander.getWander',
                    { first: batchGetLimit, after: wanderResult.data[wanderResult.data.length - 1].id });
            }
            // wanderAlbum
            let wanderAlbumResult = await this.broker.call('wander.getWanderAlbum', { first: batchGetLimit });
            while (wanderAlbumResult.data.length &&
            wanderAlbumResult.data.length !== 0 &&
            wanderAlbumResult.data.some((wanderAlbum) => !this.cache.has(wanderAlbum.id))) {
                this.updateResourceCache(wanderAlbumResult.data, 'wanderAlbum');
                wanderAlbumResult = await this.broker.call('wander.getWanderAlbum',
                    { first: batchGetLimit, after: wanderAlbumResult.data[wanderAlbumResult.data.length - 1].id });
            }
        } catch (e) {
            console.error('init resource cache failed!');
            console.error(e);
        }
    }
}
