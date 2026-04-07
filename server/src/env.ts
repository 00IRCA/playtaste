const required = ['DATABASE_URL', 'IGDB_CLIENT_ID', 'IGDB_CLIENT_SECRET'] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT || '3000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  IGDB_CLIENT_ID: process.env.IGDB_CLIENT_ID as string,
  IGDB_CLIENT_SECRET: process.env.IGDB_CLIENT_SECRET as string,
};
