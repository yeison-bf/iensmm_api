import { Degree } from 'src/modules/degrees/entities/degree.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urlImagen: string;

  @ManyToOne(() => Degree, degree => degree.schedules, { eager: true })
  @JoinColumn({ name: 'degreeId' })
  degree: Degree;

  @Column()
  anio: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
