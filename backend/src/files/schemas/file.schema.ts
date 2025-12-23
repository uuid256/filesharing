import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
    @Prop({ required: true, index: true })
    owner: string;

    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    originalName: string;

    @Prop({ required: true })
    mimeType: string;

    @Prop({ required: true })
    size: number;

    @Prop({ required: true })
    path: string;

    @Prop({ type: Types.ObjectId, ref: 'Folder', default: null, index: true })
    folderId: Types.ObjectId | null;

    @Prop({ default: null, index: true })
    deletedAt: Date | null;

    @Prop({ default: null, index: true })
    shareToken: string | null;

    @Prop({ default: null })
    shareExpiresAt: Date | null;
}

export const FileSchema = SchemaFactory.createForClass(File);

// Create compound index
FileSchema.index({ owner: 1, folderId: 1 });
