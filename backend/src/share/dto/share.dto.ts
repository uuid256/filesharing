import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShareDto {
    @ApiPropertyOptional({ description: 'วันหมดอายุของลิงก์แชร์' })
    @IsDateString()
    @IsOptional()
    expiresAt?: string;
}
