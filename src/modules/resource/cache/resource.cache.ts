import { Injectable } from '@nestjs/common';
import { isArray } from 'lodash';
// import { validateEach } from "@nestjs/common/utils/validate-each.util";
// import * as SortedMap from 'collections/sorted-map';
// import * as FastMap from 'collections/fast-map';
// var FastMap = require("collections/fast-map");
// var SortedMap = require("collections/sorted-map");

@Injectable()
export class ResourceCache {
    private cache = new Map();
    private cacheSortedByCreateTime = [];

    public updateResourceCache(resources, type: string) {
        if (!isArray(resources)) {
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
        let startIndex = this.cacheSortedByCreateTime.indexOf(after);
        if (startIndex === -1) {
            startIndex = 0;
        }
        const resourceIds = this.cacheSortedByCreateTime.slice(startIndex, startIndex + limit);
        return resourceIds.map(resourceId => this.cache.get(resourceId));
    }

    private async initResourceCache() {
        // 初始化缓存
    }
}
