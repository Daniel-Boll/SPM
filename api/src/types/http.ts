import { User } from 'src/modules/user/entities/user.entity';
import { Request } from 'express';

export type RequestWithUser = Request & { user: User };
