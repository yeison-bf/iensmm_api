import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'varchar', length: 5 })
  bloodType: string;

  @Column({ type: 'varchar', length: 100 })
  birthDepartment: string;

  @Column({ type: 'varchar', length: 100 })
  birthCity: string;

  @Column({ type: 'varchar', length: 100 })
  population: string;

  @Column({ type: 'boolean', default: false })
  disability: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  disabilityType: string;

  @Column({ type: 'varchar', length: 100 })
  healthProvider: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}