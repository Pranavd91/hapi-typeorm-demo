import { Repository, getConnection } from 'typeorm';
import { sign } from 'jsonwebtoken';
const Joi = require('@hapi/joi');
import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import { UsersEntity } from '../../entities/users.entity';
import * as bcrypt from 'bcryptjs';

export const authController = (): Array<ServerRoute> => {
  const con = getConnection('default');
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [
    {
      method: 'POST',
      path: '/login',
      async handler({ auth: { credentials } }: Request) {
        return {
          ...credentials,
          accessToken: sign({ ...credentials }, 'getMeFromEnvFile'),
        };
      },
      options: {
        auth: {
          strategy: 'simple',
        },
      },
    },
    {
      method: 'POST',
      path: '/register',
      async handler({ payload }: Request) {
        try {
          let {
            firstName,
            lastName,
            email,
            password,
            birthOfDate,
          } = payload as Partial<UsersEntity>;
          const salt = await bcrypt.genSalt();
          password = await bcrypt.hash(password, salt);
          const u = new UsersEntity(
            firstName,
            lastName,
            email,
            password,
            salt,
            birthOfDate
          );
          await userRepo.save(u);
          delete u.password;
          delete u.salt;
          return {
            user: u,
            accessToken: sign({ ...u }, 'getMeFromEnvFile'),
          };
        } catch (error) {
          console.error(error);
          return { err: 'something went wrong :(' };
        }
      },
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required().max(250).min(3),
            lastName: Joi.string().required().max(250).min(3),
            email: Joi.string().required().max(250).min(4),
            birthOfDate: Joi.date().optional().min('1950-01-01').max('2010-01-01'),
            password: Joi.string().required().min(5).max(15),
          }) as any,
          failAction(request: Request, h: ResponseToolkit, err: Error) {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
      },
    },
  ];
};
