import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { AcademicAssignment } from './academic-assignment.entity';
import { AcademicThinkingDetail } from '../../academic-thinking/entities/academic-thinking-detail.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';

@Entity('academic_assignment_details')
export class AcademicAssignmentDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'academic_assignment_id' })
  academicAssignmentId: number;

  @Column({ name: 'academic_thinking_detail_id' })
  academicThinkingDetailId: number;

  @Column({ name: 'administrator_id' })
  administratorId: number;

  @ManyToOne(() => AcademicAssignment, assignment => assignment.details)
  @JoinColumn({ name: 'academic_assignment_id' })
  academicAssignment: AcademicAssignment;

  @ManyToOne(() => AcademicThinkingDetail)
  @JoinColumn({ name: 'academic_thinking_detail_id' })
  academicThinkingDetail: AcademicThinkingDetail;

  @ManyToOne(() => Administrator)
  @JoinColumn({ name: 'administrator_id' })
  administrator: Administrator;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}