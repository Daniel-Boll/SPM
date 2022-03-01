import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { ConflictException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { Folder } from './entities/folder.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { NotFoundError } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export class FolderService {
  constructor(
    @InjectTenancyModel(Folder.name)
    private readonly folderModel: Model<Folder>,
  ) {}

  async create(createFolderDto: CreateFolderDto): Promise<Folder> {
    try {
      const createdFolder = await this.folderModel.create(createFolderDto);
      return createdFolder;
    } catch (err) {
      const error =
        err.code === 11000
          ? new ConflictException('Folder already exists')
          : new Error('Error creating Folder');

      throw error;
    }
  }

  async findAll(): Promise<any> {
    const folders = await this.folderModel.find().exec();
    return folders.map(folder => {
      const {name, description} = folder;
      return {name, description};
    });
  }

  async findOne(name): Promise<any> {
    try {
      const folder = await this.folderModel.findOne({name});
      if (!folder) throw new NotFoundException("Folder not Found");
      return folder;
    } catch(error) {
      throw error;
    }
  }

  async find(match: { [type: string]: string }): Promise<Folder> {
    return await this.folderModel.findOne(match).exec();
  }

  async update(name: string, updateFolderDto: UpdateFolderDto) {
    try {
      const updatedFolder = await this.folderModel.findOneAndUpdate({ name }, updateFolderDto);
      if (!updatedFolder) throw new NotFoundException("Folder not Found");
      return updatedFolder;
    } catch (error) {
      throw error;
    }
  }

  async remove(name: string) {
    try{
      const folder = await this.folderModel.findOneAndDelete({name}).exec();
      if (!folder) throw new NotFoundException("Folder not found");
      return folder;
    } catch (error) {
      throw error;
    }
  }

}
