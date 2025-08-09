import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    recipients: string; // Nombres separados por punto y coma

    @Column()
    subject: string;

    @Column('text')
    body: string;

    @Column()
    timestamp: Date;

    @Column()
    totalRecipients: number;

    @Column({ default: true })
    status: boolean;

    @Column()
    instiution: number;


    @CreateDateColumn()
    createdAt: Date;
}