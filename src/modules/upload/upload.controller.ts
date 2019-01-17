import { Controller, FileInterceptor, Post, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import OSS from 'ali-oss';
import hasha from 'hasha';
import mime from 'mime';

import { ErrorsInterceptor } from '../../common/interceptors';
// import { Configurable, ConfigParam, ConfigService } from 'nestjs-config';

@Controller()
@UseInterceptors(ErrorsInterceptor)
export class UploadController {
    constructor() {
        // setTimeout(() => {
        //     this.config.set('my.parameter', 'jiangzhuo');
        // }, 10000);
    }

    // @Get('hello')
    // // @Configurable()
    // async hello() {
    //     return { data: this.config.get('my.parameter', 'default value') };
    // }

    @Post('uploadAvatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file) {
        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            internal: true,
        });
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const filename = `avatar/${hasha(file.buffer, { algorithm: 'md5' })}.${mime.getExtension(file.mimetype)}`;
        await client.put(filename, file.buffer);
        return { code: 200, message: 'upload avatar success', data: await client.generateObjectUrl(filename, process.env.OSS_BASE_URL) };
    }

    @Post('uploadBackground')
    @UseInterceptors(FileInterceptor('file'))
    async uploadBackground(@UploadedFile() file) {
        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            internal: true,
        });
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const filename = `background/${hasha(file.buffer, { algorithm: 'md5' })}.${mime.getExtension(file.mimetype)}`;
        await client.put(filename, file.buffer);
        return { code: 200, message: 'upload background success', data: await client.generateObjectUrl(filename, process.env.OSS_BASE_URL) };
    }

    @Post('uploadAudio')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAudio(@UploadedFile() file) {
        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            internal: true,
        });
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const filename = `audio/${hasha(file.buffer, { algorithm: 'md5' })}.${mime.getExtension(file.mimetype)}`;
        await client.put(filename, file.buffer);
        return { code: 200, message: 'upload audio success', data: await client.generateObjectUrl(filename, process.env.BASE_URL) };
    }
}
