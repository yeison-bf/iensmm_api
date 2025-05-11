import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    try {
      const group = this.groupRepository.create(createGroupDto);
      const savedGroup = await this.groupRepository.save(group);

      return {
        success: true,
        message: 'Group created successfully',
        data: savedGroup,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating group: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const groups = await this.groupRepository.find();
      return {
        success: true,
        message: 'Groups retrieved successfully',
        data: groups,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving groups: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const group = await this.groupRepository.findOne({ where: { id } });
      if (!group) {
        return {
          success: false,
          message: `Group with ID ${id} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Group retrieved successfully',
        data: group,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving group: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    try {
      const group = await this.groupRepository.findOne({ where: { id } });
      if (!group) {
        return {
          success: false,
          message: `Group with ID ${id} not found`,
          data: null,
        };
      }

      const updated = await this.groupRepository.save({
        ...group,
        ...updateGroupDto,
      });

      return {
        success: true,
        message: 'Group updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating group: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const group = await this.groupRepository.findOne({ where: { id } });
      if (!group) {
        return {
          success: false,
          message: `Group with ID ${id} not found`,
          data: null,
        };
      }

      await this.groupRepository.remove(group);

      return {
        success: true,
        message: 'Group deleted successfully',
        data: group,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting group: ${error.message}`,
        data: null,
      };
    }
  }
}