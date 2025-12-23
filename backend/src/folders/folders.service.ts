import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { CreateFolderDto, UpdateFolderDto } from './dto/folder.dto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { FilesService } from '../files/files.service';

const mkdirAsync = promisify(fs.mkdir);
const rmdirAsync = promisify(fs.rmdir);

@Injectable()
export class FoldersService {
    constructor(
        @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
    ) { }

    async create(createFolderDto: CreateFolderDto): Promise<FolderDocument> {
        const { owner, name, parentId, description } = createFolderDto;

        // Check for duplicate name in same parent
        const existing = await this.folderModel.findOne({
            owner,
            name,
            parentId: parentId ? new Types.ObjectId(parentId) : null,
            deletedAt: null,
        }).exec();

        if (existing) {
            throw new ConflictException('มีโฟลเดอร์ชื่อนี้อยู่แล้ว');
        }

        // Build filesystem path
        let folderPath = path.join('./uploads', owner);
        if (parentId) {
            const parent = await this.findOne(parentId);
            folderPath = path.join(parent.path, name);
        } else {
            folderPath = path.join(folderPath, name);
        }

        // Create directory
        if (!fs.existsSync(folderPath)) {
            await mkdirAsync(folderPath, { recursive: true });
        }

        const folder = new this.folderModel({
            owner,
            name,
            parentId: parentId ? new Types.ObjectId(parentId) : null,
            path: folderPath,
            description: description || '',
        });

        return folder.save();
    }

    async findAll(owner: string, parentId?: string): Promise<FolderDocument[]> {
        const query: any = { owner, deletedAt: null };

        if (parentId === 'root' || parentId === undefined) {
            query.parentId = null;
        } else if (parentId) {
            query.parentId = new Types.ObjectId(parentId);
        }

        return this.folderModel.find(query).exec();
    }

    async findOne(id: string): Promise<FolderDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('ID ไม่ถูกต้อง');
        }

        const folder = await this.folderModel.findById(id).exec();
        if (!folder) {
            throw new NotFoundException('ไม่พบโฟลเดอร์');
        }
        return folder;
    }

    async update(id: string, updateFolderDto: UpdateFolderDto): Promise<FolderDocument> {
        const folder = await this.findOne(id);

        if (updateFolderDto.name) {
            // Check for duplicate
            const existing = await this.folderModel.findOne({
                owner: folder.owner,
                name: updateFolderDto.name,
                parentId: folder.parentId,
                deletedAt: null,
                _id: { $ne: folder._id },
            }).exec();

            if (existing) {
                throw new ConflictException('มีโฟลเดอร์ชื่อนี้อยู่แล้ว');
            }

            folder.name = updateFolderDto.name;
        }

        if (updateFolderDto.description !== undefined) {
            folder.description = updateFolderDto.description;
        }

        return folder.save();
    }

    async softDelete(id: string): Promise<FolderDocument> {
        const folder = await this.findOne(id);

        // Get all child folders using BFS
        const childIds = await this.getAllChildFolderIds(id);

        // Soft delete all children
        await this.folderModel.updateMany(
            { _id: { $in: childIds } },
            { deletedAt: new Date() },
        ).exec();

        // Soft delete the folder itself
        folder.deletedAt = new Date();
        return folder.save();
    }

    async restore(id: string): Promise<FolderDocument> {
        const folder = await this.folderModel.findById(id).exec();
        if (!folder) {
            throw new NotFoundException('ไม่พบโฟลเดอร์');
        }

        // Get all child folders
        const childIds = await this.getAllChildFolderIds(id);

        // Restore all children
        await this.folderModel.updateMany(
            { _id: { $in: childIds } },
            { deletedAt: null },
        ).exec();

        // Restore the folder itself
        folder.deletedAt = null;
        return folder.save();
    }

    async permanentDelete(id: string): Promise<void> {
        const folder = await this.folderModel.findById(id).exec();
        if (!folder) {
            throw new NotFoundException('ไม่พบโฟลเดอร์');
        }

        // Get all child folders
        const childIds = await this.getAllChildFolderIds(id);
        childIds.push(new Types.ObjectId(id));

        // Delete all folders
        await this.folderModel.deleteMany({ _id: { $in: childIds } }).exec();
    }

    async findDeleted(owner: string): Promise<FolderDocument[]> {
        return this.folderModel.find({ owner, deletedAt: { $ne: null } }).exec();
    }

    private async getAllChildFolderIds(parentId: string): Promise<Types.ObjectId[]> {
        const result: Types.ObjectId[] = [];
        const queue: string[] = [parentId];

        while (queue.length > 0) {
            const currentId = queue.shift();
            const children = await this.folderModel.find({
                parentId: new Types.ObjectId(currentId),
            }).exec();

            for (const child of children) {
                result.push(child._id as Types.ObjectId);
                queue.push(child._id.toString());
            }
        }

        return result;
    }
}
