import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    Res,
    StreamableFile,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ShareService } from './share.service';
import { FilesService } from '../files/files.service';
import { CreateShareDto } from './dto/share.dto';
import { createReadStream } from 'fs';
import * as fs from 'fs';

@ApiTags('share')
@Controller('share')
export class ShareController {
    constructor(
        private readonly shareService: ShareService,
        private readonly filesService: FilesService,
    ) { }

    @Post('files/:id')
    @ApiOperation({ summary: 'สร้างลิงก์แชร์' })
    async createShare(@Param('id') fileId: string, @Body() createShareDto: CreateShareDto) {
        const share = await this.shareService.createShare(fileId, createShareDto);
        const shareUrl = this.shareService.getShareUrl(share.token);

        return {
            ...share.toObject(),
            shareUrl,
        };
    }

    @Get(':token')
    @ApiOperation({ summary: 'ดาวน์โหลดผ่านลิงก์แชร์ (สาธารณะ)' })
    async downloadViaShare(@Param('token') token: string, @Res({ passthrough: true }) res: Response) {
        const share = await this.shareService.findByToken(token);
        const file = await this.filesService.findOne(share.fileId.toString());

        if (!fs.existsSync(file.path)) {
            throw new BadRequestException('ไม่พบไฟล์ในระบบ');
        }

        // Increment download count
        await this.shareService.incrementDownloadCount(share._id.toString());

        const stream = createReadStream(file.path);
        res.set({
            'Content-Type': file.mimeType,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
        });

        return new StreamableFile(stream);
    }

    @Delete('files/:id')
    @ApiOperation({ summary: 'ยกเลิกลิงก์แชร์' })
    async revokeShare(@Param('id') fileId: string) {
        await this.shareService.revokeShare(fileId);
        return { message: 'ยกเลิกลิงก์แชร์สำเร็จ' };
    }

    @Get('files/:id/links')
    @ApiOperation({ summary: 'ดึงรายการลิงก์แชร์ของไฟล์' })
    async getFileShares(@Param('id') fileId: string) {
        return this.shareService.findByFileId(fileId);
    }

    @Get()
    @ApiOperation({ summary: 'ดึงรายการแชร์ทั้งหมด' })
    @ApiQuery({ name: 'owner', required: true })
    async findAll(@Query('owner') owner: string) {
        return this.shareService.findAll(owner);
    }
}
