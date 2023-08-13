import { faker } from '@faker-js/faker';
import { Connection, Repository, getConnection } from 'typeorm';
import { UsersEntity, UserType } from '../entities';
import 'colors';
import { get } from 'node-emoji';
import { genSalt, hash } from 'bcrypt';

export const fakeUsers = async (amount: number = 50) => {
  const con = getConnection('default');
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  for (const _ of Array.from({ length: amount })) {
    const firstName = faker.string.uuid();
    const lastName = faker.internet.userName();
    const birthOfDate = faker.date.birthdate();
    const email = faker.internet.email();
    const type: UserType = 'user';
    const salt = await genSalt();
    const password = await hash('secret', salt);
    const u: Partial<UsersEntity> = new UsersEntity(
      firstName,
      lastName,
      email,
      password,
      salt,
      birthOfDate,
      type
    );
    await userRepo.save<Partial<UsersEntity>>(u);
  }
  const emoji = get('white_check_mark');
  console.log(emoji, `Created ${amount} users`.magenta.bold, emoji);
};
