import anyTest from 'ava'
import type { ExecutionContext } from 'ava'
import type { Macro, TestFn } from 'ava'
import { importJWK, type JWK } from 'jose'
import * as undici from 'undici'
import { inspect } from 'node:util'

export const test = anyTest as TestFn<{ instance: Test }>

import { getScope } from './ava.config.js'
import * as lib from '../src/index.js'
import {
  createTestFromPlan,
  waitForState,
  getTestExposed,
  type ModulePrescription,
  type Plan,
  type Test,
} from './api.js'

const conformance = JSON.parse(process.env.CONFORMANCE!)

const configuration: {
  alias: string
  client: {
    client_id: string
    client_secret?: string
    redirect_uri: string
    use_mtls_endpoint_aliases: boolean
    jwks: {
      keys: Array<JWK & { kid: string }>
    }
  }
  client2: {
    jwks: {
      keys: Array<JWK & { kid: string }>
    }
  }
} = conformance.configuration

const ALG = conformance.ALG as string
export const plan: Plan = conformance.plan
export const variant: Record<string, string> = conformance.variant
export const mtls: { key: string; cert: string } = conformance.mtls || {}

let prefix = ''

switch (plan.name) {
  case 'fapi1-advanced-final-client-test-plan':
  case 'fapi2-security-profile-id2-client-test-plan':
    prefix = plan.name.slice(0, -4)
    break
  case 'fapi2-message-signing-id1-client-test-plan':
    prefix = 'fapi2-security-profile-id2-client-test-'
    break
  case 'oidcc-client-test-plan':
  case 'oidcc-client-basic-certification-test-plan':
  case 'oidcc-client-implicit-certification-test-plan':
  case 'oidcc-client-hybrid-certification-test-plan':
    prefix = 'oidcc-client-test-'
    break
  default:
    throw new Error()
}

async function importPrivateKey(alg: string, jwk: JWK) {
  const key = await importJWK<CryptoKey>(jwk, alg)
  if (!('type' in key)) {
    throw new Error()
  }
  return key
}

export function modules(metaUrl: string): ModulePrescription[] {
  const name = metaUrl.split('/').reverse()[0].replace('.ts', '')
  return conformance.plan.modules.filter((x: ModulePrescription) => {
    switch (x.variant?.response_type) {
      case 'id_token token':
      case 'code token':
      case 'code id_token token':
        return false
    }

    return (
      x.testModule ===
      (name === prefix.slice(0, -1) ? name : `${prefix}${name}`)
    )
  })
}

function usesJarm(variant: Record<string, string>) {
  return variant.fapi_response_mode === 'jarm'
}

function usesDpop(variant: Record<string, string>) {
  return variant.sender_constrain === 'dpop'
}

function usesPar(plan: Plan) {
  return (
    plan.name.startsWith('fapi2') ||
    variant.fapi_auth_request_method === 'pushed'
  )
}

export function nonRepudiation(plan: Plan) {
  return (
    plan.name.startsWith('fapi2-message-signing') ||
    plan.name.startsWith('fapi1')
  )
}

function usesRequestObject(planName: string, variant: Record<string, string>) {
  if (planName.startsWith('fapi1')) {
    return true
  }

  if (planName.startsWith('fapi2-message-signing')) {
    return true
  }

  if (variant.request_type === 'request_object') {
    return true
  }

  return false
}

function requiresNonce(planName: string, variant: Record<string, string>) {
  return (
    responseType(planName, variant).includes('id_token') ||
    (planName.startsWith('fapi1') && getScope(variant).includes('openid'))
  )
}

function requiresState(planName: string, variant: Record<string, string>) {
  return planName.startsWith('fapi1') && !getScope(variant).includes('openid')
}

function responseType(planName: string, variant: Record<string, string>) {
  if (variant.response_type) {
    return variant.response_type
  }

  if (!planName.startsWith('fapi1')) {
    return 'code'
  }

  return variant.fapi_response_mode === 'jarm' ? 'code' : 'code id_token'
}

export interface MacroOptions {
  useNonce?: boolean
  useState?: boolean
}

