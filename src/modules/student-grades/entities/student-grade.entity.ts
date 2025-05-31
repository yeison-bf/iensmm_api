import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StudentEnrollment } from '../../student-enrollment/entities/student-enrollment.entity';
import { AcademicThinkingDetail } from '../../academic-thinking/entities/academic-thinking-detail.entity';
import { Period } from '../../periods/entities/period.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { PeriodDetail } from 'src/modules/period-details/entities/period-detail.entity';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

@Entity('student_grades')
export class StudentGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 3, scale: 2 })
  numericalGrade: number;

  @Column()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  degreeId: number;

  @Column()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  groupId: number;

  @Column({ length: 20 })
  qualitativeGrade: string;

  @Column('decimal', { precision: 3, scale: 2 })
  disciplineGrade: number;

  @Column({ type: 'text', nullable: true })
  observations: string;


  @Column({ type: 'date' })
  closingDate: Date;

  // Nueva columna status con valor por defecto false
  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column()
  studentEnrollmentId: number;

  @Column()
  academicThinkingDetailId: number;

  @Column()
  periodDetailId: number;  // Changed from periodId

  @Column()
  teacherId: number;

  @ManyToOne(() => StudentEnrollment)
  @JoinColumn({ name: 'studentEnrollmentId' })
  studentEnrollment: StudentEnrollment;

  @ManyToOne(() => AcademicThinkingDetail)
  @JoinColumn({ name: 'academicThinkingDetailId' })
  academicThinkingDetail: AcademicThinkingDetail;


  @ManyToOne(() => PeriodDetail)
  @JoinColumn({ name: 'periodDetailId' })  // Changed from periodId
  periodDetail: PeriodDetail;  // Changed from period: Period


  @ManyToOne(() => Administrator)
  @JoinColumn({ name: 'teacherId' })
  teacher: Administrator;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}