import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Headquarters } from '../headquarters/entities/headquarters.entity';
import { Role } from '../roles/entities/role.entity';
import { DocumentType } from '../document-type/entities/document-type.entity';
import { Student } from '../students/entities/student.entity';
import { CreateUserWithStudentDto } from './dto/create-user-with-student.dto';
import { CreateUserWithAdministratorDto } from './dto/create-user-with-administrator.dto';
import { Administrator } from '../administrators/entities/administrator.entity';
import * as jwt from 'jsonwebtoken';
import { BulkCreateStudentDto } from './dto/bulk-create-students.dto';
import { StudentEnrollmentService } from '../student-enrollment/student-enrollment.service';
import { Group } from '../group/entities/group.entity';
import { Degree } from '../degrees/entities/degree.entity';
import { AdministratorTypeProgram } from '../administrator-type/entities/administrator_type_program.entity';
import { AdministratorType } from '../administrator-type/entities/administrator-type.entity';
import { Program } from '../programs/entities/program.entity';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Headquarters)
    private readonly headquarterRepository: Repository<Headquarters>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,

    private readonly enrollmentService: StudentEnrollmentService,

    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,

    @InjectRepository(AdministratorTypeProgram)
    private readonly administratorTypeProgramRepository: Repository<AdministratorTypeProgram>,

    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,



    @InjectRepository(AdministratorType)
    private readonly administratorTypeRepository: Repository<AdministratorType>,


    private readonly mailService: MailService


  ) { }



  async notificarUsuario(email: string, nombre: string, message: string) {
    const contenido = `
      <h1>Hola ${nombre}</h1>
      <p>${message}</p>
    `;
    await this.mailService.sendMail(email, 'Notificación de Edunormas', contenido);
  }



  async create(createUserDto: CreateUserDto) {
    try {
      const { headquarterIds, roleId, documentTypeId, ...userData } = createUserDto;

      // Fetch role
      const role = await this.roleRepository.findOne({
        where: { id: roleId }
      });
      if (!role) {
        return {
          success: false,
          message: 'Role not found',
          data: null,
        };
      }

      // Fetch document type
      const documentType = await this.documentTypeRepository.findOne({
        where: { id: documentTypeId }
      });
      if (!documentType) {
        return {
          success: false,
          message: 'Document type not found',
          data: null,
        };
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
        role,
        documentType,
      });

      // If headquarters were provided, fetch and assign them
      if (headquarterIds && headquarterIds.length > 0) {
        const headquarters = await this.headquarterRepository.findByIds(headquarterIds);
        if (headquarters.length !== headquarterIds.length) {
          return {
            success: false,
            message: 'One or more headquarters not found',
            data: null,
          };
        }
        user.headquarters = headquarters;
      }

      const savedUser = await this.userRepository.save(user);

      // Fetch the complete user with all relations
      const completeUser = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['role', 'documentType', 'headquarters'],
        select: {
          password: false,
        },
      });

      return {
        success: true,
        message: 'User created successfully',
        data: completeUser,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating user: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        relations: ['role', 'documentType', 'headquarters'],
        select: {
          password: false,
        },
      });

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving users: ${error.message}`,
        data: null,
      };
    }
  }
















  async findAllStudents(
    headquarterId?: number,
    programId?: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.student', 'student')
        .leftJoinAndSelect('student.enrollments', 'enrollments')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.documentType', 'documentType')
        .leftJoinAndSelect('user.headquarters', 'headquarters')
        .leftJoinAndSelect('headquarters.institution', 'institution')
        .where('role.name = :roleName', { roleName: 'Estudent' }); // Changed back to 'Estudent'

      if (headquarterId) {
        queryBuilder.andWhere('student.headquarter_id = :headquarterId', { headquarterId });
      }

      if (programId) {
        queryBuilder.andWhere('student.program_id = :programId', { programId });
      }

      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        queryBuilder
          .skip(skip)
          .take(limit)
          .getMany(),
        queryBuilder.getCount()
      ]);

      // Map the results to include hasEnrollment
      const enrichedUsers = users.map(user => ({
        ...user,
        hasEnrollment: user.student?.enrollments?.length > 0 || false
      }));

      return {
        success: true,
        message: 'Estudiantes recuperados exitosamente',
        data: {
          items: enrichedUsers,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar estudiantes: ${error.message}`,
        data: null,
      };
    }
  }



















  async findOneStudents(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'documentType', 'headquarters', 'student', 'student.enrollments', 'student.enrollments.group', 'student.enrollments.degree', 'student.attendants'],
        select: {
          password: false,
        },
      });

      if (!user) {
        return {
          success: false,
          message: `User with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving user: ${error.message}`,
        data: null,
      };
    }
  }





















  async updateWithStudent(id: number, updateDto: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['headquarters', 'role', 'documentType', 'student'],
      });

      if (!user) {
        return {
          success: false,
          message: `User with ID ${id} not found`,
          data: null,
        };
      }

      const { user: userData, studentInfo } = updateDto;

      // Update user information
      const { headquarterIds, roleId, documentTypeId, password, ...restUserData } = userData;

      // Update role if provided
      if (roleId) {
        const role = await this.roleRepository.findOne({
          where: { id: roleId }
        });
        if (!role) {
          return {
            success: false,
            message: 'Role not found',
            data: null,
          };
        }
        user.role = role;
      }

      // Update document type if provided
      if (documentTypeId) {
        const documentType = await this.documentTypeRepository.findOne({
          where: { id: documentTypeId }
        });
        if (!documentType) {
          return {
            success: false,
            message: 'Document type not found',
            data: null,
          };
        }
        user.documentType = documentType;
      }

      // Update headquarters if provided
      if (headquarterIds && headquarterIds.length > 0) {
        const headquarters = await this.headquarterRepository.findByIds(headquarterIds);
        if (headquarters.length !== headquarterIds.length) {
          return {
            success: false,
            message: 'One or more headquarters not found',
            data: null,
          };
        }
        user.headquarters = headquarters;
      }

      // Update password if provided
      if (password) {
        restUserData.password = await bcrypt.hash(password, 10);
      }

      // Update user basic data
      const updatedUser = await this.userRepository.save({
        ...user,
        ...restUserData,
      });

      // Update student information if exists
      if (studentInfo && user.student) {
        await this.studentRepository.save({
          ...user.student,
          ...studentInfo,
        });
      }

      // Fetch complete updated data
      const completeUser = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'documentType', 'headquarters', 'student'],
        select: {
          password: false,
        },
      });

      return {
        success: true,
        message: 'User and student information updated successfully',
        data: completeUser,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating user and student: ${error.message}`,
        data: null,
      };
    }
  }

  async removeStudent(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['student', 'student.enrollments', 'headquarters'],
      });

      if (!user) {
        return {
          success: false,
          message: `Usuario con ID ${id} no encontrado`,
          data: null,
        };
      }

      // Check if student has enrollments
      if (user.student?.enrollments?.length > 0) {
        return {
          success: false,
          message: 'No se puede eliminar el estudiante: Existen matrículas asociadas. Por favor, elimine primero las matrículas.',
          data: {
            studentId: user.student.id,
            enrollmentsCount: user.student.enrollments.length
          }
        };
      }

      try {
        // If user has student data, remove it first
        if (user.student) {
          await this.studentRepository.remove(user.student);
        }

        // Remove user and get data before deletion
        await this.userRepository.remove(user);
        const { password, ...result } = user;

        return {
          success: true,
          message: 'Usuario y datos relacionados eliminados exitosamente',
          data: result,
        };
      } catch (deleteError: any) {
        // Handle specific database errors
        if (deleteError.message.includes('foreign key constraint fails')) {
          return {
            success: false,
            message: 'No se puede eliminar el estudiante: Existen registros relacionados en el sistema. Por favor, elimine primero todos los datos asociados.',
            data: {
              error: 'RESTRICCION_CLAVE_FORANEA',
              details: deleteError.message
            }
          };
        }

        return {
          success: false,
          message: `Error en la base de datos durante la eliminación: ${deleteError.message}`,
          data: {
            error: 'ERROR_BASE_DATOS',
            details: deleteError.message
          }
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Error en la operación de eliminación: ${error.message}`,
        data: {
          error: 'ERROR_OPERACION',
          details: error.message
        }
      };
    }
  }

  async createWithStudent(createUserWithStudentDto: CreateUserWithStudentDto) {
    try {
      const { user: userData, studentInfo } = createUserWithStudentDto;

      // First create the user
      const userResult = await this.create(userData);

      if (!userResult.success) {
        return userResult;
      }

      // Create the student with the new user
      const student = new Student(); // Create a new instance of Student
      Object.assign(student, {
        ...studentInfo,
        user: userResult.data,
      });

      const savedStudent = await this.studentRepository.save(student);

      // Fetch complete data
      const completeStudent = await this.studentRepository.findOne({
        where: { id: savedStudent.id },
        relations: ['user', 'user.role', 'user.documentType', 'user.headquarters'],
      });

      return {
        success: true,
        message: 'User and student information created successfully',
        data: completeStudent,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating user with student: ${error.message}`,
        data: null,
      };
    }
  }


  // Metodos del administrador
  async createWithAdministrator(createUserWithAdministratorDto: CreateUserWithAdministratorDto) {
    try {
      const { user: userData, administratorInfo } = createUserWithAdministratorDto;

      // First create the user
      const userResult = await this.create(userData);
      if (!userResult.success) return userResult;

      // Create the administrator
      const administrator = this.administratorRepository.create({
        ...administratorInfo,
        user: userResult.data,
      });
      const savedAdministrator = await this.administratorRepository.save(administrator);

      // Create administrator type program relationships
      if (administratorInfo.administratorTypePrograms?.length > 0) {
        // First, create the relationships in administrator_administrator_type table
        const administratorTypes = await this.administratorTypeRepository.findByIds(
          administratorInfo.administratorTypePrograms.map(atp => atp.administratorTypeId)
        );
        savedAdministrator.administratorTypes = administratorTypes;
        await this.administratorRepository.save(savedAdministrator);

        // Then create records in administrator_type_program table
        const typePrograms = administratorInfo.administratorTypePrograms.map(atp => ({
          administrator: savedAdministrator,
          administratorType: { id: atp.administratorTypeId },
          program: { id: atp.programId },
          startDate: atp.startDate,
          endDate: atp.endDate
        }));

        await this.administratorTypeProgramRepository.save(typePrograms);
      }

      // Fetch complete data
      const completeAdministrator = await this.administratorRepository.findOne({
        where: { id: savedAdministrator.id },
        relations: [
          'user',
          'user.role',
          'user.documentType',
          'user.headquarters',
          'administratorTypes',
          'administratorTypePrograms',
          'administratorTypePrograms.administratorType',
          'administratorTypePrograms.program'
        ],
      });

      return {
        success: true,
        message: 'User and administrator information created successfully',
        data: completeAdministrator,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating user with administrator: ${error.message}`,
        data: null,
      };
    }
  }


























  async findAllAdministrators(institutionId: number) {
    try {
      const users = await this.userRepository.find({

        relations: [
          'role',
          'student',
          'administrator',
          'administrator.administratorTypePrograms',
          'administrator.administratorTypePrograms.administratorType',
          'administrator.administratorTypePrograms.program',
          'documentType',
          'headquarters',
          'headquarters.institution'
        ],
        where: {
          institution: institutionId,
          role: { name: 'administrator' }  // Only get users with administrator role
        },
        select: {
          password: false,
        },
      });

      return {
        success: true,
        message: 'Administrators retrieved successfully',
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving administrators: ${error.message}`,
        data: null,
      };
    }
  }


  async findOneAdministrator(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: [
          'role',
          'student',
          'administrator',
          'administrator.administratorTypePrograms',
          'administrator.administratorTypePrograms.administratorType',
          'administrator.administratorTypePrograms.program',
          'documentType',
          'headquarters',
          'headquarters.institution'
        ],
        select: {
          password: false,
        },
      });

      if (!user) {
        return {
          success: false,
          message: `User with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving user: ${error.message}`,
        data: null,
      };
    }
  }

  async updateWithAdministrator(id: number, updateDto: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: [
          'headquarters',
          'role',
          'documentType',
          'administrator',
          'administrator.administratorTypes',
          'administrator.administratorTypePrograms'
        ],
      });

      if (!user) {
        return {
          success: false,
          message: `User with ID ${id} not found`,
          data: null,
        };
      }

      const { user: userData, administratorInfo } = updateDto;

      // Update user information
      const { headquarterIds, roleId, documentTypeId, password, ...restUserData } = userData;

      // ... existing role, document type, headquarters, and password update code ...

      // Update user basic data
      const updatedUser = await this.userRepository.save({
        ...user,
        ...restUserData,
      });

      // Update administrator information
      if (administratorInfo && user.administrator) {
        // First, remove all existing administrator type programs
        if (user.administrator.administratorTypePrograms) {
          await this.administratorTypeProgramRepository.remove(
            user.administrator.administratorTypePrograms
          );
        }

        // Update basic administrator info
        const updatedAdministrator = await this.administratorRepository.save({
          ...user.administrator,
          ...administratorInfo,
          administratorTypePrograms: [], // Clear existing relationships
        });

        // Create new administrator type program relationships
        if (administratorInfo.administratorTypePrograms?.length > 0) {
          const administratorTypes = await this.administratorTypeRepository.findByIds(
            administratorInfo.administratorTypePrograms.map(atp => atp.administratorTypeId)
          );

          // Update administrator types
          updatedAdministrator.administratorTypes = administratorTypes;
          await this.administratorRepository.save(updatedAdministrator);

          // Create new records in administrator_type_program table
          const typePrograms = administratorInfo.administratorTypePrograms.map(atp => ({
            administrator: updatedAdministrator,
            administratorType: { id: atp.administratorTypeId },
            program: { id: atp.programId },
            startDate: atp.startDate,
            endDate: atp.endDate
          }));

          await this.administratorTypeProgramRepository.save(typePrograms);
        }
      }

      // Fetch complete updated data
      const completeUser = await this.userRepository.findOne({
        where: { id },
        relations: [
          'role',
          'documentType',
          'headquarters',
          'administrator',
          'administrator.administratorTypes',
          'administrator.administratorTypePrograms',
          'administrator.administratorTypePrograms.administratorType',
          'administrator.administratorTypePrograms.program'
        ],
        select: {
          password: false,
        },
      });

      return {
        success: true,
        message: 'User and administrator information updated successfully',
        data: completeUser,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating user and administrator: ${error.message}`,
        data: null,
      };
    }
  }








  async updatePassword(username: string, plainPassword: string) {
    try {
      // 1. Buscar usuario por username
      const user = await this.userRepository.findOne({
        where: { username },
      });
  
      if (!user) {
        return {
          success: false,
          message: `No se encontró un usuario con el nombre de usuario ${username}`,
          data: null,
        };
      }
  
      // 2. Encriptar nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
  
      // 3. Guardar nueva contraseña
      user.password = hashedPassword;
      await this.userRepository.save(user);
  
      return {
        success: true,
        message: 'La contraseña fue actualizada correctamente.',
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al actualizar la contraseña: ${error.message}`,
        data: null,
      };
    }
  }






  async findOneDocument(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { document: id },
        select: {
          password: false,
        },
      });

      if (!user) {
        return {
          success: false,
          message: `User with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving user: ${error.message}`,
        data: null,
      };
    }
  }

  async findOneUserName(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: id },
        select: {
          password: false,
        },
      });

      if (!user) {
        return {
          success: false,
          message: `User with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving user: ${error.message}`,
        data: null,
      };
    }
  }



















  // Login methods
  async login(username: string, password: string) {
    try {
      // Find user with role and both possible relations
      const user = await this.userRepository.findOne({
        where: { username },
        relations: [
          'role',
          'student',
          'student.enrollments', // Include student enrollments
          'administrator',
          'administrator.administratorTypePrograms',
          'administrator.administratorTypePrograms.administratorType',
          'administrator.administratorTypePrograms.program',
          'documentType',
          'headquarters',
          'headquarters.institution'
        ],
      });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }



      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid password',
          data: null,
        };
      }

      console.log(user);
      // Prepare token payload based on role
      let tokenPayload: any = {
        userId: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        student: user.student,
        firma: user.TeacherSignature,
        role: user.role.name,
        documentType: user.documentType,
        headquarters: user.headquarters,
      };

      // Add specific data based on role
      if (user.role.name === 'student' && user.student) {

        console.log(user.student.enrollments);

        const matriculaActiva = user.student.enrollments?.find(
          enrollment => enrollment.status === true
        ) || null;
        console.log("matriculaActiva : ", matriculaActiva);


        tokenPayload = {
          ...tokenPayload,
          student: {
            id: user.student.id,
            matriculaActiva: matriculaActiva,
            // Add other student-specific fields you want in the token
          }
        };
      } else if (user.role.name === 'administrator' && user.administrator) {
        tokenPayload = {
          ...tokenPayload,
          administrator: {
            id: user.administrator.id,
            academicTitle: user.administrator.academicTitle,
            trainingArea: user.administrator.trainingArea,
            maritalStatus: user.administrator.maritalStatus,
            startDate: user.administrator.startDate,
            endDate: user.administrator.endDate,
            teachingLevel: user.administrator.teachingLevel,
            contractType: user.administrator.contractType,
            signature: user.administrator.signature,
            administratorTypePrograms: user.administrator.administratorTypePrograms.map(atp => ({
              administratorType: atp.administratorType,
              program: atp.program,
              startDate: atp.startDate,
              endDate: atp.endDate
            }))
          }
        };
      }

      // Generate JWT token
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: '24h', // Token expires in 24 hours
      });

      return {
        success: true,
        message: 'Login successful',
        role: user.role.name,
        token
      };
    } catch (error) {
      return {
        success: false,
        message: `Error during login: ${error.message}`,
        data: null,
      };
    }
  }






  // Recovery Password
  async recoveryPassword(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: id },
        select: {
          password: false,
        },
      });

      if (!user) {
        return {
          success: false,
          message: `User with ID ${id} not found`,
          data: null,
        };
      }


      if (user) {
        const resetLink = `http://localhost:5173/recovery/newPassword?token=${user?.notificationEmail}&was=kfreogerogo43ut9ruvbb584y8gvb805y08b3r8vb804y50gyrevbyyv3brbvfbvkdfkjfbdbo457`;
        
        const nombre = `${user.firstName} ${user.lastName}`;
        const message = `
        <p>Hola,</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña en la plataforma <strong>Edunormas</strong>.</p>
        <p>Para continuar con el proceso, haz clic en el siguiente enlace o cópialo en tu navegador:</p>
        <p><a href="{{resetLink}}" target="_blank" style="color:#008001; font-weight:bold;">Restablecer contraseña</a></p>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje y tu contraseña permanecerá sin cambios.</p>
        <br>
        <p>Gracias por ser parte de nuestra comunidad.</p>
        <p><strong>Edunormas</strong></p>
        `;
        
        const finalMessage = message.replace("{{resetLink}}", resetLink);
        await this.notificarUsuario(user.notificationEmail, nombre, finalMessage);
      }


      return {
        success: true,
        message: 'Email recovery send exit',
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving user: ${error.message}`,
        data: null,
      };
    }
  }







  async bulkCreateStudents(students: BulkCreateStudentDto[]) {
    const results = {
      success: [],
      errors: [],
      retryableErrors: []
    };

    // Configuration
    const CHUNK_SIZE = 100; // Increased from 50 to 100
    const MAX_CONCURRENT_CHUNKS = 5; // Control parallel execution
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    try {
      console.log(`Starting bulk upload of ${students.length} students`);

      // Divide all students into chunks
      const chunks = [];
      for (let i = 0; i < students.length; i += CHUNK_SIZE) {
        chunks.push(students.slice(i, i + CHUNK_SIZE));
      }

      // Process chunks with controlled concurrency
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += MAX_CONCURRENT_CHUNKS) {
        const currentChunks = chunks.slice(chunkIndex, chunkIndex + MAX_CONCURRENT_CHUNKS);
        console.log(`Processing batch ${chunkIndex / MAX_CONCURRENT_CHUNKS + 1} of ${Math.ceil(chunks.length / MAX_CONCURRENT_CHUNKS)}`);

        // Process each chunk in parallel
        const chunkPromises = currentChunks.map(async (chunk, i) => {
          return this.processChunk(
            chunk,
            results,
            chunkIndex + i,
            MAX_RETRIES
          );
        });

        await Promise.all(chunkPromises);

        // Progress report every 5 batches
        if (chunkIndex % (5 * MAX_CONCURRENT_CHUNKS) === 0 || chunkIndex + MAX_CONCURRENT_CHUNKS >= chunks.length) {
          console.log(`Progress: ${Math.min((chunkIndex + MAX_CONCURRENT_CHUNKS) * CHUNK_SIZE, students.length)} of ${students.length} records processed`);
          console.log(`Success: ${results.success.length}, Errors: ${results.errors.length}`);
        }
      }

      // Process retryable errors with increased backoff and fewer concurrent operations
      if (results.retryableErrors.length > 0) {
        console.log(`Retrying ${results.retryableErrors.length} records with transient errors`);
        const retryResults = await this.processRetries(results.retryableErrors, MAX_RETRIES);

        // Add retry results to the final results
        results.success.push(...retryResults.success);
        results.errors.push(...retryResults.errors);

        // Clear retryable errors as they've been processed
        results.retryableErrors = [];
      }

      return {
        success: true,
        message: 'Bulk upload processed',
        data: {
          totalProcessed: students.length,
          successful: results.success.length,
          failed: results.errors.length,
          successDetails: results.success,
          errorDetails: results.errors
        }
      };

    } catch (error) {
      console.error(`Critical error in bulk upload: ${error.message}`, error);
      return {
        success: false,
        message: `Error in bulk upload: ${error.message}`,
        data: {
          ...results,
          criticalError: error.message
        }
      };
    }
  }



























  /**
   * Process a chunk of student records
   */
  private async processChunk(
    chunk: BulkCreateStudentDto[],
    results: { success: any[], errors: any[], retryableErrors: any[] },
    chunkIndex: number,
    maxRetries: number,
    retryCount = 0
  ): Promise<void> {
    try {
      // Process each student in the chunk
      const promises = chunk.map(async (studentData) => {
        try {
          await this.processStudentWithRetry(studentData, results, maxRetries);
        } catch (error) {
          // Final error handling if all retries failed
          this.handleStudentError(studentData, error, results);
        }
      });

      // Wait for all operations in the current chunk to complete
      await Promise.all(promises);

    } catch (chunkError) {
      // If the entire chunk fails (unlikely but possible), retry the whole chunk
      if (retryCount < maxRetries) {
        console.warn(`Chunk ${chunkIndex} failed, retrying (${retryCount + 1}/${maxRetries}): ${chunkError.message}`);
        await this.delay(Math.pow(2, retryCount) * 1000); // Exponential backoff
        return this.processChunk(chunk, results, chunkIndex, maxRetries, retryCount + 1);
      } else {
        // If chunk fails after all retries, mark all students in chunk as errors
        chunk.forEach(studentData => {
          results.errors.push({
            document: studentData.user.document,
            error: `Chunk processing failed after ${maxRetries} attempts: ${chunkError.message}`
          });
        });
      }
    }
  }























  /**
   * Process a single student with retry logic
   */
  private async processStudentWithRetry(
    studentData: BulkCreateStudentDto,
    results: { success: any[], errors: any[], retryableErrors: any[] },
    maxRetries: number,
    retryCount = 0
  ): Promise<void> {
    try {
      console.log(`Processing student ${studentData.user.document} with document type ${studentData.user.documentTypeId}`);

      const documentType = await this.documentTypeRepository.findOne({
        where: { siglas: studentData.user.documentTypeId }
      });

      console.log("Found document type:", documentType);

      if (!documentType) {
        throw new Error(`Document type "${studentData.user.documentTypeId}" not found`);
      }

      const headquarters = await this.headquarterRepository.findOne({
        where: { name: studentData.user.headquarterIds },
        relations: ['institution']
      });

      if (!headquarters) {
        throw new Error(`Headquarters "${studentData.user.headquarterIds}" not found`);
      }


      // Buscvar profgrama 
      const program = await this.programRepository.findOne({
        where: { name: studentData.studentInfo.programa },
      });

      if (!program) {
        throw new Error(`Headquarters "${studentData.user.headquarterIds}" not found`);
      }



      // Modify user data with found IDs
      const modifiedUserData = {
        ...studentData.user,
        documentTypeId: documentType.id,
        headquarterIds: [headquarters.id],
        institution: headquarters.institution.id,
        TeacherSignature: '',
      };

      console.log("Modified user data:", modifiedUserData);

      // Create user with student
      const userResult = await this.createWithStudent({
        user: modifiedUserData,
        studentInfo: {
          ...studentData.studentInfo,
          headquarterId: headquarters.id,
          programId: program.id,
        }
      });

      if (!userResult.success) {
        console.error(`Failed to create user: ${userResult.message}`);
        throw new Error(userResult.message);


      } if (!userResult.success) {
        throw new Error(userResult.message);
      }

      // If enrollment data is provided, find actual group and degree IDs
      if (studentData.enrollment && studentData.enrollment.type) {
        const hasEnrollmentData = studentData.enrollment.groupId &&
          studentData.enrollment.degreeId &&
          studentData.enrollment.schedule &&
          studentData.enrollment.folio;

        if (hasEnrollmentData) {
          const enrollmentData: any = {
            schedule: studentData.enrollment.schedule,
            folio: studentData.enrollment.folio,
            registrationDate: studentData.enrollment.registrationDate || new Date(),
            type: studentData.enrollment.type,
            observations: studentData.enrollment.observations || '',
            studentId: userResult.data.id,
            headquarterId: headquarters.id,
            institutionId: headquarters.institution.id
          };

          const [group, degree, program] = await Promise.all([
            this.groupRepository.findOne({
              where: { name: studentData.enrollment.groupId }
            }),
            this.degreeRepository.findOne({
              where: { name: studentData.enrollment.degreeId }
            }),
            studentData.enrollment.programId ?
              this.programRepository.findOne({
                where: { name: studentData.enrollment.programId }
              }) : null
          ]);

          if (!group || !degree) {
            throw new Error(
              `${!group ? `Group "${studentData.enrollment.groupId}"` : ''} ${!degree ? `Degree "${studentData.enrollment.degreeId}"` : ''} not found`
            );
          }

          enrollmentData.groupId = group.id;
          enrollmentData.degreeId = degree.id;
          if (program) {
            enrollmentData.programId = program.id;
          }

          console.log("matricula : ", enrollmentData)
          const enrollmentResult = await this.enrollmentService.create(enrollmentData);

          if (!enrollmentResult.success) {
            throw new Error(`Enrollment failed: ${enrollmentResult.message}`);
          }
        }
      }

      results.success.push({
        document: studentData.user.document,
        message: 'Student created successfully',
        userId: userResult.data.id
      });

    } catch (error) {
      console.error(`Error processing student ${studentData.user.document}: ${error.message}`);

      if (this.isRetryableError(error) && retryCount < maxRetries) {
        console.log(`Retrying student ${studentData.user.document} (attempt ${retryCount + 1}/${maxRetries})`);
        await this.delay(Math.pow(2, retryCount) * 1000);
        return this.processStudentWithRetry(studentData, results, maxRetries, retryCount + 1);
      } else {
        results.errors.push({
          document: studentData.user.document,
          error: `Error processing student: ${error.message}`,
          attempts: retryCount + 1
        });
      }
    }
  }



















  /**
   * Process records that had transient errors with more careful retry logic
   */
  private async processRetries(
    retryableErrors: any[],
    maxRetries: number
  ): Promise<{ success: any[], errors: any[] }> {
    const retryResults = {
      success: [],
      errors: []
    };

    // Process with much smaller chunks and more delay between operations
    const RETRY_CHUNK_SIZE = 20;

    for (let i = 0; i < retryableErrors.length; i += RETRY_CHUNK_SIZE) {
      const chunk = retryableErrors.slice(i, i + RETRY_CHUNK_SIZE);

      // Process each student in the retry chunk with sequential execution
      for (const item of chunk) {
        try {
          // Create user with student
          const userResult = await this.createWithStudent({
            user: item.studentData.user,
            studentInfo: item.studentData.studentInfo
          });

          if (!userResult.success) {
            throw new Error(userResult.message);
          }

          // If enrollment data is provided and valid, create enrollment
          if (item.studentData.enrollment?.groupId && item.studentData.enrollment?.degreeId) {
            const enrollmentResult = await this.enrollmentService.create({
              ...item.studentData.enrollment,
              studentId: userResult.data.id
            });

            if (!enrollmentResult.success) {
              throw new Error(`Enrollment failed: ${enrollmentResult.message}`);
            }
          }

          retryResults.success.push({
            document: item.studentData.user.document,
            message: 'Student created successfully after retry',
            userId: userResult.data.id,
            retriesNeeded: item.attempts
          });
        } catch (error) {
          retryResults.errors.push({
            document: item.studentData.user.document,
            error: `Failed after ${item.attempts + 1} attempts: ${error.message}`
          });
        }

        // Add delay between retry operations to reduce database pressure
        await this.delay(500);
      }
    }

    return retryResults;
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryableError(error: any): boolean {
    const errorMessage = error.message || error.toString();

    // Only retry on specific database-related errors
    const retryablePatterns = [
      /deadlock/i,
      /lock timeout/i,
      /connection reset/i,
      /ECONNRESET/,
      /timeout/i,
      /database is busy/i
    ];

    // Don't retry on validation or not found errors
    if (errorMessage.includes('not found') ||
      errorMessage.includes('validation failed')) {
      return false;
    }

    return retryablePatterns.some(pattern => pattern.test(errorMessage));
  }
  /**
   * Handle student record error
   */
  private handleStudentError(
    studentData: BulkCreateStudentDto,
    error: any,
    results: { success: any[], errors: any[], retryableErrors: any[] }
  ): void {
    results.errors.push({
      document: studentData.user.document,
      error: error.message || 'Unknown error',
      data: {
        firstName: studentData.user.firstName,
        lastName: studentData.user.lastName,
        email: studentData.user.notificationEmail
      }
    });
  }

  /**
   * Utility method to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }




  async removeAdministrator(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['administrator', 'headquarters'],
      });

      if (!user) {
        return {
          success: false,
          message: `Usuario con ID ${id} no encontrado`,
          data: null,
        };
      }

      try {
        // If user has administrator data, remove it first
        if (user.administrator) {
          await this.administratorRepository.remove(user.administrator);
        }

        // Remove user and get data before deletion
        await this.userRepository.remove(user);
        const { password, ...result } = user;

        return {
          success: true,
          message: 'Usuario y datos del administrador eliminados exitosamente',
          data: result,
        };
      } catch (deleteError: any) {
        // Handle specific database errors
        if (deleteError.message.includes('foreign key constraint fails')) {
          return {
            success: false,
            message: 'No se puede eliminar el administrador: Existen registros relacionados en el sistema.',
            data: {
              error: 'RESTRICCION_CLAVE_FORANEA',
              details: deleteError.message
            }
          };
        }

        return {
          success: false,
          message: `Error en la base de datos durante la eliminación: ${deleteError.message}`,
          data: {
            error: 'ERROR_BASE_DATOS',
            details: deleteError.message
          }
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Error en la operación de eliminación: ${error.message}`,
        data: {
          error: 'ERROR_OPERACION',
          details: error.message
        }
      };
    }
  }
}