import { PartialType } from '@nestjs/mapped-types';
import { CreateAdministratorTypeDto } from './create-administrator-type.dto';

export class UpdateAdministratorTypeDto extends PartialType(CreateAdministratorTypeDto) {}
