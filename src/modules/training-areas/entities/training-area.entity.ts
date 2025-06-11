import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TrainingCore } from '../../training-cores/entities/training-core.entity';
import { AcademicThinkingDetail } from 'src/modules/academic-thinking/entities/academic-thinking-detail.entity';
import { StudentAttendance } from 'src/modules/student-attendance/entities/student-attendance.entity';

@Entity('training_areas')
export class TrainingArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  name: string;

  @Column({ name: 'institution_id' })
  institution: number;

  @Column({ 
    name: 'training_core_id', 
    nullable: true, // Esto permite NULL en la base de datos
    default: null   // Establece NULL como valor por defecto
  })
  trainingCoreId: number | null; // Tipo explícito para aceptar null

  @Column({
    type: 'int',
    nullable: true,
    name: 'program_id',
  })
  programId: number;


  @ManyToOne(() => TrainingCore, trainingCore => trainingCore.trainingAreas, { eager: true, nullable: true })
  @JoinColumn({ name: 'training_core_id' })
  trainingCore: TrainingCore | null; // Acepta null


  @OneToMany(() => AcademicThinkingDetail, detail => detail.trainingArea)
  academicThinkingDetails: AcademicThinkingDetail[];

  @OneToMany(() => StudentAttendance, attendance => attendance.trainingArea)
  attendances: StudentAttendance[];


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}