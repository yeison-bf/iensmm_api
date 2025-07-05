import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { Degree } from '../../degrees/entities/degree.entity';
import { TrainingArea } from '../../training-areas/entities/training-area.entity';
import { PeriodDetail } from '../../period-details/entities/period-detail.entity';
import { AchievementDetail } from '../../achievement-details/entities/achievement-detail.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column('text')
  competence: string;

  @Column('text')
  aspect: string;

  @ManyToOne(() => Administrator, { nullable: false })
  administrator: Administrator;

  @ManyToOne(() => Degree, { nullable: false })
  degree: Degree;

  @ManyToOne(() => TrainingArea, { nullable: false })
  trainingArea: TrainingArea;

  @ManyToOne(() => PeriodDetail, { nullable: false })
  periodDetail: PeriodDetail;

  @OneToMany(() => AchievementDetail, detail => detail.achievement)
  details: AchievementDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}