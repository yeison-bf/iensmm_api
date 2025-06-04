import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { TrainingArea } from 'src/modules/training-areas/entities/training-area.entity';

@Entity('student_attendance')
export class StudentAttendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean', default: false })
  attended: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observations: string;

  // Relaciones existentes
  @ManyToOne(() => Student, student => student.attendances)
  student: Student;

  @Column({ name: 'student_id' })
  studentId: number;

  @ManyToOne(() => TrainingArea, trainingArea => trainingArea.attendances)
  trainingArea: TrainingArea;

  @Column({ name: 'training_area_id' })
  trainingAreaId: number;

  // Campos adicionales sin relación
  @Column({ name: 'administrator_id' })
  administratorId: number;

  @Column({ name: 'degree_id' })
  degreeId: number;

  @Column({ name: 'group_id' })
  groupId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}