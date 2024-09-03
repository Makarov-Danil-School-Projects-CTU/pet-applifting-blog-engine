// Base config 
var dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

// Adding properties for each case
switch (process.env.NODE_ENV) {
  case 'development':
    // SQLite configuration
    Object.assign(dbConfig, {
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'applifting',
      entities: [join(__dirname, '**/*.entity.js')],
      synchronize: true,  // Set to true for development, false for production
    });
    break;
  case 'test':
    // SQLite configuration
    Object.assign(dbConfig, {
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'applifting-test',
      entities: [join(__dirname, '**/*.entity.js')],
    });
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;
