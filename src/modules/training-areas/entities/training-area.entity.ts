import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TrainingCore } from '../../training-cores/entities/training-core.entity';

@Entity('training_areas')
export class TrainingArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'institution_id' })
  institution: number;

  @ManyToOne(() => TrainingCore)  // Removemos { eager: true }
  @JoinColumn({ name: 'training_core_id' })
  trainingCore: TrainingCore;
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}