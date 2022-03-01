import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { AccountService } from '../account/account.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { Password } from './entities/password.entity';

@Injectable()
export class PasswordService {
  constructor(
    @InjectTenancyModel(Password.name)
    private readonly passwordModel: Model<Password>,
    private readonly accountService: AccountService,
  ) {}

  async create(createPasswordDto: CreatePasswordDto): Promise<Password> {
    const { password, ...rest } = createPasswordDto;
    const secret = await this.accountService.secret();

    const iv = randomBytes(16);

    console.log(iv);

    const cipher = createCipheriv('aes-256-cbc', secret, iv);

    const encryptedPassword = Buffer.concat([
      cipher.update(password),
      cipher.final(),
    ]);

    const encryptedPasswordBase64 = encryptedPassword.toString('base64');

    return await this.passwordModel.create({
      ...rest,
      password: encryptedPasswordBase64,
      iv,
    });
  }

  // Returns only the decrypted password
  async findAll(): Promise<{ password: string }[]> {
    const passwords = await this.passwordModel.find({}).exec();

    const secret = await this.accountService.secret();

    const passwordsPromise = passwords.map(
      async ({ password, iv, metadata, folder }) => {
        const decipher = createDecipheriv('aes-256-cbc', secret, iv);

        const decryptedPassword = Buffer.concat([
          decipher.update(Buffer.from(password, 'base64')),
          decipher.final(),
        ]);

        return {
          password: decryptedPassword.toString(),
          metadata,
          folder,
        };
      },
    );

    return Promise.all(passwordsPromise);
  }
}
