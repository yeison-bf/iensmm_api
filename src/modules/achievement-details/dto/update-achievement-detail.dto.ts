import { PartialType } from '@nestjs/mapped-types';
import { CreateAchievementDetailDto } from './create-achievement-detail.dto';

export class UpdateAchievementDetailDto extends PartialType(CreateAchievementDetailDto) {}
