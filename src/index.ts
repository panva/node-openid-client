import * as oauth from 'oauth4webapi'
import * as jose from 'jose'
import { JOSEError } from 'jose/errors'

let headers: Record<string, string>
let USER_AGENT: string
if (
  // @ts-ignore
  typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ') // prettier-ignore
) {
  const NAME = 'openid-client'
  const VERSION = 'v5.7.0'
  USER_AGENT = `${NAME}/${VERSION}`
  headers = { 'user-agent': USER_AGENT }
}

/**
 * @ignore
 */
export type CryptoKey = Extract<
  Awaited<ReturnType<typeof crypto.subtle.generateKey>>,
  { type: string }
>

export interface CryptoKeyPair {
  privateKey: CryptoKey
  publicKey: CryptoKey
}

interface Internal {
  __proto__: null
  as: Readonly<ServerMetadata>
  c: Readonly<oauth.Client>
  fetch?: CustomFetch
  timeout?: number
  tlsOnly: boolean
  auth: ClientAuth
  jarm?: JARMImplementation
  hybrid?: HybridImplementation
  nonRepudiation?: NonRepudiationImplementation
  decrypt?: oauth.JweDecryptFunction
}

const int = (config: Configuration) => {
  return props.get(config)!
}

let props!: WeakMap<Configuration, Internal>

export {
  // Errors
  AuthorizationResponseError,
  ResponseBodyError,
  WWWAuthenticateChallengeError,

  // Type aliases
  type AuthorizationDetails,
  type ConfirmationClaims,
  type DeviceAuthorizationResponse,
  type GenerateKeyPairOptions,
  type IDToken,
  type IntrospectionResponse,
  type JsonArray,
  type JsonObject,
  type JsonPrimitive,
  type JsonValue,
  type JWSAlgorithm,
  type ModifyAssertionFunction,
  type ModifyAssertionOptions,
  type MTLSEndpointAliases,
  type PrivateKey,
  type TokenEndpointResponse,
  type UserInfoAddress,
  type UserInfoResponse,
  type WWWAuthenticateChallenge,
  type WWWAuthenticateChallengeParameters,
} from 'oauth4webapi'

/**
 * Implementation of the Client's Authentication Method at the Authorization
 * Server.
 *
 * The default is {@link ClientSecretPost} if {@link ClientMetadata.client_secret}
 * is present, {@link None} otherwise.
 *
 * Other Client Authentication Methods must be provided explicitly and their
 * implementations are linked below.
 *
 * @see {@link ClientSecretBasic}
 * @see {@link ClientSecretJwt}
 * @see {@link ClientSecretPost}
 * @see {@link None}
 * @see {@link PrivateKeyJwt}
 * @see {@link TlsClientAuth}
 */
export type ClientAuth = (
  as: ServerMetadata,
  client: ClientMetadata,
  body: URLSearchParams,
  headers: Headers,
) => void

/**
 * **`client_secret_post`** uses the HTTP request body to send `client_id` and
 * `client_secret` as `application/x-www-form-urlencoded` body parameters
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientSecret!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.ClientSecretPost(clientSecret),
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let server!: client.ServerMetadata
 * let clientId!: string
 * let clientSecret!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = new client.Configuration(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.ClientSecretPost(clientSecret),
 * )
 * ```
 *
 * @param clientSecret Client Secret
 *
 * @group Client Authentication Methods
 *
 * @see [OAuth Token Endpoint Authentication Methods](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#token-endpoint-auth-method)
 * @see [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3)
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
 */
export function ClientSecretPost(clientSecret: string): ClientAuth {
  return oauth.ClientSecretPost(clientSecret)
}

/**
 * **`client_secret_basic`** uses the HTTP `Basic` authentication scheme to send
 * `client_id` and `client_secret` in an `Authorization` HTTP Header.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientSecret!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.ClientSecretBasic(clientSecret),
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let server!: client.ServerMetadata
 * let clientId!: string
 * let clientSecret!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = new client.Configuration(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.ClientSecretBasic(clientSecret),
 * )
 * ```
 *
 * @param clientSecret Client Secret
 *
 * @group Client Authentication Methods
 *
 * @see [OAuth Token Endpoint Authentication Methods](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#token-endpoint-auth-method)
 * @see [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3)
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
 */
export function ClientSecretBasic(clientSecret: string): ClientAuth {
  return oauth.ClientSecretBasic(clientSecret)
}

/**
 * **`client_secret_jwt`** uses the HTTP request body to send `client_id`,
 * `client_assertion_type`, and `client_assertion` as
 * `application/x-www-form-urlencoded` body parameters. HMAC is used for the
 * assertion's authenticity and integrity.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientSecret!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.ClientSecretJwt(clientSecret),
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let server!: client.ServerMetadata
 * let clientId!: string
 * let clientSecret!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = new client.Configuration(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.ClientSecretJwt(clientSecret),
 * )
 * ```
 *
 * @param clientSecret Client Secret
 * @param options
 *
 * @group Client Authentication Methods
 *
 * @see [OAuth Token Endpoint Authentication Methods](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#token-endpoint-auth-method)
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
 */
export function ClientSecretJwt(
  clientSecret: string,
  options?: oauth.ModifyAssertionOptions,
): ClientAuth {
  return oauth.ClientSecretJwt(clientSecret, options)
}

/**
 * **`none`** (public client) uses the HTTP request body to send only
 * `client_id` as `application/x-www-form-urlencoded` body parameter.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.None(),
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let server!: client.ServerMetadata
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = new client.Configuration(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.None(),
 * )
 * ```
 *
 * @group Client Authentication Methods
 *
 * @see [OAuth Token Endpoint Authentication Methods](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#token-endpoint-auth-method)
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
 */
export function None(): ClientAuth {
  return oauth.None()
}

/**
 * **`private_key_jwt`** uses the HTTP request body to send `client_id`,
 * `client_assertion_type`, and `client_assertion` as
 * `application/x-www-form-urlencoded` body parameters. Digital signature is
 * used for the assertion's authenticity and integrity.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let key!: client.CryptoKey | client.PrivateKey
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.PrivateKeyJwt(key),
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let server!: client.ServerMetadata
 * let key!: client.CryptoKey | client.PrivateKey
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 *
 * let config = new client.Configuration(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.PrivateKeyJwt(key),
 * )
 * ```
 *
 * @param clientPrivateKey
 *
 * @group Client Authentication Methods
 *
 * @see [OAuth Token Endpoint Authentication Methods](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#token-endpoint-auth-method)
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
 */
export function PrivateKeyJwt(
  clientPrivateKey: CryptoKey | oauth.PrivateKey,
  options?: oauth.ModifyAssertionOptions,
): ClientAuth {
  return oauth.PrivateKeyJwt(clientPrivateKey, options)
}

/**
 * **`tls_client_auth`** uses the HTTP request body to send only `client_id` as
 * `application/x-www-form-urlencoded` body parameter and the mTLS key and
 * certificate is configured through
 * {@link ClientMetadata.use_mtls_endpoint_aliases} and {@link customFetch}.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 *
 * let clientMetadata = { use_mtls_endpoint_aliases: true }
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.TlsClientAuth(),
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let server!: client.ServerMetadata
 * let clientId!: string
 *
 * let clientMetadata = { use_mtls_endpoint_aliases: true }
 * let config = new client.Configuration(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   client.TlsClientAuth(),
 * )
 * ```
 *
 * @group Client Authentication Methods
 *
 * @see [OAuth Token Endpoint Authentication Methods](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#token-endpoint-auth-method)
 * @see [RFC 8705 - OAuth 2.0 Mutual-TLS Client Authentication (PKI Mutual-TLS Method)](https://www.rfc-editor.org/rfc/rfc8705.html#name-pki-mutual-tls-method)
 */
export function TlsClientAuth(): ClientAuth {
  return oauth.TlsClientAuth()
}

/**
 * DANGER ZONE - This option has security implications that must be understood,
 * assessed for applicability, and accepted before use.
 *
 * Use this as a value for `state` check state parameter options to skip the
 * `state` value check. This should only be done if the `state` parameter value
 * used is integrity protected (and its integrity and expiration is checked) and
 * bound to the browsing session. One such mechanism to do so is described in an
 * I-D
 * [draft-bradley-oauth-jwt-encoded-state-09](https://datatracker.ietf.org/doc/html/draft-bradley-oauth-jwt-encoded-state-09).
 *
 * @deprecated Marked as deprecated only to make it stand out as something you
 *   shouldn't use unless you've assessed the implications.
 */
export const skipStateCheck: typeof oauth.skipStateCheck = oauth.skipStateCheck

/**
 * DANGER ZONE - This option has security implications that must be understood,
 * assessed for applicability, and accepted before use.
 *
 * Use this as a value to {@link fetchUserInfo} `expectedSubject` parameter to
 * skip the `sub` claim value check.
 *
 * @deprecated Marked as deprecated only to make it stand out as something you
 *   shouldn't use unless you've assessed the implications.
 *
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#UserInfoResponse)
 */
export const skipSubjectCheck: typeof oauth.skipSubjectCheck =
  oauth.skipSubjectCheck

/**
 * When set on a {@link Configuration}, this replaces the use of global fetch. As
 * a fetch replacement the arguments and expected return are the same as fetch.
 *
 * In theory any module that claims to be compatible with the
 * {@link !fetch Fetch API} can be used but your mileage may vary. No workarounds
 * to allow use of non-conform {@link !Response} instances will be considered.
 *
 * If you only need to update the {@link !Request} properties you do not need to
 * use a {@link !fetch Fetch API} module, just change what you need and pass it
 * to globalThis.fetch just like this module would normally do.
 *
 * Its intended use cases are:
 *
 * - {@link !Request}/{@link !Response} tracing and logging
 * - Custom caching strategies
 * - Changing the {@link !Request} properties like headers, body, credentials, mode
 *   before it is passed to fetch
 *
 * Known caveats:
 *
 * - Expect Type-related issues when passing the inputs through to fetch-like
 *   modules, they hardly ever get their typings inline with actual fetch, you
 *   should `@ts-expect-error` them.
 * - Returning self-constructed {@link !Response} instances prohibits
 *   AS/RS-signalled DPoP Nonce caching.
 *
 * @example
 *
 * Using [sindresorhus/ky](https://github.com/sindresorhus/ky) for retries and
 * its hooks feature for logging outgoing requests and their responses.
 *
 * ```ts
 * import ky from 'ky'
 *
 * let config!: client.Configuration
 * let logRequest!: (request: Request) => void
 * let logResponse!: (request: Request, response: Response) => void
 * let logRetry!: (
 *   request: Request,
 *   error: Error,
 *   retryCount: number,
 * ) => void
 *
 * config[client.customFetch] = (...args) =>
 *   ky(args[0], {
 *     ...args[1],
 *     hooks: {
 *       beforeRequest: [
 *         (request) => {
 *           logRequest(request)
 *         },
 *       ],
 *       beforeRetry: [
 *         ({ request, error, retryCount }) => {
 *           logRetry(request, error, retryCount)
 *         },
 *       ],
 *       afterResponse: [
 *         (request, _, response) => {
 *           logResponse(request, response)
 *         },
 *       ],
 *     },
 *   })
 * ```
 *
 * @example
 *
 * Using [nodejs/undici](https://github.com/nodejs/undici) to detect and use
 * HTTP proxies.
 *
 * ```ts
 * import * as undici from 'undici'
 *
 * // see https://undici.nodejs.org/#/docs/api/EnvHttpProxyAgent
 * let envHttpProxyAgent = new undici.EnvHttpProxyAgent()
 *
 * let config!: client.Configuration
 *
 * // @ts-ignore
 * config[client.customFetch] = (...args) => {
 *   // @ts-ignore
 *   return undici.fetch(args[0], { ...args[1], dispatcher: envHttpProxyAgent }) // prettier-ignore
 * }
 * ```
 *
 * @example
 *
 * Using [nodejs/undici](https://github.com/nodejs/undici) to automatically
 * retry network errors.
 *
 * ```ts
 * import * as undici from 'undici'
 *
 * // see https://undici.nodejs.org/#/docs/api/RetryAgent
 * let retryAgent = new undici.RetryAgent(new undici.Agent(), {
 *   statusCodes: [],
 *   errorCodes: [
 *     'ECONNRESET',
 *     'ECONNREFUSED',
 *     'ENOTFOUND',
 *     'ENETDOWN',
 *     'ENETUNREACH',
 *     'EHOSTDOWN',
 *     'UND_ERR_SOCKET',
 *   ],
 * })
 *
 * let config!: client.Configuration
 *
 * // @ts-ignore
 * config[client.customFetch] = (...args) => {
 *   // @ts-ignore
 *   return undici.fetch(args[0], { ...args[1], dispatcher: retryAgent }) // prettier-ignore
 * }
 * ```
 *
 * @example
 *
 * Using [nodejs/undici](https://github.com/nodejs/undici) to mock responses in
 * tests.
 *
 * ```ts
 * import * as undici from 'undici'
 *
 * // see https://undici.nodejs.org/#/docs/api/MockAgent
 * let mockAgent = new undici.MockAgent()
 * mockAgent.disableNetConnect()
 *
 * let config!: client.Configuration
 *
 * // @ts-ignore
 * config[client.customFetch] = (...args) => {
 *   // @ts-ignore
 *   return undici.fetch(args[0], { ...args[1], dispatcher: mockAgent }) // prettier-ignore
 * }
 * ```
 */
