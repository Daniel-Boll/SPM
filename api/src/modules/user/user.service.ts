import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectTenancyModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async find(match: { [type: string]: string }): Promise<User> {
    return await this.userModel.findOne(match).exec();
  }

  async findByRefreshToken(token: string): Promise<User> {
    return await this.userModel
      .findOne({ currentHashedRefreshToken: token })
      .exec();
  }

  async updateRefreshToken(id: string, newRefreshToken: string): Promise<void> {
    await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { currentHashedRefreshToken: newRefreshToken },
      )
      .exec();
  }
}
