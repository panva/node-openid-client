import { rejects } from './run.js'

rejects(
  import.meta.url,
  { code: 'OAUTH_DECRYPTION_FAILED' },
  { code: 'ERR_JOSE_ALG_NOT_ALLOWED' },
)
