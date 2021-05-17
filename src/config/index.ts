import { load } from 'ts-dotenv';

export const env = load({
    APP_PORT: Number,
    DB_PORT_EXT: Number,
});