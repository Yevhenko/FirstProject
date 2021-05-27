import { env } from './src/config/config';

module.exports = {
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PSWD,
  database: env.DB_BASE,
  synchronize: false,
  logging: false,
  entities: ['src/components/user/models/*.ts', 'src/components/post/models/*.ts'],
  migrations: ['src/db/migration/*.ts'],
  cli: {
    entitiesDir: 'src/components/user/models',
    migrationsDir: 'src/db/migration',
  },
};
