import {
    IsString,
    IsEmail,
    IsOptional,
    IsInt,
    IsUrl,
} from 'class-validator';
import {
    Entity,
    Column,
    CreateDateColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Rating } from 'src/modules/ratings/entities/rating.entity';
import { Period } from 'src/modules/periods/entities/period.entity';
import { Headquarters } from 'src/modules/headquarters/entities/headquarters.entity';

@Entity('institution')
export class Institution {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    @IsString()
    daneCode: string;

    @Column({ type: 'varchar', length: 20 })
    @IsString()
    nit: string;

    @Column({ type: 'varchar', length: 20 })
    @IsString()
    icfesCode: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    name: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    address: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    neighborhood: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    department: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    city: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    zone: string;

    @Column({ type: 'varchar', length: 15 })
    @IsString()
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsUrl()
    website?: string;

    @Column({ type: 'varchar', length: 255 })
    @IsEmail()
    email: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    sector: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    nucleus: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    territorialEntity: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    calendar: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    schedule: string;

    @Column({ type: 'int' })
    @IsInt()
    numberOfHeadquarters: number;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    servedPopulationGender: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    resolution: string;

    @Column({ type: 'boolean', default: false })
    fullTimeSchedule: boolean;

    @Column({ type: 'boolean', default: false })
    morningSchedule: boolean;

    @Column({ type: 'boolean', default: false })
    afternoonSchedule: boolean;

    @Column({ type: 'boolean', default: false })
    nightSchedule: boolean;

    @Column({ type: 'boolean', default: false })
    weekendSchedule: boolean;

    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsString()
    @IsOptional()
    legalProperty: string;

    @Column({ type: 'boolean', default: false })
    hasSubsidizedQuotas: boolean;

    @Column({ type: 'boolean', default: false })
    hasExceptionalEducation: boolean;

    @Column({ type: 'boolean', default: false })
    hasEthnicEducation: boolean;

    @Column({ type: 'boolean', default: false })
    hasDisabilityEducation: boolean;

    @Column({ type: 'boolean', default: false })
    hasIndigenousReservation: boolean;


    
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    flagImg?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    shieldImg?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    idCardModelImg?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    letterheadImg?: string;




    
    @OneToMany(() => Headquarters, (headquarters) => headquarters.institution)
    headquarters: Headquarters[];

    @OneToMany(() => Rating, rating => rating.institution)
    ratings: Rating[];

    @OneToMany(() => Period, period => period.institution)
    periods: Period[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}