import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AdministratorType } from '../../administrator-type/entities/administrator-type.entity';
import { AcademicAssignment } from 'src/modules/academic-assignment/entities/academic-assignment.entity';
import { AdministratorTypeProgram } from 'src/modules/administrator-type/entities/administrator_type_program.entity';

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

  @ManyToMany(() => AdministratorType, administratorType => administratorType.administrators)
  @JoinTable({
    name: 'administrator_administrator_type',
    joinColumn: {
      name: 'administrator_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'administrator_type_id',
      referencedColumnName: 'id'
    }
  })
  administratorTypes: AdministratorType[];


  @OneToMany(() => AdministratorTypeProgram, atp => atp.administrator)
  administratorTypePrograms: AdministratorTypeProgram[];


  @OneToOne(() => User, user => user.administrator)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 50 })
  scalafon: string;

  @Column({ type: 'varchar', length: 100 })
  appointmentResolution: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => AcademicAssignment, assignment => assignment.administrator)
  academicAssignments: AcademicAssignment[];
}