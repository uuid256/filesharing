import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');

    // Enable CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('File Storage API')
        .setDescription('ระบบจัดการไฟล์และโฟลเดอร์')
        .setVersion('1.0')
        .addTag('files', 'การจัดการไฟล์')
        .addTag('folders', 'การจัดการโฟลเดอร์')
        .addTag('share', 'การแชร์ไฟล์')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);
    console.log(`🚀 แอปพลิเคชันทำงานที่ http://localhost:${port}`);
    console.log(`📚 เอกสาร API ที่ http://localhost:${port}/api`);
}

bootstrap();
