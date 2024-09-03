import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from appropriate .env file
config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '**/*.entity.{js,ts}')],
  synchronize: false, // Should be false when using migrations
  migrations: [join(__dirname, '/migrations/*.{js,ts}')],
  migrationsRun: process.env.NODE_ENV === 'test',
  dropSchema: process.env.NODE_ENV === 'test',
});
