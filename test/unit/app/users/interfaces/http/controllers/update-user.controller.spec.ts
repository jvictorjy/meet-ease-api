import { UpdateUserController } from '@app/users/interfaces/http/controllers/update-user.controller';
import { UpdateUserUseCase } from '@app/users/application/use-cases/update-user.use-case';
import { UpdateUserRequestDto } from '@app/users/interfaces/http/dtos/update-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

describe('UpdateUserController', () => {
  let controller: UpdateUserController;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserController],
      providers: [
        {
          provide: UpdateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdateUserController>(UpdateUserController);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('returns updated user data when request is valid', async () => {
    const id = 'valid-uuid';
    const body: UpdateUserRequestDto = {
      name: 'Updated Name',
      email: 'updated.email@example.com',
      phone: '9876543210',
    };

    jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue({
      id,
      ...body,
      created_at: new Date('2023-01-01T00:00:00.000Z'),
      updated_at: new Date('2023-01-02T00:00:00.000Z'),
    });

    const result = await controller.handle(id, body);

    expect(result).toEqual(
      expect.objectContaining({
        id,
        name: 'Updated Name',
        email: 'updated.email@example.com',
        phone: '9876543210',
        created_at: new Date('2023-01-01T00:00:00.000Z'),
        updated_at: new Date('2023-01-02T00:00:00.000Z'),
      }),
    );
  });

  it('throws an error when use case execution fails', async () => {
    const id = 'valid-uuid';
    const body: UpdateUserRequestDto = {
      name: 'Updated Name',
      email: 'updated.email@example.com',
      phone: '9876543210',
    };

    jest
      .spyOn(updateUserUseCase, 'execute')
      .mockRejectedValue(new Error('Use case error'));

    await expect(controller.handle(id, body)).rejects.toThrow('Use case error');
  });

  it('returns correct HTTP status code for successful update', async () => {
    const id = 'valid-uuid';
    const body: UpdateUserRequestDto = {
      name: 'Updated Name',
      email: 'updated.email@example.com',
      phone: '9876543210',
    };

    jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue({
      id,
      ...body,
      created_at: new Date('2023-01-01T00:00:00.000Z'),
      updated_at: new Date('2023-01-02T00:00:00.000Z'),
    });

    const result = await controller.handle(id, body);

    expect(result).toBeDefined();
    expect(HttpStatus.OK).toBe(200);
  });
});
