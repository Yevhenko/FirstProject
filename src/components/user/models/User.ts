import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from '@components/post';
import { Comment } from '@components/comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 101 })
  login!: string;

  @Column({ length: 100 })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];
}
