import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Achievement } from '../../achievements/entities/achievement.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity()
export class AchievementDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  description: string;

  @ManyToOne(() => Achievement, achievement => achievement.details, { nullable: false })
  achievement: Achievement;

  @ManyToOne(() => Rating, { nullable: false })
  rating: Rating;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}