export const customFetch: typeof oauth.customFetch = oauth.customFetch

/**
 * Use to mutate JWT header and payload before they are signed. Its intended use
 * is working around non-conform server behaviours, such as modifying JWT "aud"
 * (audience) claims, or otherwise changing fixed claims used by this library.
 *
 * @example
 *
 * Changing Private Key JWT client assertion audience issued from a string to an
 * array
 *
 * ```ts
 * let key!: client.CryptoKey | client.PrivateKey
 * let aud!: string[]
 *
 * let clientAuth = client.PrivateKeyJwt(key, {
 *   [client.modifyAssertion](header, payload) {
 *     payload.aud = aud
 *   },
 * })
 * ```
 *
 * @example
 *
 * Changing Request Object issued by {@link buildAuthorizationUrlWithJAR} to have
 * an expiration of 5 minutes
 *
 * ```ts
 * let key!: client.CryptoKey | client.PrivateKey
 * let config!: client.Configuration
 * let parameters!: URLSearchParams
 *
 * let redirectTo = client.buildAuthorizationUrlWithJAR(
 *   config,
 *   parameters,
 *   key,
 *   {
 *     [client.modifyAssertion](header, payload) {
 *       payload.exp = <number>payload.iat + 300
 *     },
 *   },
 * )
 * ```
 *
 * @example
 *
 * Changing the `alg: "Ed25519"` back to `alg: "EdDSA"`
 *
 * ```ts
 * let key!: client.CryptoKey | client.PrivateKey
 * let config!: client.Configuration
 * let parameters!: URLSearchParams
 * let keyPair!: client.CryptoKeyPair
 *
 * let remapEd25519: client.ModifyAssertionOptions = {
 *   [client.modifyAssertion]: (header) => {
 *     if (header.alg === 'Ed25519') {
 *       header.alg = 'EdDSA'
 *     }
 *   },
 * }
 *
 * // For JAR
 * client.buildAuthorizationUrlWithJAR(
 *   config,
 *   parameters,
 *   key,
 *   remapEd25519,
 * )
 *
 * // For Private Key JWT
 * client.PrivateKeyJwt(key, remapEd25519)
 *
 * // For DPoP
 * client.getDPoPHandle(config, keyPair, remapEd25519)
 * ```
 */
export const modifyAssertion: typeof oauth.modifyAssertion =
  oauth.modifyAssertion

/**
 * Use to adjust the assumed current time. Positive and negative finite values
 * representing seconds are allowed. Default is `0` (Date.now() + 0 seconds is
 * used).
 *
 * @example
 *
 * When the local clock is mistakenly 1 hour in the past
 *
 * ```ts
 * let clientMetadata: client.ClientMetadata = {
 *   client_id: 'abc4ba37-4ab8-49b5-99d4-9441ba35d428',
 *   // ... other metadata
 *   [client.clockSkew]: +(60 * 60),
 * }
 * ```
 *
 * @example
 *
 * When the local clock is mistakenly 1 hour in the future
 *
 * ```ts
 * let clientMetadata: client.ClientMetadata = {
 *   client_id: 'abc4ba37-4ab8-49b5-99d4-9441ba35d428',
 *   // ... other metadata
 *   [client.clockSkew]: -(60 * 60),
 * }
 * ```
 */

export const clockSkew: typeof oauth.clockSkew = oauth.clockSkew
/**
 * Use to set allowed clock tolerance when checking DateTime JWT Claims. Only
 * positive finite values representing seconds are allowed. Default is `30` (30
 * seconds).
 *
 * @example
 *
 * Tolerate 30 seconds clock skew when validating JWT claims like exp or nbf.
 *
 * ```ts
 * let clientMetadata: client.ClientMetadata = {
 *   client_id: 'abc4ba37-4ab8-49b5-99d4-9441ba35d428',
 *   // ... other metadata
 *   [client.clockTolerance]: 30,
 * }
 * ```
 */
export const clockTolerance: typeof oauth.clockTolerance = oauth.clockTolerance

export type FetchBody =
  | ArrayBuffer
  | null
  | ReadableStream
  | string
  | Uint8Array
  | undefined
  | URLSearchParams

/**
 * DPoP handle to use for requesting a sender-constrained access token. Obtained
 * from {@link getDPoPHandle}
 *
 * @see {@link !DPoP RFC 9449 - OAuth 2.0 Demonstrating Proof of Possession (DPoP)}
 */
export interface DPoPHandle extends oauth.DPoPHandle {}

/**
 * A subset of the [IANA OAuth Client Metadata
 * registry](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#client-metadata)
 * that has an effect on how the Client functions
 *
 * @group You are probably looking for this
 */
export interface ClientMetadata extends oauth.Client {
  /**
   * Client secret.
   */
  client_secret?: string

  /**
   * Indicates the requirement for a client to use mutual TLS endpoint aliases
   * indicated by the
   * {@link ServerMetadata.mtls_endpoint_aliases Authorization Server Metadata}.
   * Default is `false`.
   *
   * When combined with {@link customFetch} (to use a {@link !fetch Fetch API}
   * implementation that supports client certificates) this can be used to
   * target security profiles that utilize Mutual-TLS for either client
   * authentication or sender constraining.
   *
   * @example
   *
   * (Node.js) Using [nodejs/undici](https://github.com/nodejs/undici) for
   * Mutual-TLS Client Authentication and Certificate-Bound Access Tokens
   * support.
   *
   * ```ts
   * import * as undici from 'undici'
   *
   * let config!: client.Configuration
   * let key!: string // PEM-encoded key
   * let cert!: string // PEM-encoded certificate
   *
   * let agent = new undici.Agent({ connect: { key, cert } })
   *
   * config[client.customFetch] = (...args) =>
   *   // @ts-expect-error
   *   undici.fetch(args[0], { ...args[1], dispatcher: agent })
   * ```
   *
   * @example
   *
   * (Deno) Using Deno.createHttpClient API for Mutual-TLS Client Authentication
   * and Certificate-Bound Access Tokens support.
   *
   * ```ts
   * let config!: client.Configuration
   * let key!: string // PEM-encoded key
   * let cert!: string // PEM-encoded certificate
   *
   * // @ts-expect-error
   * let agent = Deno.createHttpClient({ key, cert })
   *
   * config[client.customFetch] = (...args) =>
   *   // @ts-expect-error
   *   fetch(args[0], { ...args[1], client: agent })
   * ```
   *
   * @see [RFC 8705 - OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens](https://www.rfc-editor.org/rfc/rfc8705.html)
   */
  use_mtls_endpoint_aliases?: boolean
}
/**
 * Authorization Server Metadata
 *
 * @group You are probably looking for this
 *
 * @see [IANA OAuth Authorization Server Metadata registry](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#authorization-server-metadata)
 */
export interface ServerMetadata extends oauth.AuthorizationServer {}

const ERR_INVALID_ARG_VALUE = 'ERR_INVALID_ARG_VALUE'
const ERR_INVALID_ARG_TYPE = 'ERR_INVALID_ARG_TYPE'

type codes = typeof ERR_INVALID_ARG_VALUE | typeof ERR_INVALID_ARG_TYPE

function CodedTypeError(message: string, code: codes, cause?: unknown) {
  const err = new TypeError(message, { cause })
  Object.assign(err, { code })
  return err
}

/**
 * Calculates the PKCE `code_challenge` value to send with an authorization
 * request using the S256 PKCE Code Challenge Method transformation
 *
 * @param codeVerifier `code_verifier` value generated e.g. from
 *   {@link randomPKCECodeVerifier}
 *
 * @returns S256 `code_challenge` value calculated from a provided
 *   `code_verifier`
 *
 * @group PKCE
 * @group Authorization Request
 */
export function calculatePKCECodeChallenge(codeVerifier: string) {
  return oauth.calculatePKCECodeChallenge(codeVerifier)
}

/**
 * @returns Random `code_verifier` value
 *
 * @group PKCE
 */
export function randomPKCECodeVerifier() {
  return oauth.generateRandomCodeVerifier()
}

/**
 * @returns Random `nonce` value
 *
 * @group Authorization Request
 */
export function randomNonce() {
  return oauth.generateRandomNonce()
}

/**
 * @returns Random `state` value
 *
 * @group Authorization Request
 */
export function randomState() {
  return oauth.generateRandomState()
}

/**
 * @group Errors
 */
export class ClientError extends Error {
  code?: string

  /**
   * @internal
   */
  constructor(message?: string, options?: { cause?: unknown; code?: string }) {
    super(message, options)
    this.name = this.constructor.name
    this.code = options?.code
    // @ts-ignore
    Error.captureStackTrace?.(this, this.constructor)
  }
}

const decoder = new TextDecoder()

function e(msg: string, cause: unknown, code?: string): ClientError {
  return new ClientError(msg, { cause, code })
}

