import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { Share, ShareSchema } from './schemas/share.schema';
import { FilesModule } from '../files/files.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Share.name, schema: ShareSchema }]),
        FilesModule,
    ],
    controllers: [ShareController],
    providers: [ShareService],
    exports: [ShareService],
})
export class ShareModule { }
