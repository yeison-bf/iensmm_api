import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Group } from '../../group/entities/group.entity';
import { Degree } from '../../degrees/entities/degree.entity';
import { AcademicAssignment } from 'src/modules/academic-assignment/entities/academic-assignment.entity';

@Entity('student_enrollment')
export class StudentEnrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  schedule: string; // jornada

  @Column({ type: 'varchar', length: 50 })
  folio: string;

  @Column({ type: 'date' })
  registrationDate: Date;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @ManyToOne(() => Group, group => group.enrollments)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ManyToOne(() => Degree, degree => degree.enrollments)
  @JoinColumn({ name: 'degreeId' })
  degree: Degree;

  @ManyToOne(() => Student, student => student.enrollments)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ name: 'headquarter_id', type: 'int', nullable: false })
  headquarterId: number;

  @Column({ name: 'institution_id', type: 'int', nullable: false })
  institutionId: number;

  @OneToMany(() => AcademicAssignment, assignment => assignment.studentEnrollment)
  academicAssignments: AcademicAssignment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}