function errorHandler(err: unknown): never {
  if (
    err instanceof TypeError ||
    err instanceof ClientError ||
    err instanceof oauth.ResponseBodyError ||
    err instanceof oauth.AuthorizationResponseError ||
    err instanceof oauth.WWWAuthenticateChallengeError
  ) {
    throw err
  }

  if (err instanceof oauth.OperationProcessingError) {
    switch (err.code) {
      case oauth.HTTP_REQUEST_FORBIDDEN:
        throw e('only requests to HTTPS are allowed', err, err.code)
      case oauth.REQUEST_PROTOCOL_FORBIDDEN:
        throw e('only requests to HTTP or HTTPS are allowed', err, err.code)
      case oauth.RESPONSE_IS_NOT_CONFORM:
        throw e('unexpected HTTP response status code', err.cause, err.code)
      case oauth.RESPONSE_IS_NOT_JSON:
        throw e('unexpected response content-type', err.cause, err.code)
      case oauth.PARSE_ERROR:
        throw e('parsing error occured', err, err.code)
      case oauth.INVALID_RESPONSE:
        throw e('invalid response encountered', err, err.code)
      case oauth.JWT_CLAIM_COMPARISON:
        throw e('unexpected JWT claim value encountered', err, err.code)
      case oauth.JSON_ATTRIBUTE_COMPARISON:
        throw e('unexpected JSON attribute value encountered', err, err.code)
      case oauth.JWT_TIMESTAMP_CHECK:
        throw e('JWT timestamp claim value failed validation', err, err.code)
      default:
        throw e(err.message, err, err.code)
    }
  }

  if (err instanceof oauth.UnsupportedOperationError) {
    throw e('unsupported operation', err, err.code)
  }

  if (err instanceof DOMException) {
    switch (err.name) {
      // WebCryptoAPI
      case 'OperationError':
        throw e('runtime operation error', err, oauth.UNSUPPORTED_OPERATION)
      case 'NotSupportedError':
        throw e(
          'runtime unsupported operation',
          err,
          oauth.UNSUPPORTED_OPERATION,
        )

      // AbortSignal
      case 'TimeoutError':
        throw e('operation timed out', err, 'OAUTH_TIMEOUT')
      case 'AbortError':
        throw e('operation aborted', err, 'OAUTH_ABORT')
    }
  }

  throw new ClientError('something went wrong', { cause: err })
}

/**
 * Generates random {@link CryptoKeyPair} to sign DPoP Proof JWTs with
 *
 * @param alg One of the supported {@link JWSAlgorithm JWS Algorithm}
 *   identifiers. Default is `ES256`.
 * @param options
 *
 * @group DPoP
 *
 * @see {@link !DPoP}
 */
export function randomDPoPKeyPair(
  alg?: string,
  options?: oauth.GenerateKeyPairOptions,
): Promise<CryptoKeyPair> {
  return oauth
    .generateKeyPair(alg ?? 'ES256', {
      extractable: options?.extractable,
    })
    .catch(errorHandler)
}

export interface DiscoveryRequestOptions {
  /**
   * Custom {@link !fetch Fetch API} implementation to use for the HTTP Requests
   * the client will be making.
   *
   * @see {@link customFetch}
   */
  [customFetch]?: CustomFetch

  /**
   * The issuer transformation algorithm to use. Default is `oidc`.
   *
   * Note: This has no effect if the first argument is a URL with a pathname
   * containing `/.well-known/`.
   *
   * @example
   *
   * ```txt
   * Given the Issuer Identifier is https://example.com
   *   oidc  => https://example.com/.well-known/openid-configuration
   *   oauth => https://example.com/.well-known/oauth-authorization-server
   *
   * Given the Issuer Identifier is https://example.com/pathname
   *   oidc  => https://example.com/pathname/.well-known/openid-configuration
   *   oauth => https://example.com/.well-known/oauth-authorization-server/pathname
   * ```
   *
   * @see {@link https://openid.net/specs/openid-connect-discovery-1_0.html OpenID Connect Discovery 1.0 (oidc)}
   * @see {@link https://www.rfc-editor.org/rfc/rfc8414.html RFC8414 - OAuth 2.0 Authorization Server Metadata (oauth)}
   */
  algorithm?: 'oidc' | 'oauth2'

  /**
   * Methods (available list linked below) to execute with the
   * {@link Configuration} instance as argument after it is instantiated
   *
   * Note: Presence of {@link allowInsecureRequests} in this option also enables
   * the use of insecure HTTP requests for the Authorization Server Metadata
   * discovery request itself.
   *
   * @example
   *
   * Disable the HTTPS-only restriction for the discovery call and subsequently
   * for all requests made with the resulting {@link Configuration} instance.
   *
   * ```ts
   * let server!: URL
   * let clientId!: string
   * let clientMetadata!:
   *   | Partial<client.ClientMetadata>
   *   | undefined
   *   | string
   * let clientAuth!: client.ClientAuth | undefined
   *
   * let config = await client.discovery(
   *   server,
   *   clientId,
   *   clientMetadata,
   *   clientAuth,
   *   {
   *     execute: [client.allowInsecureRequests],
   *   },
   * )
   * ```
   *
   * @see {@link allowInsecureRequests}
   * @see {@link enableNonRepudiationChecks}
   * @see {@link useCodeIdTokenResponseType}
   * @see {@link enableDetachedSignatureResponseChecks}
   * @see {@link useJwtResponseMode}
   */
  execute?: Array<(config: Configuration) => void>

  /**
   * Timeout (in seconds) for the Authorization Server Metadata discovery. If
   * this option is used, then the same timeout value will be assigned to the
   * resolved {@link Configuration} instance for use with all its future
   * individual HTTP requests. Default is `30` (seconds)
   */
  timeout?: number
}

function handleEntraId(
  server: URL,
  as: oauth.AuthorizationServer,
  options?: DiscoveryRequestOptions,
) {
  if (
    (server.href === 'https://login.microsoftonline.com/common/v2.0' ||
      server.href === 'https://login.microsoftonline.com/organizations/v2.0') &&
    (!options?.algorithm || options.algorithm === 'oidc')
  ) {
    // @ts-expect-error
    as[kEntraId] = true
    return true
  }

  return false
}

/**
 * Performs Authorization Server Metadata discovery and returns a
 * {@link Configuration} with the discovered
 * {@link ServerMetadata Authorization Server} metadata.
 *
 * This is the RECOMMENDED method of client configuration.
 *
 * This has the same effect as calling the {@link Configuration} constructor
 * except that the server metadata is discovered from its own Authorization
 * Server Metadata discovery document.
 *
 * @param server URL representation of the Authorization Server's Issuer
 *   Identifier
 * @param clientId Client Identifier at the Authorization Server
 * @param metadata Client Metadata, when a string is passed in it is a shorthand
 *   for passing just {@link ClientMetadata.client_secret}
 * @param options
 *
 * @group OpenID Connect 1.0
 * @group Configuration
 * @group You are probably looking for this
 */
export async function discovery(
  server: URL,
  clientId: string,
  metadata?: Partial<ClientMetadata> | string,
  clientAuthentication?: ClientAuth,
  options?: DiscoveryRequestOptions,
): Promise<Configuration> {
  if (!(server instanceof URL)) {
    throw CodedTypeError(
      '"server" must be an instance of URL',
      ERR_INVALID_ARG_TYPE,
    )
  }

  const resolve = !server.href.includes('/.well-known/')

  const timeout = options?.timeout ?? 30
  const signal = AbortSignal.timeout(timeout * 1000)
  const as = await (
    resolve
      ? oauth.discoveryRequest(server, {
          algorithm: options?.algorithm,
          [oauth.customFetch]: options?.[customFetch],
          [oauth.allowInsecureRequests]: options?.execute?.includes(
            allowInsecureRequests,
          ),
          signal,
          headers: new Headers(headers),
        })
      : (options?.[customFetch] || fetch)(
          (() => {
            oauth.checkProtocol(
              server,
              options?.execute?.includes(allowInsecureRequests) ? false : true,
            )

            return server.href
          })(),
          {
            headers: Object.fromEntries(
              new Headers({ accept: 'application/json', ...headers }).entries(),
            ),
            body: undefined,
            method: 'GET',
            redirect: 'manual',
            signal,
          },
        )
  )
    .then((response) =>
      // @ts-expect-error
      oauth.processDiscoveryResponse(oauth._nodiscoverycheck, response),
    )
    .catch(errorHandler)

  if (resolve && new URL(as.issuer).href !== server.href) {
    handleEntraId(server, as, options) ||
      (() => {
        throw new ClientError(
          'discovered metadata issuer does not match the expected issuer',
          {
            code: oauth.JSON_ATTRIBUTE_COMPARISON,
            cause: {
              expected: server.href,
              body: as,
              attribute: 'issuer',
            },
          },
        )
      })()
  }

  const instance = new Configuration(
    as,
    clientId,
    metadata,
    clientAuthentication,
  )
  let internals = int(instance)

  if (options?.[customFetch]) {
    internals.fetch = options[customFetch]
  }

  if (options?.timeout) {
    internals.timeout = options.timeout
  }

  if (options?.execute) {
    for (const extension of options.execute) {
      extension(instance)
    }
  }

  return instance
}

/**
 * Enables the client to process encrypted ID Tokens, encrypted JWT UserInfo
 * responses, and encrypted JWT Introspection responses. Multiple private keys
 * may be provided for the decryption key selection process but only a single
 * one must match the process.
 *
 * Only the following JWE Key Management Algorithms are supported
 *
 * - RSA-OAEP
 * - RSA-OAEP-256
 * - ECDH-ES (Using P-256 or X25519)
 *
 * @example
 *
 * ```ts
 * let key!: client.CryptoKey | client.PrivateKey
 * let config!: client.Configuration
 *
 * client.enableDecryptingResponses(config, key)
 * ```
 *
 * @param keys
 *
 * @group Advanced Configuration
 */
export function enableDecryptingResponses(
  config: Configuration,
  ...keys: Array<CryptoKey | oauth.PrivateKey>
) {
  if (int(config).decrypt !== undefined) {
    throw new TypeError(
      'enableDecryptingResponses can only be called on a given Configuration instance once',
    )
  }

  if (keys.length === 0) {
    throw CodedTypeError('no keys were provided', ERR_INVALID_ARG_VALUE)
  }

  for (const pk of keys) {
    let key: CryptoKey
    if ('key' in pk) {
      key = pk.key
    } else {
      key = pk
    }

    switch (key.type === 'private' && key.algorithm.name) {
      case 'RSA-OAEP':
        if (
          // @ts-expect-error
          key.algorithm.hash.name !== 'SHA-256' &&
          // @ts-expect-error
          key.algorithm.hash.name !== 'SHA-1'
        ) {
          throw CodedTypeError(
            'Only SHA-256 and SHA-1 RSA-OAEP keys are supported',
            ERR_INVALID_ARG_VALUE,
          )
        }
        break
      case 'ECDH':
        // @ts-expect-error
        if (key.algorithm.namedCurve !== 'P-256') {
          throw CodedTypeError(
            'Only P-256 ECDH keys are supported',
            ERR_INVALID_ARG_VALUE,
          )
        }
        break
      case 'X25519':
        break
      default:
        throw CodedTypeError(
          'only private RSA-OAEP, ECDH, or X25519 keys are supported',
          ERR_INVALID_ARG_VALUE,
        )
    }
  }

  int(config).decrypt = async (jwe) => decrypt(keys, jwe).catch(errorHandler)
}

