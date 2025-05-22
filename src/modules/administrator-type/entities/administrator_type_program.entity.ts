import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdministratorType } from '../../administrator-type/entities/administrator-type.entity';
import { Program } from '../../programs/entities/program.entity';
import { Administrator } from 'src/modules/administrators/entities/administrator.entity';

@Entity('administrator_type_program')
export class AdministratorTypeProgram {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Administrator)
  @JoinColumn({ name: 'administrator_id' })
  administrator: Administrator;

  @ManyToOne(() => AdministratorType)
  @JoinColumn({ name: 'administrator_type_id' })
  administratorType: AdministratorType;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: true })
  status: boolean;
}