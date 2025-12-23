import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
    @ApiProperty({ description: 'เจ้าของไฟล์' })
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiPropertyOptional({ description: 'ID ของโฟลเดอร์' })
    @IsString()
    @IsOptional()
    folderId?: string;
}

export class UpdateFileDto {
    @ApiPropertyOptional({ description: 'ชื่อไฟล์ใหม่' })
    @IsString()
    @IsOptional()
    originalName?: string;

    @ApiPropertyOptional({ description: 'ID ของโฟลเดอร์ใหม่' })
    @IsString()
    @IsOptional()
    folderId?: string;
}
