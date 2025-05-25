import { User } from 'src/modules/users/entities/user.entity';
import { Institution } from '../../../modules/institutions/entities/institution.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { AcademicThinking } from 'src/modules/academic-thinking/entities/academic-thinking.entity';
import { AcademicAssignment } from 'src/modules/academic-assignment/entities/academic-assignment.entity';

@Entity('headquarters')
export class Headquarters {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column({ type: 'varchar', length: 2000, })
  icon: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  daneCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  zone: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 15 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 2555, nullable: false })
  avatar: string;

  @ManyToOne(() => Institution, (institution) => institution.headquarters, {
    nullable: false,
  })
  @JoinColumn({ name: 'institutionId' })
  institution: Institution;

  @ManyToMany(() => User, (user) => user.headquarters)
  users: User[];

  @OneToMany(() => AcademicThinking, academicThinking => academicThinking.headquarters)
  academicThinkings: AcademicThinking[];

  @OneToMany(() => AcademicAssignment, assignment => assignment.headquarters)
  academicAssignments: AcademicAssignment[];
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}