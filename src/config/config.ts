import { load } from 'ts-dotenv';

export const env = load({
  APP_PORT: Number,
  DB_HOST: String,
  DB_PORT: Number,
  DB_BASE: String,
  DB_USER: String,
  DB_PSWD: String,
  DB_PORT_EXT: Number,
  SECRET: String,
  REDIS_PORT: Number,
  SALT: Number,
});
