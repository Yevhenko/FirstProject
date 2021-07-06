import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from '@components/post';
import { User } from '@components/user';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  text!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Post, (post) => post.comments, { eager: true, cascade: true })
  @JoinColumn()
  post!: Post;

  @ManyToOne(() => User, (user) => user.comments, { eager: true, cascade: true })
  @JoinColumn()
  user!: User;
}
