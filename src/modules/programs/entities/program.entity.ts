import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { AdministratorType } from '../../administrator-type/entities/administrator-type.entity';
import { StudentEnrollment } from 'src/modules/student-enrollment/entities/student-enrollment.entity';

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToMany(() => AdministratorType)
  @JoinTable({
    name: 'program_administrator_type',
    joinColumn: {
      name: 'program_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'administrator_type_id',
      referencedColumnName: 'id'
    }
  })
  administratorTypes: AdministratorType[];


  @OneToMany(() => StudentEnrollment, enrollment => enrollment.program)
  enrollments: StudentEnrollment[];

}