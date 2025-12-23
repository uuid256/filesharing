import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Share, ShareDocument } from './schemas/share.schema';
import { File, FileDocument } from '../files/schemas/file.schema';
import { CreateShareDto } from './dto/share.dto';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShareService {
    constructor(
        @InjectModel(Share.name) private shareModel: Model<ShareDocument>,
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        private configService: ConfigService,
    ) { }

    async createShare(fileId: string, createShareDto: CreateShareDto): Promise<ShareDocument> {
        if (!Types.ObjectId.isValid(fileId)) {
            throw new BadRequestException('ID ไม่ถูกต้อง');
        }

        const file = await this.fileModel.findById(fileId).exec();
        if (!file) {
            throw new NotFoundException('ไม่พบไฟล์');
        }

        if (file.deletedAt) {
            throw new BadRequestException('ไม่สามารถแชร์ไฟล์ที่ถูกลบได้');
        }

        const token = randomUUID();
        const share = new this.shareModel({
            fileId: new Types.ObjectId(fileId),
            token,
            expiresAt: createShareDto.expiresAt ? new Date(createShareDto.expiresAt) : null,
            isRevoked: false,
            downloadCount: 0,
        });

        return share.save();
    }

    async findByToken(token: string): Promise<ShareDocument> {
        const share = await this.shareModel.findOne({ token }).exec();
        if (!share) {
            throw new NotFoundException('ไม่พบลิงก์แชร์');
        }

        if (share.isRevoked) {
            throw new BadRequestException('ลิงก์แชร์ถูกยกเลิกแล้ว');
        }

        if (share.expiresAt && new Date() > share.expiresAt) {
            throw new BadRequestException('ลิงก์แชร์หมดอายุแล้ว');
        }

        return share;
    }

    async incrementDownloadCount(shareId: string): Promise<void> {
        await this.shareModel.findByIdAndUpdate(shareId, {
            $inc: { downloadCount: 1 },
            lastAccessedAt: new Date(),
        }).exec();
    }

    async revokeShare(fileId: string): Promise<void> {
        await this.shareModel.updateMany(
            { fileId: new Types.ObjectId(fileId) },
            { isRevoked: true },
        ).exec();
    }

    async findByFileId(fileId: string): Promise<ShareDocument[]> {
        return this.shareModel.find({ fileId: new Types.ObjectId(fileId) }).exec();
    }

    async findAll(owner: string): Promise<any[]> {
        const files = await this.fileModel.find({ owner }).exec();
        const fileIds = files.map(f => f._id);

        const shares = await this.shareModel.find({
            fileId: { $in: fileIds },
        }).populate('fileId').exec();

        return shares;
    }

    getShareUrl(token: string): string {
        const appUrl = this.configService.get<string>('app.url');
        return `${appUrl}/share/${token}`;
    }
}
