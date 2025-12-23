import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './dto/folder.dto';

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) { }

    @Post()
    @ApiOperation({ summary: 'สร้างโฟลเดอร์' })
    async create(@Body() createFolderDto: CreateFolderDto) {
        return this.foldersService.create(createFolderDto);
    }

    @Get()
    @ApiOperation({ summary: 'ดึงรายการโฟลเดอร์' })
    @ApiQuery({ name: 'owner', required: true })
    @ApiQuery({ name: 'parentId', required: false })
    async findAll(@Query('owner') owner: string, @Query('parentId') parentId?: string) {
        return this.foldersService.findAll(owner, parentId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'ดึงข้อมูลโฟลเดอร์' })
    async findOne(@Param('id') id: string) {
        return this.foldersService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'อัปเดตโฟลเดอร์' })
    async update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
        return this.foldersService.update(id, updateFolderDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'ลบโฟลเดอร์ (Soft Delete)' })
    async softDelete(@Param('id') id: string) {
        return this.foldersService.softDelete(id);
    }

    @Put(':id/restore')
    @ApiOperation({ summary: 'กู้คืนโฟลเดอร์' })
    async restore(@Param('id') id: string) {
        return this.foldersService.restore(id);
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'ลบโฟลเดอร์ถาวร' })
    async permanentDelete(@Param('id') id: string) {
        await this.foldersService.permanentDelete(id);
        return { message: 'ลบโฟลเดอร์สำเร็จ' };
    }

    @Get('trash/list')
    @ApiOperation({ summary: 'ดึงรายการโฟลเดอร์ที่ถูกลบ' })
    @ApiQuery({ name: 'owner', required: true })
    async findDeleted(@Query('owner') owner: string) {
        return this.foldersService.findDeleted(owner);
    }
}
