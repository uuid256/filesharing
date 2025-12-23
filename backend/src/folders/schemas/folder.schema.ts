import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FolderDocument = Folder & Document;

@Schema({ timestamps: true })
export class Folder {
    @Prop({ required: true, index: true })
    owner: string;

    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Folder', default: null, index: true })
    parentId: Types.ObjectId | null;

    @Prop({ required: true })
    path: string;

    @Prop({ default: null, index: true })
    deletedAt: Date | null;

    @Prop({ default: '' })
    description: string;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);

// Create compound indexes
FolderSchema.index({ owner: 1, parentId: 1 });
FolderSchema.index({ owner: 1, name: 1, parentId: 1 }, { unique: true });
