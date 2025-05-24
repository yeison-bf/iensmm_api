import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Attendant } from 'src/modules/attendants/entities/attendant.entity';
import { StudentEnrollment } from 'src/modules/student-enrollment/entities/student-enrollment.entity';

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


  @Column({ type: 'varchar', length: 100, nullable: true })
  expeditionDepartment: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  expeditionCity: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  zone: string;

  @Column({ type: 'int', nullable: true })
  stratum: number;

  @Column({ type: 'boolean', nullable: true, default: null })
  sisben: boolean;

  @Column({ type: 'varchar',  nullable: true })
  sisbenScore: string;

  @Column({ type: 'boolean', nullable: true, default: null })
  armedConflictVictim: boolean;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ name: 'headquarter_id', type: 'int', nullable: false })
  headquarterId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Attendant, attendant => attendant.student)
  attendants: Attendant[];

  @Column({ 
    type: 'int', 
    nullable: true, 
    name: 'program_id',
  })
  programId: number;

  @Column({ 
    type: 'int', 
    nullable: true, 
    name: 'institution_id',
  })
  institution: number;


  @OneToMany(() => StudentEnrollment, enrollment => enrollment.student)
  enrollments: StudentEnrollment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}