import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;
  let apiKey: string;
  let tenantName = 'testTenant';
  let tenantPassword = 'testPassword';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a tenant and return an apiKey', async () => {
    const createTenantResponse = await request(app.getHttpServer())
      .post('/tenants')
      .send({ name: tenantName, password: tenantPassword })
      .expect(201); // Expecting HTTP status 201

    apiKey = createTenantResponse.body.apiKey; // Extract apiKey from response
    expect(apiKey).toBeDefined(); // Check that apiKey is returned
  });

  it('should log in the tenant and return an access token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .set('X-API-KEY', apiKey) // Set the X-API-KEY header
      .send({ username: tenantName, password: tenantPassword })
      .expect(201); // Expecting HTTP status 201 OK

    const { access_token, expires_in, token_type } = loginResponse.body;
    expect(access_token).toBeDefined(); // Check that access_token is returned
    expect(expires_in).toEqual(3600); // Check that expires_in is correct
    expect(token_type).toEqual('bearer'); // Check that token_type is correct
  });
});
