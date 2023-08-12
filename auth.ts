import { Request, ResponseToolkit } from '@hapi/hapi';
import { Connection, Repository, getConnection } from 'typeorm';
import { compare, hash, genSalt } from 'bcrypt';
import { UsersEntity } from './entities';

export const validateJWT = () => {
  const con = getConnection('default');
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return async (
    { id }: Partial<UsersEntity>,
    request: Request,
    h: ResponseToolkit
  ) => {
    const user: UsersEntity = await userRepo.findOne({ where: { id: id}});
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: { user } };
  };
};

export const validateBasic = () => {
  const con = getConnection('default');
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return async (
    request: Request,
    username: string,
    password: string,
    h: ResponseToolkit
  ) => {
    const user: UsersEntity = await userRepo.findOne({ where: { email: username}});
    if (!user) {
      return { credentials: null, isValid: false };
    }
    const isValid = (await hash(password, user.salt)) === user.password;
    delete user.password;
    delete user.salt;
    // credentials - a credentials object passed back to the application in `request.auth.credentials`.
    return { isValid: isValid, credentials: user };
  };
};
