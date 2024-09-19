import { rejects } from './run.js'

rejects(import.meta.url, { code: 'OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED' })
