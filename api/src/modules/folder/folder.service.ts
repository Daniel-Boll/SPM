import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { Folder } from './entities/folder.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Injectable({ scope: Scope.REQUEST })
export class FolderService {
  constructor(
    @InjectTenancyModel(Folder.name)
    private readonly folderModel: Model<Folder>,
  ) {}

  async create(createFolderDto: CreateFolderDto): Promise<Folder> {
    return this.folderModel.create(createFolderDto);
  }

  async findAll(): Promise<Folder[]> {
    return await this.folderModel.find().exec();
  }

  async find(match: { [type: string]: string }): Promise<Folder> {
    return await this.folderModel.findOne(match).exec();
  }

  async update(name: string, updateFolderDto: UpdateFolderDto) {
    try {
      await this.folderModel.findOneAndUpdate({ name }, updateFolderDto).exec();
      return { status: 'ok' };
    } catch (err) {
      return { status: 'error', message: err.message };
    }
  }

  async remove(name: string) {
    const folder = await this.folderModel.findOneAndDelete({name}).exec();

    return folder;
  }

}
