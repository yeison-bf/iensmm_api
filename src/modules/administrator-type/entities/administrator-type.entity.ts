import { Administrator } from 'src/modules/administrators/entities/administrator.entity';
import { Program } from 'src/modules/programs/entities/program.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('administrator_type')
export class AdministratorType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;
  
  @ManyToMany(() => Administrator, administrator => administrator.administratorTypes)
  administrators: Administrator[];

  @ManyToMany(() => Program, program => program.administratorTypes)
  programs: Program[];
}