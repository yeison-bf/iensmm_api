import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TrainingCore } from '../../training-cores/entities/training-core.entity';
import { AcademicThinkingDetail } from 'src/modules/academic-thinking/entities/academic-thinking-detail.entity';

@Entity('training_areas')
export class TrainingArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  name: string;

  @Column({ name: 'institution_id' })
  institution: number;

  @Column({ name: 'training_core_id', nullable: true })
  trainingCoreId: number;

  @ManyToOne(() => TrainingCore, trainingCore => trainingCore.trainingAreas, { eager: true })
  @JoinColumn({ name: 'training_core_id' })
  trainingCore: TrainingCore;


  @OneToMany(() => AcademicThinkingDetail, detail => detail.trainingArea)
  academicThinkingDetails: AcademicThinkingDetail[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}