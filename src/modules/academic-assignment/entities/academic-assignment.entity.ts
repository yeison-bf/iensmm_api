import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Degree } from '../../degrees/entities/degree.entity';
import { Headquarters } from '../../headquarters/entities/headquarters.entity';
import { AcademicAssignmentDetail } from './academic-assignment-detail.entity';
import { Program } from 'src/modules/programs/entities/program.entity';
import { Group } from 'src/modules/group/entities/group.entity';

@Entity('academic_assignments')
export class AcademicAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ name: 'degree_id' })
  degreeId: number;

  @Column({ name: 'headquarter_id' })
  headquarterId: number;
  
  @Column({ name: 'program_id' })
  programId: number;

  @Column({ name: 'group_id' })
  groupId: number;

  @ManyToOne(() => Degree)
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;

  @ManyToOne(() => Headquarters)
  @JoinColumn({ name: 'headquarter_id' })
  headquarters: Headquarters;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(() => AcademicAssignmentDetail, detail => detail.academicAssignment)
  details: AcademicAssignmentDetail[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}