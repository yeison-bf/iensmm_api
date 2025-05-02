import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Institution } from '../../institutions/entities/institution.entity';
import { PeriodDetail } from 'src/modules/period-details/entities/period-detail.entity';

@Entity('period')
export class Period {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  year: number;

  @Column({ type: 'int' })
  periodsQuantity: number;

  @ManyToOne(() => Institution, institution => institution.periods)
  @JoinColumn({ name: 'institutionId' })
  institution: Institution;

  @OneToMany(() => PeriodDetail, periodDetail => periodDetail.period)
  periodDetails: PeriodDetail[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}