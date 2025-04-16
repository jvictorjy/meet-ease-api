import { Test, TestingModule } from '@nestjs/testing';

import { MainController } from '../../../src/main.controller';

describe('MainController', () => {
  let mainController: MainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
    }).compile();

    mainController = module.get<MainController>(MainController);
  });

  it('should return status with environment', () => {
    const result = mainController.execute();
    expect(result).toEqual({
      status: `[${process.env.NODE_ENV}] meet-ease-api is online`,
    });
  });

  it('should return status with correct format', () => {
    const result = mainController.execute();
    expect(result.status).toMatch(/^\[.*\] meet-ease-api is online$/);
  });
});
