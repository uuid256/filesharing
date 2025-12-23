import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { UpdateFileDto } from './dto/file.dto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
    ) { }

    async uploadFile(
        file: Express.Multer.File,
        owner: string,
        folderId?: string,
    ): Promise<FileDocument> {
        const fileData = {
            owner,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            folderId: folderId ? new Types.ObjectId(folderId) : null,
        };

        const createdFile = new this.fileModel(fileData);
        return createdFile.save();
    }

    async findAll(owner: string, folderId?: string): Promise<FileDocument[]> {
        const query: any = { owner, deletedAt: null };

        if (folderId === 'root' || folderId === undefined) {
            query.folderId = null;
        } else if (folderId) {
            query.folderId = new Types.ObjectId(folderId);
        }

        return this.fileModel.find(query).exec();
    }

    async findOne(id: string): Promise<FileDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('ID ไม่ถูกต้อง');
        }

        const file = await this.fileModel.findById(id).exec();
        if (!file) {
            throw new NotFoundException('ไม่พบไฟล์');
        }
        return file;
    }

    async updateMetadata(id: string, updateFileDto: UpdateFileDto): Promise<FileDocument> {
        const file = await this.findOne(id);

        if (updateFileDto.originalName) {
            file.originalName = updateFileDto.originalName;
        }

        if (updateFileDto.folderId !== undefined) {
            file.folderId = updateFileDto.folderId ? new Types.ObjectId(updateFileDto.folderId) : null;
        }

        return file.save();
    }

    async replaceContent(id: string, newFile: Express.Multer.File): Promise<FileDocument> {
        const file = await this.findOne(id);

        // Delete old file
        if (fs.existsSync(file.path)) {
            await unlinkAsync(file.path);
        }

        // Update with new file
        file.filename = newFile.filename;
        file.mimeType = newFile.mimetype;
        file.size = newFile.size;
        file.path = newFile.path;

        return file.save();
    }

    async softDelete(id: string): Promise<FileDocument> {
        const file = await this.findOne(id);
        file.deletedAt = new Date();
        return file.save();
    }

    async restore(id: string): Promise<FileDocument> {
        const file = await this.fileModel.findById(id).exec();
        if (!file) {
            throw new NotFoundException('ไม่พบไฟล์');
        }

        file.deletedAt = null;
        return file.save();
    }

    async permanentDelete(id: string): Promise<void> {
        const file = await this.fileModel.findById(id).exec();
        if (!file) {
            throw new NotFoundException('ไม่พบไฟล์');
        }

        // Delete physical file
        if (fs.existsSync(file.path)) {
            await unlinkAsync(file.path);
        }

        // Delete database record
        await this.fileModel.findByIdAndDelete(id).exec();
    }

    async findDeleted(owner: string): Promise<FileDocument[]> {
        return this.fileModel.find({ owner, deletedAt: { $ne: null } }).exec();
    }

    async softDeleteByFolder(folderId: string): Promise<void> {
        await this.fileModel.updateMany(
            { folderId: new Types.ObjectId(folderId) },
            { deletedAt: new Date() },
        ).exec();
    }

    async restoreByFolder(folderId: string): Promise<void> {
        await this.fileModel.updateMany(
            { folderId: new Types.ObjectId(folderId) },
            { deletedAt: null },
        ).exec();
    }
}
