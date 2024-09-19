import * as crypto from 'node:crypto'
import { existsSync as exists, writeFileSync, readFileSync } from 'node:fs'

import * as jose from 'jose'

const { homepage, name, version } = JSON.parse(
  readFileSync('package.json').toString(),
)

import * as api from './api.js'

const UUID = crypto.randomUUID()

const {
  PLAN_NAME = 'oidcc-client-basic-certification-test-plan',
  VARIANT = '{}',
  ALG = 'PS256',
} = process.env

switch (PLAN_NAME) {
  case 'oidcc-client-basic-certification-test-plan':
  case 'oidcc-client-test-plan':
  case 'oidcc-client-implicit-certification-test-plan':
  case 'oidcc-client-hybrid-certification-test-plan':
  case 'fapi1-advanced-final-client-test-plan':
  case 'fapi2-security-profile-id2-client-test-plan':
  case 'fapi2-message-signing-id1-client-test-plan':
    break
  default:
    throw new Error()
}

async function kid(jwk: jose.JWK) {
  return {
    ...jwk,
    kid: await jose.calculateJwkThumbprint(jwk),
  }
}

async function key(alg: string) {
  const kp = await jose.generateKeyPair(alg, { extractable: true })
  return kid({
    ...(await jose.exportJWK(kp.privateKey)),
    use: 'sig',
    alg,
  })
}

function needsSecret(variant: Record<string, string>) {
  switch (variant.client_auth_type) {
    case undefined:
    case 'client_secret_basic':
    case 'client_secret_post':
      return true
    default:
      return false
  }
}

const DEFAULTS: Record<typeof PLAN_NAME, Record<string, string>> = {
  'oidcc-client-test-plan': {
    response_mode: 'default',
    client_registration: 'static_client',
    request_type: 'plain_http_request', // plain_http_request, request_object
    response_type: 'code', // code, id_token
    client_auth_type: 'client_secret_basic', // none, client_secret_basic, client_secret_post, private_key_jwt
  },
  'oidcc-client-basic-certification-test-plan': {
    request_type: 'plain_http_request',
    client_registration: 'static_client',
  },
  'oidcc-client-implicit-certification-test-plan': {
    request_type: 'plain_http_request',
    client_registration: 'static_client',
  },
  'oidcc-client-hybrid-certification-test-plan': {
    request_type: 'plain_http_request',
    client_registration: 'static_client',
  },
  'fapi1-advanced-final-client-test-plan': {
    client_auth_type: 'private_key_jwt', // private_key_jwt, mtls
    fapi_auth_request_method: 'pushed', // pushed, by_value
    fapi_client_type: 'oidc', // oidc, plain_oauth
    fapi_profile: 'plain_fapi',
    fapi_response_mode: 'jarm', // jarm, plain_response
  },
  'fapi2-security-profile-id2-client-test-plan': {
    client_auth_type: 'private_key_jwt', // private_key_jwt, mtls
    sender_constrain: 'dpop', // dpop, mtls
    fapi_client_type: 'oidc', // oidc, plain_oauth
    fapi_profile: 'plain_fapi',
  },
  'fapi2-message-signing-id1-client-test-plan': {
    client_auth_type: 'private_key_jwt', // private_key_jwt, mtls
    sender_constrain: 'dpop', // dpop, mtls
    fapi_client_type: 'oidc', // oidc, plain_oauth
    fapi_profile: 'plain_fapi',
    fapi_request_method: 'signed_non_repudiation',
    fapi_response_mode: 'jarm',
  },
}

function needsClientCertificate(
  planName: string,
  variant: Record<string, string>,
) {
  return (
    variant.client_auth_type === 'mtls' ||
    variant.sender_constrain === 'mtls' ||
    planName.startsWith('fapi1')
  )
}

export function getScope(variant: Record<string, string>) {
  return variant.fapi_client_type === 'plain_oauth' ? 'email' : 'openid email'
}

export function logToActions(content: string) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, `${content}\n`, {
      flag: 'a',
    })
  }
}

