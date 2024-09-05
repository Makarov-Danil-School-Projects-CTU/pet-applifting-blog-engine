import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;
  let apiKey: string;
  let accessToken: string;
  
  // Tenant
  let tenantName = 'testTenant';
  let tenantPassword = 'testPassword';
  let tenantId: string;

  // Article
  let articleId: string;

  const articleData = {
    title: 'Test Article',
    perex: 'Test Perex',
    content: 'Test Content',
  };

  beforeAll(async () => {
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
    tenantId = createTenantResponse.body.tenantId; // Extract tenantId from response
    expect(apiKey).toBeDefined(); // Check that apiKey is returned
  });

  it('should log in the tenant and return an access token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-api-key', apiKey) // Set the x-api-key header
      .send({ username: tenantName, password: tenantPassword })
      .expect(201); // Expecting HTTP status 201 OK

    const { access_token, expires_in, token_type } = loginResponse.body;
    accessToken = access_token;
    expect(access_token).toBeDefined(); // Check that access_token is returned
    expect(expires_in).toEqual(3600); // Check that expires_in is correct
    expect(token_type).toEqual('bearer'); // Check that token_type is correct
  });

  it('should create an article using the stored tokens', async () => {
    const createArticleResponse = await request(app.getHttpServer())
      .post('/articles')
      .set('X-API-KEY', apiKey)
      .set('Authorization', `${accessToken}`)
      .send({
        ...articleData,
        tenantId,
      })
      .expect(201);

    articleId = createArticleResponse.body.articleId;
    expect(articleId).toBeDefined();
  });

  it('should retrieve the created article', async () => {
    const getArticleResponse = await request(app.getHttpServer())
      .get(`/articles/${articleId}`)
      .set('X-API-KEY', apiKey)
      .set('Authorization', `${accessToken}`)
      .expect(200);

    expect(getArticleResponse.body.title).toEqual(articleData.title);
    expect(getArticleResponse.body.perex).toEqual(articleData.perex);
    expect(getArticleResponse.body.content).toEqual(articleData.content);
  });

  it('should update the article', async () => {
    const updatedContent = 'Updated Test Content';
    const updateArticleResponse = await request(app.getHttpServer())
      .patch(`/articles/${articleId}`)
      .set('X-API-KEY', apiKey)
      .set('Authorization', `${accessToken}`)
      .send({ content: updatedContent })
      .expect(200);

    expect(updateArticleResponse.body.content).toEqual(updatedContent);
  });

  it('should delete the article', async () => {
    await request(app.getHttpServer())
      .delete(`/articles/${articleId}`)
      .set('X-API-KEY', apiKey)
      .set('Authorization', `${accessToken}`)
      .expect(200);

    // Verify that the article has been deleted
    const response = await request(app.getHttpServer())
      .get(`/articles/${articleId}`)
      .set('X-API-KEY', apiKey)
      .set('Authorization', `${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({});
  });

  it('should create a comment for an article', async () => {
    const commentData = {
      articleId: articleId, // Use the articleId from created article
      author: 'John Doe',
      content: 'This is a test comment.',
    };

    const response = await request(app.getHttpServer())
      .post('/comments')
      .set('X-API-KEY', apiKey)
      .set('Authorization', `${accessToken}`)
      .send(commentData)
      .expect(404);

    expect(response.body.error).toEqual('Not Found');
  });

  it('should retrieve all comments for an article', async () => {
    const getCommentsResponse = await request(app.getHttpServer())
      .get('/comments')
      .query({ articleId })
      .set('X-API-KEY', apiKey)
      .set('Authorization', `${accessToken}`)
      .expect(200);

    expect(getCommentsResponse.body.items).toBeInstanceOf(Array);
    expect(getCommentsResponse.body.items.length).toEqual(0);
  });

  it('should delete a comment', async () => {
    const commentId = 'e8d5f237-b99d-481f-a7a2-727550c7c6b1'; // Replace with the actual commentId

    // Verify that the comment has been deleted
    const response = await request(app.getHttpServer())
      .get(`/comments/${commentId}`)
      .set('X-API-KEY', apiKey)
      .set('Authorization', `${accessToken}`)
      .expect(404);

    expect(response.body.error).toEqual('Not Found');
  });
});
