import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from './entities/document-type.entity';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}

  async create(createDocumentTypeDto: CreateDocumentTypeDto) {
    try {
      const documentType = this.documentTypeRepository.create(createDocumentTypeDto);
      const savedDocumentType = await this.documentTypeRepository.save(documentType);

      return {
        success: true,
        message: 'Document type created successfully',
        data: savedDocumentType,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating document type: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const documentTypes = await this.documentTypeRepository.find();

      return {
        success: true,
        message: 'Document types retrieved successfully',
        data: documentTypes,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving document types: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const documentType = await this.documentTypeRepository.findOne({
        where: { id },
      });

      if (!documentType) {
        return {
          success: false,
          message: `Document type with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Document type retrieved successfully',
        data: documentType,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving document type: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    try {
      const documentType = await this.documentTypeRepository.findOne({
        where: { id },
      });

      if (!documentType) {
        return {
          success: false,
          message: `Document type with ID ${id} not found`,
          data: null,
        };
      }

      const updated = await this.documentTypeRepository.save({
        ...documentType,
        ...updateDocumentTypeDto,
      });

      return {
        success: true,
        message: 'Document type updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating document type: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const documentType = await this.documentTypeRepository.findOne({
        where: { id },
      });

      if (!documentType) {
        return {
          success: false,
          message: `Document type with ID ${id} not found`,
          data: null,
        };
      }

      await this.documentTypeRepository.remove(documentType);

      return {
        success: true,
        message: 'Document type deleted successfully',
        data: documentType,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting document type: ${error.message}`,
        data: null,
      };
    }
  }
}