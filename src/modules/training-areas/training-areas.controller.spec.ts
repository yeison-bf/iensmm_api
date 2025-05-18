import { Test, TestingModule } from '@nestjs/testing';
import { TrainingAreasController } from './training-areas.controller';
import { TrainingAreasService } from './training-areas.service';

describe('TrainingAreasController', () => {
  let controller: TrainingAreasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingAreasController],
      providers: [TrainingAreasService],
    }).compile();

    controller = module.get<TrainingAreasController>(TrainingAreasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
