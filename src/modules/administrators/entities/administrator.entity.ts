import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AdministratorType } from '../../administrator-type/entities/administrator-type.entity';
import { AcademicAssignment } from 'src/modules/academic-assignment/entities/academic-assignment.entity';

@Entity('administrators')
export class Administrator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  academicTitle: string;

  @Column({ type: 'varchar', length: 100 })
  trainingArea: string;

  @Column({ type: 'varchar', length: 50 })
  maritalStatus: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', length: 100 })
  teachingLevel: string;

  @Column({ type: 'varchar', length: 50 })
  contractType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  signature: string;

  @ManyToOne(() => AdministratorType)
  @JoinColumn({ name: 'administratorTypeId' })
  administratorType: AdministratorType;

  @OneToOne(() => User, user => user.administrator)
  @JoinColumn()
  user: User;

  @Column()
  administratorTypeId: number;

  @Column({ type: 'varchar', length: 50 })
  scalafon: string;  // Grado de escalafón

  @Column({ type: 'varchar', length: 100 })
  appointmentResolution: string;  // Resolución de nombramiento

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => AcademicAssignment, assignment => assignment.administrator)
  academicAssignments: AcademicAssignment[];

}