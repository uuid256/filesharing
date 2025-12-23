import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from './config/app.config';
import { FilesModule } from './files/files.module';
import { FoldersModule } from './folders/folders.module';
import { ShareModule } from './share/share.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('mongodb.uri'),
            }),
            inject: [ConfigService],
        }),
        FilesModule,
        FoldersModule,
        ShareModule,
    ],
})
export class AppModule { }
