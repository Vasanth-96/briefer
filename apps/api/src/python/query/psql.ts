import { v4 as uuidv4 } from 'uuid'
import {
  PostgreSQLDataSource,
  RedshiftDataSource,
  getDatabaseURL,
} from '@briefer/database'
import {
  DataSourceStructure,
  RunQueryResult,
  SuccessRunQueryResult,
} from '@briefer/types'
import {
  getSQLAlchemySchema,
  makeSQLAlchemyQuery,
  pingSQLAlchemy,
} from './sqlalchemy.js'

export async function makePSQLQuery(
  workspaceId: string,
  sessionId: string,
  queryId: string,
  dataframeName: string,
  datasource: PostgreSQLDataSource | RedshiftDataSource,
  type: 'psql' | 'redshift',
  encryptionKey: string,
  sql: string,
  onProgress: (result: SuccessRunQueryResult) => void
): Promise<[Promise<RunQueryResult>, () => Promise<void>]> {
  const databaseUrl = await getDatabaseURL(
    { type, data: datasource },
    encryptionKey
  )

  const jobId = uuidv4()
  const query = `${sql}  -- Briefer jobId: ${jobId}`

  return makeSQLAlchemyQuery(
    workspaceId,
    sessionId,
    dataframeName,
    databaseUrl,
    jobId,
    query,
    queryId,
    onProgress
  )
}

export function pingPSQL(
  ds: PostgreSQLDataSource | RedshiftDataSource,
  type: 'psql' | 'redshift',
  encryptionKey: string
): Promise<null | Error> {
  return pingSQLAlchemy(ds.workspaceId, { type, data: ds }, encryptionKey)
}

export function getPSQLSchema(
  ds: PostgreSQLDataSource | RedshiftDataSource,
  type: 'psql' | 'redshift',
  encryptionKey: string
): Promise<DataSourceStructure> {
  return getSQLAlchemySchema({ type, data: ds }, encryptionKey)
}
