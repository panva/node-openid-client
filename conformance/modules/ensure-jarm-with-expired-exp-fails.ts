import { rejects } from './run.js'

rejects(
  import.meta.url,
  { code: 'OAUTH_JWT_TIMESTAMP_CHECK_FAILED' },
  {
    name: 'OperationProcessingError',
    message: /"exp"/,
  },
)
