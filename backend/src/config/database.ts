export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
    // schema: process.env.DATABASE_SCHEMA,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: '300s',
  },
});