function makePublicJwks(def: any) {
  const client = structuredClone(def)
  client.jwks.keys.forEach((jwk: any) => {
    delete jwk.d
    delete jwk.dp
    delete jwk.dq
    delete jwk.p
    delete jwk.q
    delete jwk.qi
  })
  return client
}

function pushEncryptionKey(def: any) {
  const client = structuredClone(def)
  const key = client.jwks.keys[0]
  client.jwks.keys.push({
    ...key,
    kid: `enc-${key.kid}`,
    use: 'enc',
    alg: 'RSA-OEAP',
  })
  return client
}

function ensureTestFile(path: string, name: string) {
  if (!exists(path)) {
    writeFileSync(
      path,
      `import test from 'ava'

test.todo('${name}')
`,
    )
  }
}

const variant = {
  ...DEFAULTS[PLAN_NAME],
  ...JSON.parse(VARIANT),
}

export default async () => {
  const clientConfig = {
    client_id: `client-${UUID}`,
    client_secret: needsSecret(variant) ? `client-${UUID}` : undefined,
    scope: getScope(variant),
    redirect_uri: `https://client-${UUID}.local/cb`,
    jwks: {
      keys: [await key(ALG)],
    },
    certificate: '',
    use_mtls_endpoint_aliases: false,
  }

  let mtls: { key: string; cert: string } | undefined

  if (needsClientCertificate(PLAN_NAME, variant)) {
    const { generate } = await import('selfsigned')
    const selfsigned = generate(undefined, { keySize: 2048 })
    clientConfig.certificate = selfsigned.cert
    mtls = {
      cert: selfsigned.cert,
      key: selfsigned.private,
    }
    clientConfig.use_mtls_endpoint_aliases = true
  }

  const configuration = {
    description: `${name.split('/').reverse()[0]}/${version} (${homepage})`,
    alias: UUID,
    client: clientConfig,
    waitTimeoutSeconds: 2,
    ...(PLAN_NAME.startsWith('fapi')
      ? {
          server: {
            jwks: {
              keys: [await key(ALG)],
            },
          },
        }
      : undefined),
  }

  const plan = await api.createTestPlan(
    PLAN_NAME,
    {
      ...configuration,
      client: makePublicJwks(clientConfig),
      client2: {
        ...pushEncryptionKey(makePublicJwks(clientConfig)),
        id_token_encrypted_response_alg: 'RSA-OAEP',
      },
    },
    variant,
  )

  const { certificationProfileName } = await api.getTestPlanInfo(plan)

  function logBoth(input: string) {
    console.log(input.replaceAll('`', '').replaceAll('**', ''))
    logToActions(input)
  }

  logBoth('Test Plan Details')
  logBoth('')
  logBoth(`- Name: **${PLAN_NAME}**`)
  logBoth(`- ID: **\`${plan.id}\`**`)
  logBoth('- Variant')
  for (const [key, value] of Object.entries(variant)) {
    logBoth(`  - ${key}: ${value}`)
  }
  if (certificationProfileName) {
    logBoth(`- Certification Profile Name: **${certificationProfileName}**`)
  } else {
    logBoth(`- Certification Profile Name: **N/A**`)
  }

  const files: Set<string> = new Set()
  for (const module of plan.modules) {
    switch (module.variant?.response_type) {
      case 'id_token token':
      case 'code token':
      case 'code id_token token':
        continue
    }
    const name = module.testModule.replace(
      /(?:fapi2-(?:security-profile-id2|message-signing-id1)|fapi1-advanced-final|oidcc)-client-test-/,
      '',
    )
    const path = `./conformance/modules/${name}.ts`
    ensureTestFile(path, name)
    files.add(path)
  }

  return {
    environmentVariables: {
      CONFORMANCE: JSON.stringify({
        configuration,
        variant,
        plan,
        mtls,
        ALG,
      }),
    },
    concurrency: 1,
    extensions: {
      ts: 'module',
      mjs: true,
    },
    files: [...new Set([...files].sort()), './conformance/download_archive.ts'],
    workerThreads: false,
    nodeArguments: ['--enable-source-maps'],
  }
}