function checkCryptoKey(key: CryptoKey, alg: string, epk: unknown) {
  if (key.type !== 'private') return false

  if (alg.startsWith('RSA')) {
    if (key.algorithm.name !== 'RSA-OAEP') return false

    const hash = `SHA-${parseInt(alg.slice(9), 10) || 1}`
    // @ts-expect-error
    return key.algorithm.hash.name === hash
  }

  if (alg.startsWith('ECDH')) {
    if (key.algorithm.name !== 'ECDH' && key.algorithm.name !== 'X25519') {
      return false
    }

    if (key.algorithm.name === 'ECDH') {
      // @ts-expect-error
      return epk?.crv === key.algorithm.namedCurve
    }

    if (key.algorithm.name === 'X25519') {
      // @ts-expect-error
      return epk?.crv === 'X25519'
    }
  }

  return false
}

function unwrap(key: CryptoKey | oauth.PrivateKey): CryptoKey {
  if ('key' in key) {
    return key.key
  }
  return key
}

function selectCryptoKeyForDecryption(
  keys: Array<CryptoKey | oauth.PrivateKey>,
  alg: string,
  kid?: string,
  epk?: unknown,
): CryptoKey {
  const { 0: key, length } = keys.filter((key) => {
    if ('key' in key) {
      if (kid !== undefined && kid !== key.kid) {
        return false
      }

      return checkCryptoKey(key.key, alg, epk)
    }

    if (kid !== undefined) {
      return false
    }
    return checkCryptoKey(key, alg, epk)
  })

  if (!key) {
    throw e(
      'no applicable decryption key selected',
      undefined,
      'OAUTH_DECRYPTION_FAILED',
    )
  }

  if (length !== 1) {
    throw e(
      'multiple applicable decryption keys selected',
      undefined,
      'OAUTH_DECRYPTION_FAILED',
    )
  }

  return unwrap(key)
}

async function decrypt(
  keys: Array<CryptoKey | oauth.PrivateKey>,
  jwe: string,
): Promise<string> {
  return decoder.decode(
    (
      await jose
        .compactDecrypt(
          jwe,
          async (header: jose.CompactJWEHeaderParameters) => {
            const { kid, alg, epk } = header
            return selectCryptoKeyForDecryption(keys, alg, kid, epk)
          },
          {
            keyManagementAlgorithms: ['ECDH-ES', 'RSA-OAEP', 'RSA-OAEP-256'],
          },
        )
        .catch((err) => {
          if (err instanceof JOSEError) {
            throw e('decryption failed', err, 'OAUTH_DECRYPTION_FAILED')
          }

          errorHandler(err)
        })
    ).plaintext,
  )
}

// private
const kEntraId: unique symbol = Symbol()

type JARMImplementation = (
  authorizationResponse: URLSearchParams,
  expectedState?: string | typeof skipStateCheck,
) => Promise<URLSearchParams>
type HybridImplementation = (
  authorizationResponse: URLSearchParams,
  expectedNonce?: string,
  expectedState?: string | typeof skipStateCheck,
  maxAge?: number,
) => Promise<URLSearchParams>
type NonRepudiationImplementation = (response: Response) => Promise<void>

/**
 * Public methods available on a {@link Configuration} instance
 */
export interface ConfigurationMethods {
  /**
   * Used to retrieve the Authorization Server Metadata
   */
  serverMetadata(): Readonly<ServerMetadata>
}

/**
 * @see {@link customFetch}
 */
export type CustomFetch = (
  /**
   * URL the request is being made sent to {@link !fetch} as the `resource`
   * argument
   */
  url: string,
  /**
   * Options otherwise sent to {@link !fetch} as the `options` argument
   */
  options: {
    /**
     * The request body content to send to the server
     */
    body: FetchBody
    /**
     * HTTP Headers
     */
    headers: Record<string, string>
    /**
     * The
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods request method}
     */
    method: string
    /**
     * See {@link !Request.redirect}
     */
    redirect: 'manual'
    /**
     * An AbortSignal configured as per the
     * {@link ConfigurationProperties.timeout} value
     */
    signal?: AbortSignal
  },
) => Promise<Response>

/**
 * Public properties available on a {@link Configuration} instance
 */
export interface ConfigurationProperties {
  /**
   * Custom {@link !fetch Fetch API} implementation to use for the HTTP Requests
   * the client will be making.
   *
   * @see {@link customFetch}
   */
  [customFetch]?: CustomFetch

  /**
   * Timeout (in seconds) for the HTTP Requests the client will be making.
   * Default is `30` (seconds)
   */
  timeout?: number
}

/**
 * Configuration is an abstraction over the
 * {@link ServerMetadata OAuth 2.0 Authorization Server metadata} and
 * {@link ClientMetadata OAuth 2.0 Client metadata}
 *
 * Configuration instances are obtained either through
 *
 * - (RECOMMENDED) the {@link discovery} function that discovers the
 *   {@link ServerMetadata OAuth 2.0 Authorization Server metadata} using the
 *   Authorization Server's Issuer Identifier, or
 * - The {@link Configuration} constructor if the
 *   {@link ServerMetadata OAuth 2.0 Authorization Server metadata} is known
 *   upfront
 *
 * @example
 *
 * (RECOMMENDED) Setting up a Configuration with a Server Metadata discovery
 * step
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientSecret!: string | undefined
 *
 * let config = await client.discovery(server, clientId, clientSecret)
 * ```
 *
 * @example
 *
 * Setting up a Configuration with a constructor
 *
 * ```ts
 * let server!: client.ServerMetadata
 * let clientId!: string
 * let clientSecret!: string | undefined
 *
 * let config = new client.Configuration(server, clientId, clientSecret)
 * ```
 *
 * @group Configuration
 */
export class Configuration
  implements ConfigurationMethods, ConfigurationProperties
{
  /**
   * @param server Authorization Server Metadata
   * @param clientId Client Identifier at the Authorization Server
   * @param metadata Client Metadata, when a string is passed in it is a
   *   shorthand for passing just {@link ClientMetadata.client_secret}.
   * @param clientAuthentication Implementation of the Client's Authentication
   *   Method at the Authorization Server.
   */
  constructor(
    server: ServerMetadata,
    clientId: string,
    metadata?: Partial<ClientMetadata> | string,
    clientAuthentication?: ClientAuth,
  ) {
    if (typeof clientId !== 'string' || !clientId.length) {
      throw CodedTypeError(
        '"clientId" must be a non-empty string',
        ERR_INVALID_ARG_TYPE,
      )
    }

    if (typeof metadata === 'string') {
      metadata = { client_secret: metadata }
    }

    if (metadata?.client_id !== undefined && clientId !== metadata.client_id) {
      throw CodedTypeError(
        '"clientId" and "metadata.client_id" must be the same',
        ERR_INVALID_ARG_VALUE,
      )
    }

    const client: oauth.Client = {
      ...structuredClone(metadata),
      client_id: clientId,
    }

    client[oauth.clockSkew] = metadata?.[oauth.clockSkew] ?? 0
    client[oauth.clockTolerance] = metadata?.[oauth.clockTolerance] ?? 30

    let auth: ClientAuth
    if (clientAuthentication) {
      auth = clientAuthentication
    } else {
      if (
        typeof client.client_secret === 'string' &&
        client.client_secret.length
      ) {
        auth = ClientSecretPost(client.client_secret)
      } else {
        auth = None()
      }
    }

    let c = Object.freeze(client)
    const clone = structuredClone(server)
    if (kEntraId in server) {
      // @ts-ignore
      clone[oauth._expectedIssuer] = ({ claims: { tid } }) => server.issuer.replace('{tenantid}', tid) // prettier-ignore
    }
    let as = Object.freeze(clone)

    props ||= new WeakMap()
    props.set(this, {
      __proto__: null,
      as,
      c,
      auth,
      tlsOnly: true,
    })
  }

  /**
   * @ignore
   */
  serverMetadata(): Readonly<ServerMetadata> {
    return structuredClone(int(this).as)
  }

  /**
   * @ignore
   */
  get timeout(): number | undefined {
    return int(this).timeout
  }

  /**
   * @ignore
   */
  set timeout(value: number | undefined) {
    int(this).timeout = value
  }

  /**
   * @ignore
   */
  get [customFetch](): CustomFetch | undefined {
    return int(this).fetch
  }

  /**
   * @ignore
   */
  set [customFetch](value: CustomFetch) {
    int(this).fetch = value
  }
}
Object.freeze(Configuration.prototype)

/**
 * Helpers attached to any resolved {@link TokenEndpointResponse}
 */
export interface TokenEndpointResponseHelpers {
  /**
   * Returns the parsed JWT Claims Set of an
   * {@link TokenEndpointResponse.id_token id_token} returned by the
   * authorization server
   *
   * Note: Returns `undefined` when
   * {@link TokenEndpointResponse.expires_in expires_in} was not returned by the
   * authorization server
   */
  claims(): oauth.IDToken | undefined

  /**
   * Returns the number of seconds until the
   * {@link TokenEndpointResponse.access_token access_token} expires
   *
   * Note: Returns `0` when already expired
   *
   * Note: Returns `undefined` when
   * {@link TokenEndpointResponse.expires_in expires_in} was not returned by the
   * authorization server
   */
  expiresIn(): number | undefined
}

function getHelpers(response: oauth.TokenEndpointResponse) {
  let exp: number | undefined = undefined
  if (response.expires_in !== undefined) {
    const now = new Date()
    now.setSeconds(now.getSeconds() + response.expires_in)
    exp = now.getTime()
  }

  return {
    expiresIn: {
      __proto__: null,
      value() {
        if (exp) {
          const now = Date.now()
          if (exp > now) {
            return Math.floor((exp - now) / 1000)
          }

          return 0
        }

        return undefined
      },
    },
    claims: {
      __proto__: null,
      value(this: oauth.TokenEndpointResponse) {
        try {
          return oauth.getValidatedIdTokenClaims(this)
        } catch {
          return undefined
        }
      },
    },
  }
}

function addHelpers(
  response: oauth.TokenEndpointResponse,
): asserts response is typeof response & TokenEndpointResponseHelpers {
  Object.defineProperties(response, getHelpers(response))
}

/**
 * Returns a wrapper / handle around a public/private key pair that is used for
 * negotiating and proving proof-of-possession to sender-constrain OAuth 2.0
 * tokens via {@link !DPoP} at the Authorization Server and Resource Server.
 *
 * Support for {@link !DPoP} at the authorization is indicated by
 * {@link ServerMetadata.dpop_signing_alg_values_supported}. Whether the
 * authorization server ends up sender-constraining the access token is at the
 * server's discretion. When an access token is sender-constrained then the
 * resulting
 * {@link TokenEndpointResponse.token_type `token_type` will be `dpop`}.
 *
 * This wrapper / handle also keeps track of server-issued nonces, allowing this
 * module to automatically retry requests with a fresh nonce when the server
 * indicates the need to use one.
 *
 * Note: Public Clients that use DPoP will also get their Refresh Token
 * sender-constrained, this binding is not indicated in the response.
 *
 * @param keyPair {@link CryptoKeyPair} to sign the DPoP Proof JWT,
 *   {@link randomDPoPKeyPair} may be used to generate it
 *
 * @group DPoP
 *
 * @see {@link !DPoP RFC 9449 - OAuth 2.0 Demonstrating Proof of Possession (DPoP)}
 */
export function getDPoPHandle(
  config: Configuration,
  keyPair: CryptoKeyPair,
  options?: oauth.ModifyAssertionOptions,
): DPoPHandle {
  checkConfig(config)
  return oauth.DPoP(int(config).c, keyPair, options)
}

