import { Controller, Inject, Post, Get, Options, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
// import * as UUID from 'uuid/v1';
import * as OSS from 'ali-oss';
import * as hasha from 'hasha';
import * as mime from 'mime';

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
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const result = await client.put(`avatar/${hasha(file.buffer, { algorithm: 'md5' })}.${mime.getExtension(file.mimetype)}`, file.buffer);
        return { code: 200, message: 'upload avatar success', data: result.res.requestUrls[0] };
    }

    @Post('uploadBackground')
    @UseInterceptors(FileInterceptor('file'))
    async uploadBackground(@UploadedFile() file) {
        const client = new OSS({
            region: REGION,
            accessKeyId: ACCESS_KEY_ID,
            accessKeySecret: ACCESS_KEY_SECRET,
            bucket: AVATAR_BUCKET
        });
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const result = await client.put(`background/${hasha(file.buffer, { algorithm: 'md5' })}.${mime.getExtension(file.mimetype)}`, file.buffer);
        return { code: 200, message: 'upload background success', data: result.res.requestUrls[0] };
    }

    @Post('uploadAudio')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAudio(@UploadedFile() file) {
        const client = new OSS({
            region: REGION,
            accessKeyId: ACCESS_KEY_ID,
            accessKeySecret: ACCESS_KEY_SECRET,
            bucket: AVATAR_BUCKET
        });
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const result = await client.put(`audio/${hasha(file.buffer, { algorithm: 'md5' })}.${mime.getExtension(file.mimetype)}`, file.buffer);
        return { code: 200, message: 'upload audio success', data: result.res.requestUrls[0] };
    }
}
