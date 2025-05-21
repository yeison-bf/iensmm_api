import { TrainingArea } from 'src/modules/training-areas/entities/training-area.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('training_cores')
export class TrainingCore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'varchar', 
    length: 1000, 
    unique: true,
    nullable: false 
  })
  name: string;

  @Column({ name: 'institution_id' })
  institution: number;

  @OneToMany(() => TrainingArea, trainingArea => trainingArea.trainingCore)
  trainingAreas: TrainingArea[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}