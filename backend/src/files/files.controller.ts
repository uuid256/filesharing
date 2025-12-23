import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    Res,
    StreamableFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { FilesService } from './files.service';
import { UploadFileDto, UpdateFileDto } from './dto/file.dto';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { createReadStream } from 'fs';

@ApiTags('files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @ApiOperation({ summary: 'อัปโหลดไฟล์เดี่ยว' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const owner = req.body.owner || 'default';
                    const uploadPath = path.join('./uploads', owner);
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
        }),
    )
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadFileDto: UploadFileDto,
    ) {
        if (!file) {
            throw new BadRequestException('ไม่พบไฟล์');
        }
        return this.filesService.uploadFile(file, uploadFileDto.owner, uploadFileDto.folderId);
    }

    @Post('upload/multiple')
    @ApiOperation({ summary: 'อัปโหลดหลายไฟล์' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FilesInterceptor('files', 20, {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const owner = req.body.owner || 'default';
                    const uploadPath = path.join('./uploads', owner);
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
        }),
    )
    async uploadMultiple(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() uploadFileDto: UploadFileDto,
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('ไม่พบไฟล์');
        }

        const results = [];
        for (const file of files) {
            const result = await this.filesService.uploadFile(
                file,
                uploadFileDto.owner,
                uploadFileDto.folderId,
            );
            results.push(result);
        }
        return results;
    }

    @Get()
    @ApiOperation({ summary: 'ดึงรายการไฟล์' })
    @ApiQuery({ name: 'owner', required: true })
    @ApiQuery({ name: 'folderId', required: false })
    async findAll(@Query('owner') owner: string, @Query('folderId') folderId?: string) {
        return this.filesService.findAll(owner, folderId);
    }

    @Get(':id/download')
    @ApiOperation({ summary: 'ดาวน์โหลดไฟล์' })
    async downloadFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
        const file = await this.filesService.findOne(id);

        if (!fs.existsSync(file.path)) {
            throw new BadRequestException('ไม่พบไฟล์ในระบบ');
        }

        const stream = createReadStream(file.path);
        res.set({
            'Content-Type': file.mimeType,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
        });

        return new StreamableFile(stream);
    }

    @Put(':id')
    @ApiOperation({ summary: 'อัปเดตข้อมูลไฟล์' })
    async updateMetadata(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
        return this.filesService.updateMetadata(id, updateFileDto);
    }

    @Put(':id/content')
    @ApiOperation({ summary: 'แทนที่เนื้อหาไฟล์' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = './uploads/temp';
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
        }),
    )
    async replaceContent(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('ไม่พบไฟล์');
        }
        return this.filesService.replaceContent(id, file);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'ลบไฟล์ (Soft Delete)' })
    async softDelete(@Param('id') id: string) {
        return this.filesService.softDelete(id);
    }

    @Put(':id/restore')
    @ApiOperation({ summary: 'กู้คืนไฟล์' })
    async restore(@Param('id') id: string) {
        return this.filesService.restore(id);
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'ลบไฟล์ถาวร' })
    async permanentDelete(@Param('id') id: string) {
        await this.filesService.permanentDelete(id);
        return { message: 'ลบไฟล์สำเร็จ' };
    }

    @Get('trash/list')
    @ApiOperation({ summary: 'ดึงรายการไฟล์ที่ถูกลบ' })
    @ApiQuery({ name: 'owner', required: true })
    async findDeleted(@Query('owner') owner: string) {
        return this.filesService.findDeleted(owner);
    }
}
