import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Period } from '../../periods/entities/period.entity';
import { StudentGrade } from 'src/modules/student-grades/entities/student-grade.entity';

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
}