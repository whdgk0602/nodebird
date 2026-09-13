require('dotenv').config();

// DB_* env vars override everything (used in production, e.g. Aiven).
// SEQUELIZE_PASSWORD / SEQUELIZE_PORT stay as the local-dev override so the
// existing docker-compose.yml + .env setup keeps working unchanged.
const buildConfig = (defaults) => ({
  username: process.env.DB_USERNAME || defaults.username,
  password: process.env.DB_PASSWORD || process.env.SEQUELIZE_PASSWORD || defaults.password,
  database: process.env.DB_NAME || defaults.database,
  host: process.env.DB_HOST || defaults.host,
  port: Number(process.env.DB_PORT || process.env.SEQUELIZE_PORT || defaults.port),
  dialect: 'mysql',
  // Aiven (and most managed MySQL hosts) require TLS. DB_SSL_REJECT_UNAUTHORIZED
  // defaults to false (accept the host's cert without verifying its CA chain) -
  // fine for a hobby project; set it to "true" once you've wired up the host's
  // CA certificate if you want strict verification.
  dialectOptions: process.env.DB_SSL === 'true' ? {
    ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' },
  } : undefined,
});

module.exports = {
  development: buildConfig({
    username: 'root', password: undefined, database: 'nodebird', host: '127.0.0.1', port: 3306,
  }),
  test: buildConfig({
    username: 'root', password: undefined, database: 'nodebird', host: '127.0.0.1', port: 3306,
  }),
  production: buildConfig({
    username: 'root', password: undefined, database: 'database_production', host: '127.0.0.1', port: 3306,
  }),
};
