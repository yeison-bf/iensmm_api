import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Institution } from '../../institutions/entities/institution.entity';

@Entity('rating')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  letterValue: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  minRange: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  maxRange: number;

  @Column({ type: 'int' })
  year: number;

  @ManyToOne(() => Institution, institution => institution.ratings)
  @JoinColumn({ name: 'institutionId' })
  institution: Institution;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}