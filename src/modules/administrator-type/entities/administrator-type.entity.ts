import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('administrator_type')
export class AdministratorType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;
}