export interface DeviceAutorizationGrantPollOptions extends DPoPOptions {
  /**
   * AbortSignal to abort polling. Default is that the operation will time out
   * after the indicated expires_in property returned by the server in
   * {@link initiateDeviceAuthorization}
   */
  signal?: AbortSignal
}

function wait(interval: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, interval * 1000)
  })
}

/**
 * Continuously polls the {@link ServerMetadata.token_endpoint token endpoint}
 * until the end-user finishes the {@link !"Device Authorization Grant"} process
 * on their secondary device
 *
 * Note:
 * {@link ServerMetadata.token_endpoint URL of the authorization server's token endpoint}
 * must be configured.
 *
 * @example
 *
 * ```ts
 * let config!: client.Configuration
 * let scope!: string
 *
 * let deviceAuthorizationResponse =
 *   await client.initiateDeviceAuthorization(config, { scope })
 *
 * let { user_code, verification_uri, verification_uri_complete } =
 *   deviceAuthorizationResponse
 *
 * console.log({ user_code, verification_uri, verification_uri_complete })
 *
 * let tokenEndpointResponse = await client.pollDeviceAuthorizationGrant(
 *   config,
 *   deviceAuthorizationResponse,
 * )
 * ```
 *
 * @param deviceAuthorizationResponse Device Authorization Response obtained
 *   from {@link initiateDeviceAuthorization}
 * @param parameters Additional parameters that will be sent to the token
 *   endpoint, typically used for parameters such as `scope` and a `resource`
 *   ({@link !"Resource Indicators" Resource Indicator})
 *
 * @group Grants
 */
export async function pollDeviceAuthorizationGrant(
  config: Configuration,
  deviceAuthorizationResponse: oauth.DeviceAuthorizationResponse,
  parameters?: URLSearchParams | Record<string, string>,
  options?: DeviceAutorizationGrantPollOptions,
): Promise<oauth.TokenEndpointResponse & TokenEndpointResponseHelpers> {
  checkConfig(config)

  parameters = new URLSearchParams(parameters)

  let interval = deviceAuthorizationResponse.interval ?? 5

  const pollingSignal =
    options?.signal ??
    AbortSignal.timeout(deviceAuthorizationResponse.expires_in * 1000)

  try {
    pollingSignal.throwIfAborted()
  } catch (err) {
    errorHandler(err)
  }

  await wait(interval)

  const { as, c, auth, fetch, tlsOnly, nonRepudiation, timeout, decrypt } =
    int(config)

  const response = await oauth
    .deviceCodeGrantRequest(
      as,
      c,
      auth,
      deviceAuthorizationResponse.device_code,
      {
        [oauth.customFetch]: fetch,
        [oauth.allowInsecureRequests]: !tlsOnly,
        additionalParameters: parameters,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: pollingSignal.aborted ? pollingSignal : signal(timeout),
      },
    )
    .catch(errorHandler)

  const p = oauth.processDeviceCodeResponse(as, c, response, {
    [oauth.jweDecrypt]: decrypt,
  })

  let result: oauth.TokenEndpointResponse
  try {
    result = await p
  } catch (err) {
    if (retryable(err, options)) {
      return pollDeviceAuthorizationGrant(
        config,
        {
          ...deviceAuthorizationResponse,
          interval,
        },
        parameters,
        {
          ...options,
          signal: pollingSignal,
          flag: retry,
        },
      )
    }

    if (err instanceof oauth.ResponseBodyError) {
      switch (err.error) {
        // @ts-ignore
        case 'slow_down': // Fall through
          interval += 5
        case 'authorization_pending':
          return pollDeviceAuthorizationGrant(
            config,
            {
              ...deviceAuthorizationResponse,
              interval,
            },
            parameters,
            {
              ...options,
              signal: pollingSignal,
              flag: undefined,
            },
          )
      }
    }

    errorHandler(err)
  }

  result.id_token && (await nonRepudiation?.(response))

  addHelpers(result)
  return result
}

/**
 * Initiates a {@link !"Device Authorization Grant"} using parameters from the
 * `parameters` argument.
 *
 * Note:
 * {@link ServerMetadata.device_authorization_endpoint URL of the authorization server's device authorization endpoint}
 * must be configured.
 *
 * @example
 *
 * ```ts
 * let config!: client.Configuration
 * let scope!: string
 *
 * let deviceAuthorizationResponse =
 *   await client.initiateDeviceAuthorization(config, { scope })
 *
 * let { user_code, verification_uri, verification_uri_complete } =
 *   deviceAuthorizationResponse
 *
 * console.log({ user_code, verification_uri, verification_uri_complete })
 * ```
 *
 * @param parameters Authorization request parameters that will be sent to the
 *   device authorization endpoint
 *
 * @group Grants
 */
export async function initiateDeviceAuthorization(
  config: Configuration,
  parameters: URLSearchParams | Record<string, string>,
): Promise<oauth.DeviceAuthorizationResponse> {
  checkConfig(config)

  const { as, c, auth, fetch, tlsOnly, timeout } = int(config)
  return oauth
    .deviceAuthorizationRequest(as, c, auth, parameters, {
      [oauth.customFetch]: fetch,
      [oauth.allowInsecureRequests]: !tlsOnly,
      headers: new Headers(headers),
      signal: signal(timeout),
    })
    .then((response) =>
      oauth.processDeviceAuthorizationResponse(as, c, response),
    )
    .catch(errorHandler)
}

export interface AuthorizationCodeGrantOptions extends DPoPOptions {
  /**
   * This is not part of the public API.
   *
   * @private
   *
   * @ignore
   *
   * @internal
   */
  authResponse?: Awaited<
    ReturnType<
      | typeof oauth.validateAuthResponse
      | typeof validateJARMResponse
      | typeof validateCodeIdTokenResponse
    >
  >
  /**
   * This is not part of the public API.
   *
   * @private
   *
   * @ignore
   *
   * @internal
   */
  redirectUri?: string
}

/**
 * By default the module only allows interactions with HTTPS endpoints. This
 * removes that restriction.
 *
 * @deprecated Marked as deprecated only to make it stand out as something you
 *   shouldn't have the need to use, possibly only for local development and
 *   testing against non-TLS secured environments.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery} to also
 * disable its HTTPS-only restriction.
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 * let clientAuth!: client.ClientAuth | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   clientAuth,
 *   {
 *     execute: [client.allowInsecureRequests],
 *   },
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let config!: client.Configuration
 *
 * client.allowInsecureRequests(config)
 * ```
 *
 * @group Advanced Configuration
 */
export function allowInsecureRequests(config: Configuration) {
  int(config).tlsOnly = false
}

/**
 * Enables validating the JWS Signature of either a JWT {@link !Response.body} or
 * {@link TokenEndpointResponse.id_token} of a processed {@link !Response} such as
 * JWT UserInfo or JWT Introspection responses.
 *
 * Note: Validating signatures of JWTs received via direct communication between
 * the client and a TLS-secured endpoint (which it is here) is not mandatory
 * since the TLS server validation is used to validate the issuer instead of
 * checking the token signature. You only need to use this method for
 * non-repudiation purposes.
 *
 * Note:
 * {@link ServerMetadata.jwks_uri URL of the authorization server's JWK Set document}
 * must be configured.
 *
 * Note: Supports only digital signatures using
 * {@link JWSAlgorithm these supported JWS Algorithms}.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery} to also
 * disable the its HTTPS-only restriction.
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 * let clientAuth!: client.ClientAuth | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   clientAuth,
 *   {
 *     execute: [client.enableNonRepudiationChecks],
 *   },
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let config!: client.Configuration
 *
 * client.enableNonRepudiationChecks(config)
 * ```
 *
 * @group Advanced Configuration
 */
export function enableNonRepudiationChecks(config: Configuration) {
  checkConfig(config)

  int(config).nonRepudiation = (response) => {
    const { as, fetch, tlsOnly, timeout } = int(config)
    return oauth
      .validateApplicationLevelSignature(as, response, {
        [oauth.customFetch]: fetch,
        [oauth.allowInsecureRequests]: !tlsOnly,
        headers: new Headers(headers),
        signal: signal(timeout),
      })
      .catch(errorHandler)
  }
}

/**
 * This changes the `response_mode` used by the client to be `jwt` and expects
 * the authorization server response passed to {@link authorizationCodeGrant} to
 * be one described by {@link !JARM}.
 *
 * Note:
 * {@link ServerMetadata.jwks_uri URL of the authorization server's JWK Set document}
 * must be configured.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 * let clientAuth!: client.ClientAuth | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   clientAuth,
 *   {
 *     execute: [client.useJwtResponseMode],
 *   },
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let config!: client.Configuration
 *
 * client.useJwtResponseMode(config)
 * ```
 *
 * @group Advanced Configuration
 *
 * @see {@link !JARM}
 */
export function useJwtResponseMode(config: Configuration) {
  checkConfig(config)

  if (int(config).hybrid) {
    throw e(
      'JARM cannot be combined with a hybrid response mode',
      undefined,
      oauth.UNSUPPORTED_OPERATION,
    )
  }

  int(config).jarm = (authorizationResponse, expectedState) =>
    validateJARMResponse(config, authorizationResponse, expectedState)
}

/**
 * This builds on top of {@link useCodeIdTokenResponseType} and enables the
 * response to be validated as per the
 * {@link https://openid.net/specs/openid-financial-api-part-2-1_0.html#id-token-as-detached-signature FAPI 1.0 Advanced profile}.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 * let clientAuth!: client.ClientAuth | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   clientAuth,
 *   {
 *     execute: [
 *       client.useCodeIdTokenResponseType,
 *       client.enableDetachedSignatureResponseChecks,
 *     ],
 *   },
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let config!: client.Configuration
 *
 * client.useCodeIdTokenResponseType(config)
 * client.enableDetachedSignatureResponseChecks(config)
 * ```
 *
 * @group Advanced Configuration
 *
 * @see {@link https://openid.net/specs/openid-financial-api-part-2-1_0.html#id-token-as-detached-signature ID Token as Detached Signature}
 */
export function enableDetachedSignatureResponseChecks(config: Configuration) {
  if (!int(config).hybrid) {
    throw e(
      '"code id_token" response type must be configured to be used first',
      undefined,
      oauth.UNSUPPORTED_OPERATION,
    )
  }

  int(config).hybrid = (
    authorizationResponse,
    expectedNonce,
    expectedState,
    maxAge,
  ) =>
    validateCodeIdTokenResponse(
      config,
      authorizationResponse,
      expectedNonce,
      expectedState,
      maxAge,
      true,
    )
}

/**
 * This changes the `response_type` used by the client to be `code id_token` and
 * expects the authorization server response passed to
 * {@link authorizationCodeGrant} to be one described by
 * {@link https://openid.net/specs/openid-connect-core-1_0.html#HybridFlowAuth OpenID Connect 1.0 Hybrid Flow}.
 *
 * Note:
 * {@link ServerMetadata.jwks_uri URL of the authorization server's JWK Set document}
 * must be configured.
 *
 * @example
 *
 * Usage with a {@link Configuration} obtained through {@link discovery}
 *
 * ```ts
 * let server!: URL
 * let clientId!: string
 * let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
 * let clientAuth!: client.ClientAuth | undefined
 *
 * let config = await client.discovery(
 *   server,
 *   clientId,
 *   clientMetadata,
 *   clientAuth,
 *   {
 *     execute: [client.useCodeIdTokenResponseType],
 *   },
 * )
 * ```
 *
 * @example
 *
 * Usage with a {@link Configuration} instance
 *
 * ```ts
 * let config!: client.Configuration
 *
 * client.useCodeIdTokenResponseType(config)
 * ```
 *
 * @group Advanced Configuration
 *
 * @see {@link https://openid.net/specs/openid-connect-core-1_0.html#HybridFlowAuth OpenID Connect 1.0 Hybrid Flow}
 */
