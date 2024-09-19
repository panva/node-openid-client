import { rejects } from './run.js'

rejects(
  import.meta.url,
  { code: 'OAUTH_JWT_CLAIM_COMPARISON_FAILED' },
  { name: 'OperationProcessingError', message: /"aud"/ },
)
