import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AcademicThinkingDetail } from '../../academic-thinking/entities/academic-thinking-detail.entity';
import { StudentEnrollment } from '../../student-enrollment/entities/student-enrollment.entity';
import { Administrator } from 'src/modules/administrators/entities/administrator.entity';
import { Headquarters } from 'src/modules/headquarters/entities/headquarters.entity';

@Entity('academic_assignments')
export class AcademicAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @ManyToOne(() => Headquarters, { nullable: false })
  @JoinColumn({ name: 'headquarters_id' })
  headquarters: Headquarters;

  @ManyToOne(() => Administrator, { nullable: false })
  @JoinColumn({ name: 'administrator_id' })
  administrator: Administrator;

  @ManyToOne(() => AcademicThinkingDetail, { nullable: false })
  @JoinColumn({ name: 'academic_thinking_detail_id' })
  academicThinkingDetail: AcademicThinkingDetail;

  @ManyToOne(() => StudentEnrollment, { nullable: false })
  @JoinColumn({ name: 'student_enrollment_id' })
  studentEnrollment: StudentEnrollment;

  @Column({ default: true })
  status: boolean;

  @Column({ name: 'closing_date', type: 'timestamp', nullable: true })
  closingDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}