export function useCodeIdTokenResponseType(config: Configuration) {
  checkConfig(config)

  if (int(config).jarm) {
    throw e(
      '"code id_token" response type cannot be combined with JARM',
      undefined,
      oauth.UNSUPPORTED_OPERATION,
    )
  }

  int(config).hybrid = (
    authorizationResponse,
    expectedNonce,
    expectedState,
    maxAge,
  ) =>
    validateCodeIdTokenResponse(
      config,
      authorizationResponse,
      expectedNonce,
      expectedState,
      maxAge,
      false,
    )
}

export interface AuthorizationCodeGrantChecks {
  /**
   * Expected value of the `nonce` ID Token claim. This value must match
   * exactly. When `undefined` the expectation is that there is no `nonce` in
   * the ID Token (i.e. also `undefined`).
   *
   * Using this option also means that an ID Token must be part of the response.
   */
  expectedNonce?: string

  /**
   * Expected value of the `state` authorization response parameter. This value
   * must match exactly. When `undefined` the expectation is that there is no
   * `state` in the authorization response.
   */
  expectedState?: string | typeof skipStateCheck

  /**
   * Use this to have the client assert that an ID Token is returned by the
   * Authorization Server.
   *
   * Note: When `expectedNonce` or `maxAge` is used this has no effect.
   */
  idTokenExpected?: boolean

  /**
   * ID Token {@link IDToken.auth_time `auth_time`} claim value will be checked
   * to be present and conform to this `maxAge` value. Use of this option is
   * required if you sent a `max_age` parameter in the authorization request.
   * Default is {@link ClientMetadata.default_max_age } and falls back to not
   * checking the claim's value beyond it being a number when present.
   */
  maxAge?: number

  /**
   * When PKCE is used this is the `code_verifier` that will be sent to the
   * {@link ServerMetadata.token_endpoint token endpoint}.
   */
  pkceCodeVerifier?: string
}

function stripParams(url: URL) {
  url = new URL(url)
  url.search = ''
  url.hash = ''
  return url.href
}

/**
 * This method validates the authorization response and then executes the
 * {@link !"Authorization Code Grant"} at the Authorization Server's
 * {@link ServerMetadata.token_endpoint token endpoint} to obtain an access
 * token. ID Token and Refresh Token are also optionally issued by the server.
 *
 * Note:
 * {@link ServerMetadata.token_endpoint URL of the authorization server's token endpoint}
 * must be configured.
 *
 * @example
 *
 * ```ts
 * let config!: client.Configuration
 * let getCodeVerifierFromSession!: (...args: any) => string
 * let getCurrentUrl!: (...args: any) => URL
 *
 * let tokens = await client.authorizationCodeGrant(
 *   config,
 *   getCurrentUrl(),
 *   {
 *     pkceCodeVerifier: getCodeVerifierFromSession(),
 *   },
 * )
 * ```
 *
 * @param currentUrl Current URL the Authorization Server provided an
 *   Authorization Response to, the `redirect_uri`
 *   {@link !"Authorization Code Grant"} parameter is extracted from this URL by
 *   stripping the query string parameters and fragment components. The
 *   authorization response parameters are typically expected to be encoded in
 *   its query string, and for `code id_token` {@link !OIDC} Response Types in
 *   the URL's fragment.
 * @param checks CSRF Protection checks like PKCE, expected state, or expected
 *   nonce
 * @param parameters Additional parameters that will be sent to the token
 *   endpoint, typically used for parameters such as `resource`
 *   ({@link !"Resource Indicators" Resource Indicator}) in cases where multiple
 *   resource indicators were requested but the authorization server only
 *   supports issuing an access token with a single audience
 *
 * @group OpenID Connect 1.0
 * @group Grants
 * @group PKCE
 * @group You are probably looking for this
 */
export async function authorizationCodeGrant(
  config: Configuration,
  currentUrl: URL,
  checks?: AuthorizationCodeGrantChecks,
  parameters?: URLSearchParams | Record<string, string>,
  options?: AuthorizationCodeGrantOptions,
): Promise<oauth.TokenEndpointResponse & TokenEndpointResponseHelpers> {
  checkConfig(config)

  if (options?.flag !== retry && !(currentUrl instanceof URL)) {
    throw CodedTypeError(
      '"currentUrl" must be an instance of URL',
      ERR_INVALID_ARG_TYPE,
    )
  }

  let authResponse: Awaited<
    ReturnType<
      | typeof oauth.validateAuthResponse
      | typeof validateJARMResponse
      | typeof validateCodeIdTokenResponse
    >
  >

  let redirectUri: string

  const { as, c, auth, fetch, tlsOnly, jarm, hybrid, nonRepudiation, timeout, decrypt } = int(config) // prettier-ignore

  if (options?.flag === retry) {
    authResponse = options.authResponse!
    redirectUri = options.redirectUri!
  } else {
    redirectUri = stripParams(currentUrl)
    switch (true) {
      case !!jarm:
        authResponse = await jarm(
          currentUrl.searchParams,
          checks?.expectedState,
        )
        break
      case !!hybrid:
        authResponse = await hybrid(
          new URLSearchParams(currentUrl.hash.slice(1)),
          checks?.expectedNonce,
          checks?.expectedState,
          checks?.maxAge,
        )
        break

      default:
        try {
          authResponse = oauth.validateAuthResponse(
            as,
            c,
            currentUrl.searchParams,
            checks?.expectedState,
          )
        } catch (err) {
          return errorHandler(err)
        }
    }
  }

  const response = await oauth
    .authorizationCodeGrantRequest(
      as,
      c,
      auth,
      authResponse,
      redirectUri,
      // @ts-expect-error
      checks?.pkceCodeVerifier || oauth._nopkce,
      {
        additionalParameters: parameters,
        [oauth.customFetch]: fetch,
        [oauth.allowInsecureRequests]: !tlsOnly,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout),
      },
    )
    .catch(errorHandler)

  if (
    typeof checks?.expectedNonce === 'string' ||
    typeof checks?.maxAge === 'number'
  ) {
    checks.idTokenExpected = true
  }

  const p = oauth.processAuthorizationCodeResponse(as, c, response, {
    expectedNonce: checks?.expectedNonce,
    maxAge: checks?.maxAge,
    requireIdToken: checks?.idTokenExpected,
    [oauth.jweDecrypt]: decrypt,
  })

  let result: oauth.TokenEndpointResponse
  try {
    result = await p
  } catch (err) {
    if (retryable(err, options)) {
      return authorizationCodeGrant(
        config,
        // @ts-expect-error
        undefined,
        checks,
        parameters,
        {
          ...options,
          flag: retry,
          authResponse: authResponse,
          redirectUri: redirectUri,
        },
      )
    }

    errorHandler(err)
  }

  result.id_token && (await nonRepudiation?.(response))

  addHelpers(result)
  return result
}

async function validateJARMResponse(
  config: Configuration,
  authorizationResponse: URLSearchParams,
  expectedState: string | typeof skipStateCheck | undefined,
): Promise<URLSearchParams> {
  const { as, c, fetch, tlsOnly, timeout, decrypt } = int(config)
  return oauth
    .validateJwtAuthResponse(as, c, authorizationResponse, expectedState, {
      [oauth.customFetch]: fetch,
      [oauth.allowInsecureRequests]: !tlsOnly,
      headers: new Headers(headers),
      signal: signal(timeout),
      [oauth.jweDecrypt]: decrypt,
    })
    .catch(errorHandler)
}

async function validateCodeIdTokenResponse(
  config: Configuration,
  authorizationResponse: URLSearchParams,
  expectedNonce: string | undefined,
  expectedState: string | typeof skipStateCheck | undefined,
  maxAge: number | undefined,
  fapi: boolean,
): Promise<URLSearchParams> {
  if (typeof expectedNonce !== 'string') {
    throw CodedTypeError(
      '"expectedNonce" must be a string',
      ERR_INVALID_ARG_TYPE,
    )
  }

  if (expectedState !== undefined && typeof expectedState !== 'string') {
    throw CodedTypeError(
      '"expectedState" must be a string',
      ERR_INVALID_ARG_TYPE,
    )
  }

  const { as, c, fetch, tlsOnly, timeout, decrypt } = int(config)

  return (
    fapi
      ? oauth.validateDetachedSignatureResponse
      : oauth.validateCodeIdTokenResponse
  )(as, c, authorizationResponse, expectedNonce, expectedState, maxAge, {
    [oauth.customFetch]: fetch,
    [oauth.allowInsecureRequests]: !tlsOnly,
    headers: new Headers(headers),
    signal: signal(timeout),
    [oauth.jweDecrypt]: decrypt,
  }).catch(errorHandler)
}

/**
 * Performs an OAuth 2.0 {@link !"Refresh Token Grant"} at the Authorization
 * Server's {@link ServerMetadata.token_endpoint token endpoint} using parameters
 * from the `parameters` argument, allowing a client to obtain a new access
 * token using a valid refresh token.
 *
 * Note:
 * {@link ServerMetadata.token_endpoint URL of the authorization server's token endpoint}
 * must be configured.
 *
 * @example
 *
 * Requesting a new Access Token using the {@link !"Refresh Token Grant"} with a
 * `scope` and a `resource` ({@link !"Resource Indicators" Resource Indicator})
 * parameters.
 *
 * ```ts
 * let config!: client.Configuration
 * let refreshToken!: string
 * let scope!: string
 * let resource!: string
 *
 * let tokenEndpointResponse = await client.refreshTokenGrant(
 *   config,
 *   refreshToken,
 *   {
 *     scope,
 *     resource,
 *   },
 * )
 * ```
 *
 * @param refreshToken OAuth 2.0 Refresh Token provided by the authorization
 *   server that is used to obtain a new access token.
 * @param parameters Additional parameters that will be sent to the token
 *   endpoint, typically used for parameters such as `scope` and a `resource`
 *   ({@link !"Resource Indicators" Resource Indicator})
 *
 * @group Grants
 */
export async function refreshTokenGrant(
  config: Configuration,
  refreshToken: string,
  parameters?: URLSearchParams | Record<string, string>,
  options?: DPoPOptions,
): Promise<oauth.TokenEndpointResponse & TokenEndpointResponseHelpers> {
  checkConfig(config)

  parameters = new URLSearchParams(parameters)

  const { as, c, auth, fetch, tlsOnly, nonRepudiation, timeout, decrypt } =
    int(config)
  const response = await oauth
    .refreshTokenGrantRequest(as, c, auth, refreshToken, {
      [oauth.customFetch]: fetch,
      [oauth.allowInsecureRequests]: !tlsOnly,
      additionalParameters: parameters,
      DPoP: options?.DPoP,
      headers: new Headers(headers),
      signal: signal(timeout),
    })
    .catch(errorHandler)

  const p = oauth.processRefreshTokenResponse(as, c, response, {
    [oauth.jweDecrypt]: decrypt,
  })

  let result: oauth.TokenEndpointResponse
  try {
    result = await p
  } catch (err) {
    if (retryable(err, options)) {
      return refreshTokenGrant(config, refreshToken, parameters, {
        ...options,
        flag: retry,
      })
    }

    errorHandler(err)
  }

  result.id_token && (await nonRepudiation?.(response))

  addHelpers(result)
  return result
}

