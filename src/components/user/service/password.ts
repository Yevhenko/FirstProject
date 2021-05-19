import { createHmac } from 'crypto';
import { env } from '../../../config/index';

export const createHashedPassword = async (password: string): Promise<string> => {
  return createHmac('sha256', env.SECRET_FOR_PASSWORD).update(password).digest('hex');
};

export const compareHashedPasswords = async (hashedPassword: string, password: string): Promise<boolean> => {
  if (hashedPassword === createHmac('SHA256', env.SECRET_FOR_PASSWORD).update(password).digest('base64')) return true;
  return false;
};
