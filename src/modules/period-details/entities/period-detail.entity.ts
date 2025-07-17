import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Period } from '../../periods/entities/period.entity';
import { StudentGrade } from 'src/modules/student-grades/entities/student-grade.entity';
import { Achievement } from 'src/modules/achievements/entities/achievement.entity';

@Entity('period_detail')
export class PeriodDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'date', nullable: true })
  closeDate: Date;

  @ManyToOne(() => Period, period => period.periodDetails)
  @JoinColumn({ name: 'periodId' })
  period: Period;

  @OneToMany(() => StudentGrade, grade => grade.periodDetail)
  grades: StudentGrade[];


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Achievement, achievement => achievement.periodDetail)
  achievements: Achievement[];

  
  @Column({ type: 'date' })
  startDateLeveling: Date;
  
  @Column({ type: 'date' })
  endDateLeveling: Date;
  
  @Column({ type: 'boolean', default: false })
  hasRecovery: boolean; // ¿Tiene recuperación?
  
  @Column({ type: 'boolean', default: false })
  hasLeveling: boolean; // ¿Tiene nivelación?
  
  @Column({ type: 'boolean', default: false })
  habilited: boolean; // ¿Tiene nivelación?

}