import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShareDocument = Share & Document;

@Schema({ timestamps: true })
export class Share {
    @Prop({ type: Types.ObjectId, ref: 'File', required: true, index: true })
    fileId: Types.ObjectId;

    @Prop({ required: true, unique: true, index: true })
    token: string;

    @Prop({ default: null, index: true })
    expiresAt: Date | null;

    @Prop({ default: false, index: true })
    isRevoked: boolean;

    @Prop({ default: 0 })
    downloadCount: number;

    @Prop({ default: null })
    lastAccessedAt: Date | null;
}

export const ShareSchema = SchemaFactory.createForClass(Share);
