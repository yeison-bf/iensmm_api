import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { HeadquartersModule } from './modules/headquarters/headquarters.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { PeriodsModule } from './modules/periods/periods.module';
import { PeriodDetailsModule } from './modules/period-details/period-details.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { StudentsModule } from './modules/students/students.module';
import { AdministratorsModule } from './modules/administrators/administrators.module';
import { AdministratorTypeModule } from './modules/administrator-type/administrator-type.module';
import { AttendantsModule } from './modules/attendants/attendants.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { DegreesModule } from './modules/degrees/degrees.module';
import { GroupModule } from './modules/group/group.module';
import { StudentEnrollmentModule } from './modules/student-enrollment/student-enrollment.module';
import { TrainingCoresModule } from './modules/training-cores/training-cores.module';
import { TrainingAreasModule } from './modules/training-areas/training-areas.module';
import { AcademicThinkingModule } from './modules/academic-thinking/academic-thinking.module';
import { AcademicAssignmentModule } from './modules/academic-assignment/academic-assignment.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { AssistanceModule } from './modules/assistance/assistance.module';
import { StudentGradesModule } from './modules/student-grades/student-grades.module';
import { StudentAttendanceModule } from './modules/student-attendance/student-attendance.module';
import { MailModule } from './mail/mail.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { AchievementDetailsModule } from './modules/achievement-details/achievement-details.module';
import { SchedulesModule } from './modules/schedules/schedules.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', 'config', 'env', `${process.env.NODE_ENV || 'dev'}.env`),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [join(__dirname, '**', '*.{ts,js}')],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        logging: configService.get<boolean>('DB_LOGGING'),
        ssl: configService.get<string>('DB_SSL') === 'true' ? 
          { rejectUnauthorized: false } : 
          false,
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: configService.get<number>('EMAIL_PORT') === 465,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    RolesModule,
    UsersModule,
    InstitutionsModule,
    HeadquartersModule,
    RatingsModule,
    PeriodsModule,
    PeriodDetailsModule,
    DocumentTypeModule,
    StudentsModule,
    AdministratorsModule,
    AdministratorTypeModule,
    AttendantsModule,
    TransfersModule,
    DegreesModule,
    GroupModule,
    StudentEnrollmentModule,
    TrainingCoresModule,
    TrainingAreasModule,
    AcademicThinkingModule,
    AcademicAssignmentModule,
    ProgramsModule,
    AssistanceModule,
    StudentGradesModule,
    StudentAttendanceModule,
    MailModule,
    AchievementsModule,
    AchievementDetailsModule,
    SchedulesModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
