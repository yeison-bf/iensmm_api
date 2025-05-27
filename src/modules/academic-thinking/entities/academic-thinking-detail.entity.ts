import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AcademicThinking } from './academic-thinking.entity';
import { TrainingArea } from '../../training-areas/entities/training-area.entity';
import { AcademicAssignment } from 'src/modules/academic-assignment/entities/academic-assignment.entity';
import { AcademicAssignmentDetail } from 'src/modules/academic-assignment/entities/academic-assignment-detail.entity';
import { StudentGrade } from 'src/modules/student-grades/entities/student-grade.entity';

@Entity('academic_thinking_details')
export class AcademicThinkingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'hourly_intensity' })
  hourlyIntensity: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @ManyToOne(() => TrainingArea)
  @JoinColumn({ name: 'training_area_id' })
  trainingArea: TrainingArea;

  @ManyToOne(() => AcademicThinking, academicThinking => academicThinking.details, {
    nullable: false
  })
  @JoinColumn({ name: 'academic_thinking_id' })
  academicThinking: AcademicThinking;


  @OneToMany(() => AcademicAssignmentDetail, detail => detail.academicThinkingDetail)
  academicAssignmentDetails: AcademicAssignmentDetail[];

  @OneToMany(() => StudentGrade, grade => grade.academicThinkingDetail)
  grades: StudentGrade[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}