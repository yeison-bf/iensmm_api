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


    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}