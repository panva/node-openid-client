import { rejects } from './run.js'

rejects(
  import.meta.url,
  {
    code: 'OAUTH_JWT_CLAIM_COMPARISON_FAILED',
    message: 'unexpected JWT claim value encountered',
  },
  {
    code: 'OAUTH_JWT_CLAIM_COMPARISON_FAILED',
    message: /"aud"/,
  },
)
