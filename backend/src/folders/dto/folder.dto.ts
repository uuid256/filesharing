import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFolderDto {
    @ApiProperty({ description: 'เจ้าของโฟลเดอร์' })
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty({ description: 'ชื่อโฟลเดอร์' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: 'ID ของโฟลเดอร์แม่' })
    @IsString()
    @IsOptional()
    parentId?: string;

    @ApiPropertyOptional({ description: 'คำอธิบายโฟลเดอร์' })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateFolderDto {
    @ApiPropertyOptional({ description: 'ชื่อโฟลเดอร์ใหม่' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'คำอธิบายใหม่' })
    @IsString()
    @IsOptional()
    description?: string;
}
