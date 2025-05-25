import { AcademicAssignment } from 'src/modules/academic-assignment/entities/academic-assignment.entity';
import { StudentEnrollment } from 'src/modules/student-enrollment/entities/student-enrollment.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('group')
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;


    @OneToMany(() => StudentEnrollment, enrollment => enrollment.group)
    enrollments: StudentEnrollment[];

    
  @OneToMany(() => AcademicAssignment, assignment => assignment.group)
  academicAssignments: AcademicAssignment[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}