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

  ) { }

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

  async findAllStudents() {
    try {
      const users = await this.userRepository.find({
        relations: ['role', 'documentType', 'headquarters', 'student'],
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

  async findOneStudents(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'documentType', 'headquarters', 'student'],
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
        relations: ['student', 'headquarters'],
      });

      if (!user) {
        return {
          success: false,
          message: `User with ID ${id} not found`,
          data: null,
        };
      }

      // If user has student data, remove it first
      if (user.student) {
        await this.studentRepository.remove(user.student);
      }

      // Remove user and get data before deletion
      await this.userRepository.remove(user);
      const { password, ...result } = user;

      return {
        success: true,
        message: 'User and related data deleted successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting user: ${error.message}`,
        data: null,
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
      const student = this.studentRepository.create({
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

      if (!userResult.success) {
        return userResult;
      }

      // Create the administrator with the new user
      const administrator = this.administratorRepository.create({
        ...administratorInfo,
        user: userResult.data,
      });

      const savedAdministrator = await this.administratorRepository.save(administrator);

      // Fetch complete data
      const completeAdministrator = await this.administratorRepository.findOne({
        where: { id: savedAdministrator.id },
        relations: ['user', 'user.role', 'user.documentType', 'user.headquarters', 'administratorType'],
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

  async findAllAdministrators() {
    try {
      const users = await this.userRepository.find({
        relations: ['role', 'documentType', 'headquarters', 'administrator'],
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

  async findOneAdministrator(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'documentType', 'headquarters', 'administrator'],
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
        relations: ['headquarters', 'role', 'documentType', 'administrator'],
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

      // Update administrator information if exists
      if (administratorInfo && user.administrator) {
        await this.administratorRepository.save({
          ...user.administrator,
          ...administratorInfo,
        });
      }

      // Fetch complete updated data
      const completeUser = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'documentType', 'headquarters', 'administrator', 'administrator.administratorType'],
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

  async findOneDocument(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { document: id},
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
        where: { username: id},
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

  // Metodos para el login.

  // Login methods
  async login(username: string, password: string) {
    try {
      // Find user with role and both possible relations
      const user = await this.userRepository.findOne({
        where: { username },
        relations: [
          'role',
          'student',
          'administrator',
          'administrator.administratorType', // Changed from administratorTypeId to administratorType
          'documentType',
          'headquarters'
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

        role: user.role.name,
        documentType: user.documentType,
        headquarters: user.headquarters,
      };

      // Add specific data based on role
      if (user.role.name === 'student' && user.student) {
        tokenPayload = {
          ...tokenPayload,
          student: {
            id: user.student.id,
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
            administratorTypeId: user.administrator.administratorTypeId,
            administratorType: user.administrator.administratorType
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

  // ... rest of the code ...

}