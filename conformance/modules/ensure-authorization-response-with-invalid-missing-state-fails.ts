import { rejects } from './run.js'

rejects(
  import.meta.url,
  { code: 'OAUTH_INVALID_RESPONSE' },
  { name: 'OperationProcessingError', message: /"state"/ },
  { useState: true },
)
