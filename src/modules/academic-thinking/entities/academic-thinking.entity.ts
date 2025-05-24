import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AcademicThinkingDetail } from './academic-thinking-detail.entity';
import { Headquarters } from '../../headquarters/entities/headquarters.entity';
import { Degree } from 'src/modules/degrees/entities/degree.entity';

@Entity('academic_thinking')
export class AcademicThinking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column({ name: 'headquarters_id' })
  headquarterId: number;

  @Column({ name: 'grade_id' })
  gradeId: number;

  @ManyToOne(() => Headquarters)
  @JoinColumn({ name: 'headquarters_id' })
  headquarters: Headquarters;

  @ManyToOne(() => Degree)
  @JoinColumn({ name: 'grade_id' })
  degree: Degree;

  
  @Column({ 
    type: 'int', 
    nullable: true, 
    name: 'program_id',
  })
  programId: number;

  
  @OneToMany(() => AcademicThinkingDetail, detail => detail.academicThinking)
  details: AcademicThinkingDetail[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}