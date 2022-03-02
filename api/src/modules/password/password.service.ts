import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { AccountService } from '../account/account.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { Password } from './entities/password.entity';

type PasswordWithId = Password & { _id: string };

@Injectable()
export class PasswordService {
  constructor(
    @InjectTenancyModel(Password.name)
    private readonly passwordModel: Model<Password>,
    private readonly accountService: AccountService,
  ) {}

  private async encrypt(password: string, secret: Buffer) {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', secret, iv);

    const encryptedPassword = Buffer.concat([
      cipher.update(password),
      cipher.final(),
    ]);

    const encryptedPasswordBase64 = encryptedPassword.toString('base64');

    return {
      password: encryptedPasswordBase64,
      iv,
    };
  }

  private async decrypt(passwords: PasswordWithId[], secret: Buffer) {
    const passwordsPromise = passwords.map(
      async ({ _id, password, iv, metadata, folder }) => {
        const decipher = createDecipheriv('aes-256-cbc', secret, iv);

        const decryptedPassword = Buffer.concat([
          decipher.update(Buffer.from(password, 'base64')),
          decipher.final(),
        ]);

        return {
          password: decryptedPassword.toString(),
          metadata,
          folder,
          _id,
        };
      },
    );

    return Promise.all(passwordsPromise);
  }

  async create(createPasswordDto: CreatePasswordDto): Promise<Password> {
    const { password, ...rest } = createPasswordDto;
    const secret = await this.accountService.secret();

    const { password: encryptedPassword, iv } = await this.encrypt(
      password,
      secret,
    );

    return await this.passwordModel.create({
      ...rest,
      password: encryptedPassword,
      iv,
    });
  }

  async findAll() {
    const passwords = await this.passwordModel.find({}).exec();

    const secret = await this.accountService.secret();

    return await this.decrypt(passwords, secret);
  }

  async findByFolder(folder: string) {
    const passwords = await this.passwordModel.find({ folder }).exec();

    const secret = await this.accountService.secret();

    return await this.decrypt(passwords, secret);
  }
}
