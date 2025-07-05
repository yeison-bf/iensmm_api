import { AcademicAssignment } from 'src/modules/academic-assignment/entities/academic-assignment.entity';
import { AcademicThinking } from 'src/modules/academic-thinking/entities/academic-thinking.entity';
import { Achievement } from 'src/modules/achievements/entities/achievement.entity';
import { StudentEnrollment } from 'src/modules/student-enrollment/entities/student-enrollment.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('degree')
export class Degree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  value: Number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  program: string;

  @Column({ 
    type: 'int', 
    nullable: true, 
    name: 'program_number',
  })
  programId: number;

  @Column({ 
    type: 'int', 
    nullable: true, 
    name: 'institution_id',
  })
  institutionId: number;

  @OneToMany(() => AcademicAssignment, assignment => assignment.degree)
  academicAssignments: AcademicAssignment[];

  @OneToMany(() => StudentEnrollment, enrollment => enrollment.degree)
  enrollments: StudentEnrollment[];

  @OneToMany(() => AcademicThinking, academicThinking => academicThinking.degree)
  academicThinkings: AcademicThinking[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Achievement, achievement => achievement.degree)
  achievements: Achievement[];

}