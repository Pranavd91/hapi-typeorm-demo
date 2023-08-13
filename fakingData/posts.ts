import { faker } from '@faker-js/faker';
import { Connection, Repository, getConnection } from 'typeorm';
import { PostsEntity, UsersEntity } from '../entities';
import 'colors';
import { get } from 'node-emoji';

export const fakePosts = async (amount: number = 50) => {
  const con = getConnection('default');
  const postRepo: Repository<PostsEntity> = con.getRepository(PostsEntity);
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  const users: Array<UsersEntity> = await userRepo.find(); // pass { take: number }
  for (const user of users) {
    const shouldWeCreate: boolean = true;
    if (shouldWeCreate) {
      const title = faker.internet.userName();
      const body = faker.lorem.paragraphs();
      const title2 = faker.internet.userName();
      const body2 = faker.lorem.paragraphs();
      const p: Partial<PostsEntity> = new PostsEntity(title, body,1);
      p.user = user;
      const p2: Partial<PostsEntity> = new PostsEntity(title2, body2,2);
      p2.user = user;
      await postRepo.save<Partial<PostsEntity>>(p);
      await postRepo.save<Partial<PostsEntity>>(p2);
    }
  }
  const emoji = get('white_check_mark');
  console.log(emoji, `Created ${amount} posts`.magenta.bold, emoji);
};
