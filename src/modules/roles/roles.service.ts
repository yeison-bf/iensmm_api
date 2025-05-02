import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = this.roleRepository.create(createRoleDto);
      const savedRole = await this.roleRepository.save(role);

      return {
        success: true,
        message: 'Role created successfully',
        data: savedRole,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating role: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const roles = await this.roleRepository.find();

      return {
        success: true,
        message: 'Roles retrieved successfully',
        data: roles,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving roles: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
      });

      if (!role) {
        return {
          success: false,
          message: `Role with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Role retrieved successfully',
        data: role,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving role: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
      });

      if (!role) {
        return {
          success: false,
          message: `Role with ID ${id} not found`,
          data: null,
        };
      }

      const updated = await this.roleRepository.save({
        ...role,
        ...updateRoleDto,
      });

      return {
        success: true,
        message: 'Role updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating role: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
      });

      if (!role) {
        return {
          success: false,
          message: `Role with ID ${id} not found`,
          data: null,
        };
      }

      await this.roleRepository.remove(role);

      return {
        success: true,
        message: 'Role deleted successfully',
        data: role,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting role: ${error.message}`,
        data: null,
      };
    }
  }
}