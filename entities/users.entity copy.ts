import { Column, Entity, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { SharedProp } from './sharedProp.entity';
import { PostsEntity } from './posts.entites';

export type UserType = 'admin' | 'user';

@Entity({ name: 'users' })
export class UsersEntity extends SharedProp {
  constructor(
    name: string,
    lastName: string,
    email: string,
    password: string,
    salt: string,
    birthOfDate?: Date,
    type?: UserType
  ) {
    super();
   
  }
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  
  // @OneToMany(() => PostsEntity, (post: PostsEntity) => post.user, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // posts: Array<PostsEntity>;

  
}

/**
 * for the `type` use enum like this in mysql or postgres
 * enum UserType {
 *      user = 'user',
 *      admin = 'admin
 * }
 * @Column({ default: UserType.user, enum: UserType, type: 'enum' })
 * type: UserType;
 *
 */
