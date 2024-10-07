import type { config as ConnectionPoolConfig } from 'mssql'

/*
 * SECRETS OK!
 * https://github.com/potatoqualitee/mssqlsuite
 */

export const config: ConnectionPoolConfig = {
  server: 'localhost',
  user: 'sa',
  // eslint-disable-next-line sonarjs/no-hardcoded-credentials
  password: 'dbatools.I0',
  database: 'MiniShop',
  options: {
    encrypt: false
  }
}
