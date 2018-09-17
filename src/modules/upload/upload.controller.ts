import { Controller, Inject, Post, Get, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import * as UUID from 'uuid/v1';
import * as OSS from 'ali-oss';
import { ACCESS_KEY_ID, ACCESS_KEY_SECRET, REGION, AVATAR_BUCKET } from '../../configurations/oss.config';

@Controller()
export class UploadController {
    constructor() { }

    @Post('uploadAvatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file) {
        const client = new OSS({
            region: REGION,
            accessKeyId: ACCESS_KEY_ID,
            accessKeySecret: ACCESS_KEY_SECRET,
            bucket: AVATAR_BUCKET
        });
        const result = await client.put(`avatar/${UUID()}.jpg`, file.buffer);
        console.log(result);
        return { code: 200, message: 'upload avatar success', data: result.res.requestUrls[0] };
    }
}
