import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT ?? 4000);
export const DATABASE_URL = process.env.DATABASE_URL ?? '';
export const JWT_SECRET = process.env.JWT_SECRET ?? 'change_me';
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? 'uploads';