/**
 * Performs an OAuth 2.0 {@link !"Client Credentials Grant"} at the Authorization
 * Server's {@link ServerMetadata.token_endpoint token endpoint} using parameters
 * from the `parameters` argument
 *
 * Note:
 * {@link ServerMetadata.token_endpoint URL of the authorization server's token endpoint}
 * must be configured.
 *
 * @example
 *
 * Requesting an Access Token using the {@link !"Client Credentials Grant"} with
 * a `scope` and a `resource` ({@link !"Resource Indicators" Resource Indicator})
 * parameters.
 *
 * ```ts
 * let config!: client.Configuration
 * let scope!: string
 * let resource!: string
 *
 * let tokenEndpointResponse = await client.clientCredentialsGrant(config, {
 *   scope,
 *   resource,
 * })
 * ```
 *
 * @param parameters Additional parameters that will be sent to the token
 *   endpoint, typically used for parameters such as `scope` and a `resource`
 *   ({@link !"Resource Indicators" Resource Indicator})
 *
 * @group Grants
 */
export async function clientCredentialsGrant(
  config: Configuration,
  parameters?: URLSearchParams | Record<string, string>,
  options?: DPoPOptions,
): Promise<oauth.TokenEndpointResponse & TokenEndpointResponseHelpers> {
  checkConfig(config)

  parameters = new URLSearchParams(parameters)

  const { as, c, auth, fetch, tlsOnly, timeout } = int(config)
  const response = await oauth
    .clientCredentialsGrantRequest(as, c, auth, parameters, {
      [oauth.customFetch]: fetch,
      [oauth.allowInsecureRequests]: !tlsOnly,
      DPoP: options?.DPoP,
      headers: new Headers(headers),
      signal: signal(timeout),
    })
    .catch(errorHandler)

  const p = oauth.processClientCredentialsResponse(as, c, response)

  let result: oauth.TokenEndpointResponse
  try {
    result = await p
  } catch (err) {
    if (retryable(err, options)) {
      return clientCredentialsGrant(config, parameters, {
        ...options,
        flag: retry,
      })
    }

    errorHandler(err)
  }

  addHelpers(result)
  return result
}

/**
 * Returns a URL to redirect the user-agent to to request authorization at the
 * Authorization Server
 *
 * Note:
 * {@link ServerMetadata.authorization_endpoint URL of the authorization server's authorization endpoint}
 * must be configured.
 *
 * @example
 *
 * ```ts
 * let config!: client.Configuration
 * let redirect_uri!: string
 * let scope!: string
 *
 * // these must be unique for every single authorization request
 * let code_verifier = client.randomPKCECodeVerifier()
 * let code_challenge =
 *   await client.calculatePKCECodeChallenge(code_verifier)
 *
 * let redirectTo = client.buildAuthorizationUrl(config, {
 *   redirect_uri,
 *   scope,
 *   code_challenge,
 *   code_challenge_method: 'S256',
 * })
 * // redirect now
 * ```
 *
 * @param parameters Authorization request parameters that will be sent to PAR
 *
 * @returns {@link !URL} Instance with {@link !URL.searchParams} including
 *   `client_id`, `response_type`, and all parameters from the `parameters`
 *   argument
 *
 * @group Authorization Request
 * @group You are probably looking for this
 */
export function buildAuthorizationUrl(
  config: Configuration,
  parameters: URLSearchParams | Record<string, string>,
): URL {
  checkConfig(config)

  const { as, c, tlsOnly, hybrid, jarm } = int(config)
  const authorizationEndpoint = oauth.resolveEndpoint(
    as,
    'authorization_endpoint',
    false,
    tlsOnly,
  )

  parameters = new URLSearchParams(parameters)

  if (!parameters.has('client_id')) {
    parameters.set('client_id', c.client_id)
  }
  if (!parameters.has('request_uri') && !parameters.has('request')) {
    if (!parameters.has('response_type')) {
      parameters.set('response_type', hybrid ? 'code id_token' : 'code')
    }
    if (jarm) {
      parameters.set('response_mode', 'jwt')
    }
  }

  for (const [k, v] of parameters.entries()) {
    authorizationEndpoint.searchParams.append(k, v)
  }

  return authorizationEndpoint
}

/**
 * Returns a URL to redirect the user-agent to to request authorization at the
 * Authorization Server with a prior step of using {@link !JAR}
 *
 * Note:
 * {@link ServerMetadata.authorization_endpoint URL of the authorization server's authorization endpoint}
 * must be configured.
 *
 * @example
 *
 * Using {@link !JAR}
 *
 * ```ts
 * let config!: client.Configuration
 * let redirect_uri!: string
 * let scope!: string
 * let key!: client.CryptoKey
 *
 * // these must be unique for every single authorization request
 * let code_verifier = client.randomPKCECodeVerifier()
 * let code_challenge =
 *   await client.calculatePKCECodeChallenge(code_verifier)
 *
 * let redirectTo = await client.buildAuthorizationUrlWithJAR(
 *   config,
 *   {
 *     redirect_uri,
 *     scope,
 *     code_challenge,
 *     code_challenge_method: 'S256',
 *   },
 *   key,
 * )
 * // redirect now
 * ```
 *
 * @example
 *
 * Using {@link !JAR} and {@link !PAR} together
 *
 * ```ts
 * let config!: client.Configuration
 * let redirect_uri!: string
 * let scope!: string
 * let key!: client.CryptoKey
 *
 * // these must be unique for every single authorization request
 * let code_verifier = client.randomPKCECodeVerifier()
 * let code_challenge =
 *   await client.calculatePKCECodeChallenge(code_verifier)
 *
 * let { searchParams: params } = await client.buildAuthorizationUrlWithJAR(
 *   config,
 *   {
 *     redirect_uri,
 *     scope,
 *     code_challenge,
 *     code_challenge_method: 'S256',
 *   },
 *   key,
 * )
 *
 * let redirectTo = await client.buildAuthorizationUrlWithPAR(
 *   config,
 *   params,
 * )
 * // redirect now
 * ```
 *
 * @param parameters Authorization request parameters that will be encoded in a
 *   {@link !JAR} Request Object
 * @param signingKey Key to sign the JAR Request Object with.
 *
 * @returns {@link !URL} Instance with {@link !URL.searchParams} including
 *   `client_id` and `request`
 *
 * @group Authorization Request
 */
export async function buildAuthorizationUrlWithJAR(
  config: Configuration,
  parameters: URLSearchParams | Record<string, string>,
  /**
   * Key to sign the JAR Request Object with.
   */
  signingKey: CryptoKey | oauth.PrivateKey,
  options?: oauth.ModifyAssertionOptions,
): Promise<URL> {
  checkConfig(config)

  const authorizationEndpoint = buildAuthorizationUrl(config, parameters)
  parameters = authorizationEndpoint.searchParams

  if (!signingKey) {
    throw CodedTypeError('"signingKey" must be provided', ERR_INVALID_ARG_VALUE)
  }

  const { as, c } = int(config)
  const request = await oauth
    .issueRequestObject(as, c, parameters, signingKey, options)
    .catch(errorHandler)

  return buildAuthorizationUrl(config, { request })
}

/**
 * Returns a URL to redirect the user-agent to to request authorization at the
 * Authorization Server with a prior step of using {@link !PAR}
 *
 * Note:
 * {@link ServerMetadata.authorization_endpoint URL of the authorization server's authorization endpoint}
 * must be configured.
 *
 * Note:
 * {@link ServerMetadata.pushed_authorization_request_endpoint URL of the authorization server's pushed authorization request endpoint}
 * must be configured.
 *
 * @example
 *
 * Using {@link !PAR}
 *
 * ```ts
 * let config!: client.Configuration
 * let redirect_uri!: string
 * let scope!: string
 *
 * // these must be unique for every single authorization request
 * let code_verifier = client.randomPKCECodeVerifier()
 * let code_challenge =
 *   await client.calculatePKCECodeChallenge(code_verifier)
 *
 * let redirectTo = await client.buildAuthorizationUrlWithPAR(config, {
 *   redirect_uri,
 *   scope,
 *   code_challenge,
 *   code_challenge_method: 'S256',
 * })
 * // redirect now
 * ```
 *
 * @example
 *
 * Using {@link !JAR} and {@link !PAR} together
 *
 * ```ts
 * let config!: client.Configuration
 * let redirect_uri!: string
 * let scope!: string
 * let key!: client.CryptoKey
 *
 * // these must be unique for every single authorization request
 * let code_verifier = client.randomPKCECodeVerifier()
 * let code_challenge =
 *   await client.calculatePKCECodeChallenge(code_verifier)
 *
 * let { searchParams: params } = await client.buildAuthorizationUrlWithJAR(
 *   config,
 *   {
 *     redirect_uri,
 *     scope,
 *     code_challenge,
 *     code_challenge_method: 'S256',
 *   },
 *   key,
 * )
 *
 * let redirectTo = await client.buildAuthorizationUrlWithPAR(
 *   config,
 *   params,
 * )
 * // redirect now
 * ```
 *
 * @param parameters Authorization request parameters that will be sent to
 *   {@link !PAR}
 *
 * @returns {@link !URL} Instance with {@link !URL.searchParams} including
 *   `client_id` and `request_uri`.
 *
 * @group Authorization Request
 */
export async function buildAuthorizationUrlWithPAR(
  config: Configuration,
  parameters: URLSearchParams | Record<string, string>,
  options?: DPoPOptions,
): Promise<URL> {
  checkConfig(config)

  const authorizationEndpoint = buildAuthorizationUrl(config, parameters)

  const { as, c, auth, fetch, tlsOnly, timeout } = int(config)
  const response = await oauth
    .pushedAuthorizationRequest(
      as,
      c,
      auth,
      authorizationEndpoint.searchParams,
      {
        [oauth.customFetch]: fetch,
        [oauth.allowInsecureRequests]: !tlsOnly,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout),
      },
    )
    .catch(errorHandler)

  const p = oauth.processPushedAuthorizationResponse(as, c, response)

  let result: oauth.PushedAuthorizationResponse
  try {
    result = await p
  } catch (err) {
    if (retryable(err, options)) {
      return buildAuthorizationUrlWithPAR(config, parameters, {
        ...options,
        flag: retry,
      })
    }
    errorHandler(err)
  }

  return buildAuthorizationUrl(config, { request_uri: result.request_uri })
}

/**
 * Returns a URL to redirect the user-agent to after they log out to trigger
 * {@link https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout RP-Initiated Logout}
 * at the Authorization Server.
 *
 * Note:
 * {@link ServerMetadata.end_session_endpoint URL of the authorization server's end session endpoint}
 * must be configured.
 *
 * @example
 *
 * ```ts
 * let config!: client.Configuration
 * let post_logout_redirect_uri!: string
 * let id_token!: string
 *
 * let redirectTo = client.buildEndSessionUrl(config, {
 *   post_logout_redirect_uri,
 *   id_token_hint: id_token,
 * })
 * // redirect now
 * ```
 *
 * @param parameters Logout endpoint parameters
 *
 * @returns {@link !URL} Instance with {@link !URL.searchParams} including
 *   `client_id` and all parameters from the `parameters` argument
 *
 * @group OpenID Connect 1.0
 */