export const flow = (options?: MacroOptions) => {
  return test.macro({
    async exec(t, module: ModulePrescription) {
      t.timeout(15000)

      const instance = await createTestFromPlan(plan, module)
      t.context.instance = instance

      t.log('Test ID', instance.id)
      t.log('Test Name', instance.name)

      const variant: Record<string, string> = {
        ...conformance.variant,
        ...module.variant,
      }
      t.log('variant', variant)

      const { issuer: issuerIdentifier, accounts_endpoint } =
        await getTestExposed(instance)

      if (!issuerIdentifier) {
        throw new Error()
      }

      const issuer = new URL(issuerIdentifier)

      const metadata: lib.ClientMetadata = {
        client_id: configuration.client.client_id,
        client_secret: configuration.client.client_secret,
        use_mtls_endpoint_aliases:
          configuration.client.use_mtls_endpoint_aliases,
      }

      switch (variant.client_auth_type) {
        case 'mtls':
          metadata.token_endpoint_auth_method = 'self_signed_tls_client_auth'
          break
        case 'none':
        case 'private_key_jwt':
        case 'client_secret_basic':
        case 'client_secret_post':
          metadata.token_endpoint_auth_method = variant.client_auth_type
          break
      }

      if (instance.name.includes('client-secret-basic')) {
        metadata.token_endpoint_auth_method = 'client_secret_basic'
      }

      // @ts-expect-error
      const mtlsFetch: typeof fetch = (...args: Parameters<typeof fetch>) => {
        // @ts-expect-error
        return undici.fetch(args[0], {
          ...args[1],
          dispatcher: new undici.Agent({
            connect: {
              key: mtls.key,
              cert: mtls.cert,
            },
          }),
        })
      }

      const mtlsAuth = variant.client_auth_type === 'mtls'
      const mtlsConstrain =
        plan.name.startsWith('fapi1') || variant.sender_constrain === 'mtls'

      const execute: Array<(config: lib.Configuration) => void> = []

      const response_type = responseType(plan.name, variant)

      if (nonRepudiation(plan)) {
        execute.push(lib.enableNonRepudiationChecks)
      }

      if (usesJarm(variant)) {
        execute.push(lib.useJwtResponseMode)
      }

      if (response_type === 'code id_token') {
        execute.push(lib.useCodeIdTokenResponseType)
        if (plan.name.startsWith('fapi1')) {
          execute.push(lib.enableDetachedSignatureResponseChecks)
        }
      }

      const [jwk] = configuration.client.jwks.keys
      const clientPrivateKey = {
        kid: jwk.kid,
        key: await importPrivateKey(ALG, jwk),
      }

      let clientAuth: lib.ClientAuth | undefined
      if (metadata.token_endpoint_auth_method === 'private_key_jwt') {
        clientAuth = lib.PrivateKeyJwt(clientPrivateKey, {
          [lib.modifyAssertion]: (_header, payload) => {
            payload.aud = [
              client.serverMetadata().issuer,
              client.serverMetadata().token_endpoint!,
            ]
          },
        })
      } else if (
        metadata.token_endpoint_auth_method === 'client_secret_basic'
      ) {
        clientAuth = lib.ClientSecretBasic(metadata.client_secret as string)
      }

      const client = await lib.discovery(
        issuer,
        configuration.client.client_id,
        metadata,
        clientAuth,
        {
          execute,
          [lib.customFetch]:
            mtlsAuth || mtlsConstrain || metadata.use_mtls_endpoint_aliases
              ? mtlsFetch
              : undefined,
        },
      )

      if (module.testModule.includes('encrypted')) {
        const jwk = configuration.client.jwks.keys[0]
        const key = await importPrivateKey('RSA-OAEP', jwk)
        lib.enableDecryptingResponses(client, {
          key,
          kid: `enc-${jwk.kid}`,
        })
      }

      t.log('AS Metadata discovered for', issuer.href)

      const DPoP = usesDpop(variant)
        ? lib.getDPoPHandle(client, await lib.randomDPoPKeyPair(ALG))
        : undefined

      let code_challenge: string | undefined
      let code_verifier: string | undefined
      let code_challenge_method: string | undefined

      if (response_type.includes('code')) {
        code_verifier = lib.randomPKCECodeVerifier()
        code_challenge = await lib.calculatePKCECodeChallenge(code_verifier)
        code_challenge_method = 'S256'
      }

      const scope = getScope(variant)
      let nonce =
        options?.useNonce || requiresNonce(plan.name, variant)
          ? lib.randomNonce()
          : undefined
      let state =
        options?.useState || requiresState(plan.name, variant)
          ? lib.randomState()
          : undefined

      let params: URLSearchParams = new URLSearchParams()
      if (code_challenge) {
        params.set('code_challenge', code_challenge)
      }
      if (code_challenge_method) {
        params.set('code_challenge_method', code_challenge_method)
      }
      params.set('redirect_uri', configuration.client.redirect_uri)
      params.set('scope', scope)
      if (typeof nonce === 'string') {
        params.set('nonce', nonce)
      }
      if (typeof state === 'string') {
        params.set('state', state)
      }

      if (usesRequestObject(plan.name, variant)) {
        ;({ searchParams: params } = await lib.buildAuthorizationUrlWithJAR(
          client,
          params,
          clientPrivateKey,
        ))
      }

      let authorizationUrl: URL

      if (usesPar(plan)) {
        t.log('PAR request with', Object.fromEntries(params.entries()))
        authorizationUrl = await lib.buildAuthorizationUrlWithPAR(
          client,
          params,
          {
            DPoP,
          },
        )
        t.log(
          'PAR request_uri',
          authorizationUrl.searchParams.get('request_uri'),
        )
      } else {
        if (params.has('request') && plan.name.startsWith('fapi1')) {
          const plain = lib.buildAuthorizationUrl(client, {})
          params.set('response_type', plain.searchParams.get('response_type')!)
          params.set('scope', 'openid')
        }
        if (response_type === 'id_token') {
          params.set('response_type', response_type)
        }
        authorizationUrl = lib.buildAuthorizationUrl(client, params)
      }

      await Promise.allSettled([
        fetch(authorizationUrl.href, { redirect: 'manual' }),
      ])

      t.log(
        'redirect with',
        Object.fromEntries(authorizationUrl.searchParams.entries()),
      )

      const { authorization_endpoint_response_redirect } =
        await getTestExposed(instance)

      if (!authorization_endpoint_response_redirect) {
        throw new Error()
      }

      let currentUrl = new URL(authorization_endpoint_response_redirect)

      t.log('response redirect to', currentUrl.href)

      const response = await lib.authorizationCodeGrant(
        client,
        currentUrl,
        {
          expectedNonce: nonce,
          expectedState: state,
          pkceCodeVerifier: code_verifier,
        },
        undefined,
        { DPoP },
      )

      t.log('token endpoint response', { ...response })

      if (
        !plan.name.startsWith('fapi1') &&
        scope.includes('openid') &&
        client.serverMetadata().userinfo_endpoint
      ) {
        // fetch userinfo response
        t.log('fetching', client.serverMetadata().userinfo_endpoint)
        const userinfo = await lib.fetchUserInfo(
          client,
          response.access_token,
          response.claims()?.sub!,
          {
            DPoP,
          },
        )
        t.log('userinfo endpoint response', { ...userinfo })
      }

      if (accounts_endpoint) {
        const resource = await lib.fetchProtectedResource(
          client,
          response.access_token,
          new URL(accounts_endpoint),
          'GET',
          null,
          undefined,
          { DPoP },
        )

        const result = await resource.text()
        try {
          t.log('accounts endpoint response', JSON.parse(result))
        } catch {
          t.log('accounts endpoint response body', result)
        }
      }

      await waitForState(instance)
      if (module.skipLogTestFinished !== true) {
        t.log('Test Finished')
      }
      t.pass()
    },
    title(providedTitle = '', module: ModulePrescription) {
      if (module.variant) {
        return `${providedTitle}${plan.name} (${plan.id}) - ${module.testModule} - ${JSON.stringify(
          module.variant,
        )}`
      }
      return `${providedTitle}${plan.name} (${plan.id}) - ${module.testModule}`
    },
  })
}

