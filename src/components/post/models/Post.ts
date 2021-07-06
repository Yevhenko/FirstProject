import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@components/user';
import { Comment } from '@components/comment';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 101 })
  title!: string;

  @Column({ length: 100 })
  text!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