export function buildEndSessionUrl(
  config: Configuration,
  parameters?: URLSearchParams | Record<string, string>,
): URL {
  checkConfig(config)

  const { as, c, tlsOnly } = int(config)
  const endSessionEndpoint = oauth.resolveEndpoint(
    as,
    'end_session_endpoint',
    false,
    tlsOnly,
  )

  parameters = new URLSearchParams(parameters)

  if (!parameters.has('client_id')) {
    parameters.set('client_id', c.client_id)
  }

  for (const [k, v] of parameters.entries()) {
    endSessionEndpoint.searchParams.append(k, v)
  }

  return endSessionEndpoint
}

function checkConfig(input: unknown): asserts input is Configuration {
  if (!(input instanceof Configuration)) {
    throw CodedTypeError(
      '"config" must be an instance of Configuration',
      ERR_INVALID_ARG_TYPE,
    )
  }

  if (Object.getPrototypeOf(input) !== Configuration.prototype) {
    throw CodedTypeError(
      'subclassing Configuration is not allowed',
      ERR_INVALID_ARG_VALUE,
    )
  }
}

function signal(timeout?: number): AbortSignal | undefined {
  return timeout ? AbortSignal.timeout(timeout * 1000) : undefined
}

/**
 * Performs a UserInfo Request at the
 * {@link ServerMetadata.userinfo_endpoint userinfo endpoint} and returns the
 * parsed UserInfo claims from either its JSON or JWT response.
 *
 * Authorization Header is used to transmit the Access Token value. No other
 * Access Token means of transport are supported.
 *
 * Note:
 * {@link ServerMetadata.userinfo_endpoint URL of authorization server's UserInfo endpoint}
 * must be configured.
 *
 * @param accessToken OAuth 2.0 Access Token
 * @param expectedSubject Expected `sub` claim value. In response to OpenID
 *   Connect authentication requests, the expected subject is the one from the
 *   ID Token claims retrieved from {@link TokenEndpointResponseHelpers.claims}
 *   which is available on all returned Token Endpoint responses.
 *
 * @group OpenID Connect 1.0
 * @group Protected Resource Requests
 *
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo)
 */
export async function fetchUserInfo(
  config: Configuration,
  accessToken: string,
  expectedSubject: string | typeof skipSubjectCheck,
  options?: DPoPOptions,
): Promise<oauth.UserInfoResponse> {
  checkConfig(config)

  const { as, c, fetch, tlsOnly, nonRepudiation, timeout, decrypt } =
    int(config)
  const response = await oauth
    .userInfoRequest(as, c, accessToken, {
      [oauth.customFetch]: fetch,
      [oauth.allowInsecureRequests]: !tlsOnly,
      DPoP: options?.DPoP,
      headers: new Headers(headers),
      signal: signal(timeout),
    })
    .catch(errorHandler)

  let exec = oauth.processUserInfoResponse(as, c, expectedSubject, response, {
    [oauth.jweDecrypt]: decrypt,
  })

  let result: oauth.UserInfoResponse
  try {
    result = await exec
  } catch (err) {
    if (retryable(err, options)) {
      return fetchUserInfo(config, accessToken, expectedSubject, {
        ...options,
        flag: retry,
      })
    }

    errorHandler(err)
  }

  getContentType(response) === 'application/jwt' &&
    (await nonRepudiation?.(response))

  return result
}

function retryable(err: unknown, options: DPoPOptions | undefined) {
  if (options?.DPoP && options.flag !== retry) {
    return oauth.isDPoPNonceError(err)
  }

  return false
}

/**
 * Queries the
 * {@link ServerMetadata.introspection_endpoint token introspection endpoint} to
 * obtain the status and metadata of a given token. The range of metadata
 * returned is at the discretion of the authorization server.
 *
 * Note:
 * {@link ServerMetadata.introspection_endpoint URL of the authorization server's token introspection endpoint}
 * must be configured.
 *
 * @param token OAuth 2.0 token (either access token or refresh token) that is
 *   being introspected
 * @param parameters Additional parameters to be included in the introspection
 *   request body, such as `token_type_hint`
 * @param token
 * @param parameters
 *
 * @group Token Management
 *
 * @see [RFC 7662 - OAuth 2.0 Token Introspection](https://www.rfc-editor.org/rfc/rfc7662.html#section-2)
 * @see [draft-ietf-oauth-jwt-introspection-response-12 - JWT Response for OAuth Token Introspection](https://www.ietf.org/archive/id/draft-ietf-oauth-jwt-introspection-response-12.html#section-4)
 */
export async function tokenIntrospection(
  config: Configuration,
  token: string,
  parameters?: URLSearchParams | Record<string, string>,
): Promise<oauth.IntrospectionResponse> {
  checkConfig(config)

  const { as, c, auth, fetch, tlsOnly, nonRepudiation, timeout, decrypt } =
    int(config)
  const response = await oauth
    .introspectionRequest(as, c, auth, token, {
      [oauth.customFetch]: fetch,
      [oauth.allowInsecureRequests]: !tlsOnly,
      additionalParameters: new URLSearchParams(parameters),
      headers: new Headers(headers),
      signal: signal(timeout),
    })
    .catch(errorHandler)

  const result = await oauth
    .processIntrospectionResponse(as, c, response, {
      [oauth.jweDecrypt]: decrypt,
    })
    .catch(errorHandler)

  getContentType(response) === 'application/token-introspection+jwt' &&
    (await nonRepudiation?.(response))

  return result
}

const retry: unique symbol = Symbol()
export interface DPoPOptions {
  /**
   * DPoP handle to use for requesting a sender-constrained access token.
   * Obtained from {@link getDPoPHandle}
   *
   * @see {@link !DPoP RFC 9449 - OAuth 2.0 Demonstrating Proof of Possession (DPoP)}
   */
  DPoP?: DPoPHandle

  /**
   * This is not part of the public API.
   *
   * @private
   *
   * @ignore
   *
   * @internal
   */
  flag?: typeof retry
}

/**
 * Performs any Grant request at the
 * {@link ServerMetadata.token_endpoint token endpoint}. The purpose is to be
 * able to execute grant requests such as Token Exchange Grant, JWT Bearer Token
 * Grant, SAML 2.0 Bearer Assertion Grant, or any other grant.
 *
 * Note:
 * {@link ServerMetadata.token_endpoint URL of the authorization server's token endpoint}
 * must be configured.
 *
 * @example
 *
 * Requesting an Access Token using the JWT Bearer Token Grant
 *
 * ```ts
 * let config!: client.Configuration
 * let scope!: string
 * let resource!: string
 * let assertion!: string
 *
 * let tokenEndpointResponse = await client.genericGrantRequest(
 *   config,
 *   'urn:ietf:params:oauth:grant-type:jwt-bearer',
 *   { scope, resource, assertion },
 * )
 * ```
 *
 * @param grantType Grant Type
 * @param parameters Parameters required by the given grant type to send to the
 *   {@link ServerMetadata.token_endpoint token endpoint}
 *
 * @group Grants
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc8693.html Token Exchange Grant}
 * @see {@link https://www.rfc-editor.org/rfc/rfc7523.html#section-2.1 JWT Bearer Token Grant}
 * @see {@link https://www.rfc-editor.org/rfc/rfc7522.html#section-2.1 SAML 2.0 Bearer Assertion Grant}
 */
export async function genericGrantRequest(
  config: Configuration,
  grantType: string,
  parameters: URLSearchParams | Record<string, string>,
  options?: DPoPOptions,
): Promise<oauth.TokenEndpointResponse & TokenEndpointResponseHelpers> {
  checkConfig(config)

  const { as, c, auth, fetch, tlsOnly, timeout, decrypt } = int(config)
  const result = await oauth
    .genericTokenEndpointRequest(
      as,
      c,
      auth,
      grantType,
      new URLSearchParams(parameters),
      {
        [oauth.customFetch]: fetch,
        [oauth.allowInsecureRequests]: !tlsOnly,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout),
      },
    )
    .then((response) =>
      oauth.processGenericTokenEndpointResponse(as, c, response, {
        [oauth.jweDecrypt]: decrypt,
      }),
    )
    .catch(errorHandler)

  addHelpers(result)
  return result
}

/**
 * Attempts revocation of an OAuth 2.0 token by making a request to the
 * {@link ServerMetadata.revocation_endpoint token revocation endpoint}. Whether
 * the token gets revoked, and the effect of that revocation is at the
 * discretion of the authorization server.
 *
 * Note:
 * {@link ServerMetadata.revocation_endpoint URL of the authorization server's token revocation endpoint}
 * must be configured.
 *
 * @param token OAuth 2.0 token (either access token or refresh token) that is
 *   being revoked
 * @param parameters Additional parameters to be included in the revocation
 *   request body, such as `token_type_hint`
 *
 * @group Token Management
 *
 * @see [RFC 7009 - OAuth 2.0 Token Revocation](https://www.rfc-editor.org/rfc/rfc7009.html#section-2)
 */
export async function tokenRevocation(
  config: Configuration,
  token: string,
  parameters?: URLSearchParams | Record<string, string>,
): Promise<void> {
  checkConfig(config)

  const { as, c, auth, fetch, tlsOnly, timeout } = int(config)
  return oauth
    .revocationRequest(as, c, auth, token, {
      [oauth.customFetch]: fetch,
      [oauth.allowInsecureRequests]: !tlsOnly,
      additionalParameters: new URLSearchParams(parameters),
      headers: new Headers(headers),
      signal: signal(timeout),
    })
    .then(oauth.processRevocationResponse)
    .catch(errorHandler)
}

/**
 * Performs an arbitrary Protected Resource resource.
 *
 * Authorization Header is used to transmit the Access Token value. No other
 * Access Token means of transport are supported.
 *
 * @param accessToken OAuth 2.0 Access Token
 * @param url URL to send the request to
 * @param method HTTP Request method to use for the request
 * @param body HTTP Request body to send in the request
 * @param headers HTTP Request headers to add to the request
 *
 * @group Protected Resource Requests
 */
export async function fetchProtectedResource(
  config: Configuration,
  accessToken: string,
  url: URL,
  method: string,
  body?: FetchBody,
  headers?: Headers,
  options?: DPoPOptions,
): Promise<Response> {
  checkConfig(config)

  headers ||= new Headers()
  if (!headers.has('user-agent')) {
    headers.set('user-agent', USER_AGENT)
  }

  const { fetch, tlsOnly, timeout } = int(config)
  const exec = oauth.protectedResourceRequest(
    accessToken,
    method,
    url,
    headers,
    body,
    {
      [oauth.customFetch]: fetch,
      [oauth.allowInsecureRequests]: !tlsOnly,
      DPoP: options?.DPoP,
      signal: signal(timeout),
    },
  )

  let result: Response
  try {
    result = await exec
  } catch (err) {
    if (retryable(err, options)) {
      return fetchProtectedResource(
        config,
        accessToken,
        url,
        method,
        body,
        headers,
        {
          ...options,
          flag: retry,
        },
      )
    }

    errorHandler(err)
  }

  return result
}

function getContentType(response: Response): string | undefined {
  return response.headers.get('content-type')?.split(';')[0]
}
