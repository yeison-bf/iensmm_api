import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToOne, OneToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { DocumentType } from '../../document-type/entities/document-type.entity';
import { Headquarters } from '../../headquarters/entities/headquarters.entity';
import { Student } from 'src/modules/students/entities/student.entity';
import { Administrator } from 'src/modules/administrators/entities/administrator.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 50 })
  document: string;

  @Column({ type: 'varchar', length: 100 })
  notificationEmail: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'char', length: 1 })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photoUrl: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'varchar', length: 255, nullable: true })
  TeacherSignature: string;

  @ManyToOne(() => DocumentType)
  @JoinColumn({ name: 'documentTypeId' })
  documentType: DocumentType;

  @ManyToMany(() => Headquarters)
  @JoinTable({
    name: 'user_headquarters',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'headquarterId',
      referencedColumnName: 'id',
    },
  })
  headquarters: Headquarters[];

  @OneToOne(() => Student, student => student.user)
  student: Student;

  @OneToOne(() => Administrator, administrator => administrator.user)
  administrator: Administrator;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 50 })
  birthDate: string;

  @Column({ type: 'int' })
  institution: number;

}