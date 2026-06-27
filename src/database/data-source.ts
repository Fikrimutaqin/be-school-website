import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'school_db',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [
    'dist/database/migrations/*{.ts,.js}',
    'dist/database/seeds/*{.ts,.js}',
  ],
  synchronize: false,
  logging: true,
});
