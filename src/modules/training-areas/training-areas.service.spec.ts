import { Test, TestingModule } from '@nestjs/testing';
import { TrainingAreasService } from './training-areas.service';

describe('TrainingAreasService', () => {
  let service: TrainingAreasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingAreasService],
    }).compile();

    service = module.get<TrainingAreasService>(TrainingAreasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
