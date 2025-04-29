import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MainModule } from '../src/main.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should authenticate user and get refresh token', async () => {
    // This test assumes there's a user with these credentials in the database
    const signInResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(signInResponse.body).toHaveProperty('accessToken');
    expect(signInResponse.body).toHaveProperty('refreshToken');
  });

  it('should refresh tokens', async () => {
    // First, sign in to get tokens
    const signInResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    const { refreshToken } = signInResponse.body;

    // Then use the refresh token to get new tokens
    const refreshResponse = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({
        refreshToken,
      })
      .expect(200);

    expect(refreshResponse.body).toHaveProperty('accessToken');
    expect(refreshResponse.body).toHaveProperty('refreshToken');
  });

  afterAll(async () => {
    await app.close();
  });
});