interface ErrorAssertion {
  name: string
  code: string
  message: string | RegExp
}

export type CodeErrorAssertion = Partial<ErrorAssertion> &
  Pick<ErrorAssertion, 'code'>
export type NameErrorAssertion = Partial<ErrorAssertion> &
  Pick<ErrorAssertion, 'name'>

function assertError(
  t: ExecutionContext,
  actual: unknown,
  expected: Partial<ErrorAssertion>,
) {
  if (!(actual instanceof Error)) {
    t.fail('expected and Error instance')
  }

  // @ts-ignore
  if (expected.code) t.is(actual.code, expected.code)
  if (expected.name) t.is(actual.name, expected.name)
  if (expected.message) {
    if (typeof expected.message === 'string') {
      t.is(actual.message, expected.message)
    } else {
      t.regex(actual.message, expected.message)
    }
  }
}

export const rejects = (
  macro: Macro<[module: ModulePrescription], { instance: Test }>,
) => {
  return test.macro({
    async exec(
      t,
      module: ModulePrescription,
      expected: CodeErrorAssertion | NameErrorAssertion,
      cause?: CodeErrorAssertion | NameErrorAssertion,
    ) {
      const err = await t.throwsAsync(
        () => macro.exec(t, { ...module, skipLogTestFinished: true }) as any,
      )
      t.log('rejected with', inspect(err, { depth: Infinity }))

      assertError(t, err, expected)

      if (cause) {
        if (!(err.cause instanceof Error)) {
          t.fail('expected and Error instance')
        }
        t.truthy(
          err.cause,
          'expected err to have a [cause] that is an Error instance',
        )

        if (typeof cause !== 'boolean') {
          assertError(t, err.cause, cause)
        }
      }

      await waitForState(t.context.instance)
      t.log('Test Finished')
      t.pass()
    },
    title: <any>macro.title,
  })
}

export const skippable = (
  macro: Macro<[module: ModulePrescription], { instance: Test }>,
) => {
  return test.macro({
    async exec(t, module: ModulePrescription) {
      await Promise.allSettled([
        macro.exec(t, { ...module, skipLogTestFinished: true }),
      ])

      await waitForState(t.context.instance, {
        results: new Set(['SKIPPED', 'PASSED']),
      })
      t.log('Test Finished')
      t.pass()
    },
    title: <any>macro.title,
  })
}
