export default ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'rubiks_cube'),
      user: env('DATABASE_USERNAME', 'rubiks_cube'),
      password: env('DATABASE_PASSWORD'),
      charset: 'utf8mb4',
      timezone: 'Z',
      ssl: env.bool('DATABASE_SSL', false)
        ? {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
            ca: env('DATABASE_SSL_CA'),
          }
        : false,
    },
    pool: { min: 0, max: env.int('DATABASE_POOL_MAX', 10) },
    acquireConnectionTimeout: 60000,
  },
});
