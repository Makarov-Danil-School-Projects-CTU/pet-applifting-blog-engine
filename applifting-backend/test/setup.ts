import { AppDataSource } from '../data-source';

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
});

afterAll(async () => {
  await AppDataSource.dropDatabase();
  await AppDataSource.destroy();
});