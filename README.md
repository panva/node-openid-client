# High-Level OAuth 2 / OpenID Connect Client API for JavaScript Runtimes

TODO

## Features

The following features are currently in scope and implemented in this software:

- Authorization Server Metadata discovery
- Authorization Code Flow (profiled under OpenID Connect 1.0, OAuth 2.0, OAuth 2.1, FAPI 1.0 Advanced, and FAPI 2.0)
- Refresh Token, Device Authorization, and Client Credentials Grants
- Demonstrating Proof-of-Possession at the Application Layer (DPoP)
- Token Introspection and Revocation
- Pushed Authorization Requests (PAR)
- UserInfo and Protected Resource Requests
- Authorization Server Issuer Identification
- JWT Secured Introspection, Response Mode (JARM), Authorization Request (JAR), and UserInfo

## Sponsor

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./sponsor/Auth0byOkta_dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./sponsor/Auth0byOkta_light.png">
  <img height="65" align="left" alt="Auth0 by Okta" src="./sponsor/Auth0byOkta_light.png">
</picture>

If you want to quickly add authentication to JavaScript apps, feel free to check out Auth0's JavaScript SDK and free plan. [Create an Auth0 account; it's free!][sponsor-auth0]<br><br>

## [Certification](https://openid.net/certification/faq/)

[<img width="96" height="50" align="right" src="https://user-images.githubusercontent.com/241506/166977513-7cd710a9-7f60-4944-aebe-a658e9f36375.png" alt="OpenID Certification">](#certification)

[Filip Skokan](https://github.com/panva) has [certified](https://openid.net/certification) that [this software](https://github.com/panva/openid-client) conforms to the Basic, FAPI 1.0, and FAPI 2.0 Relying Party Conformance Profiles of the OpenID Connect™ protocol.

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Quick start

```ts
import * as client from 'openid-client'

let server!: URL
let clientId!: string
let clientSecret!: string
let config: client.Configuration = await client.discovery(
  server,
  clientId,
  clientSecret,
)
```

### Authorization Code Flow

Authorization Code flow is for obtaining Access Tokens (and optionally Refresh Tokens) to use with
third party APIs.

When you want to have your end-users authorize or authenticate you need to send them to the authorization server's `authorization_endpoint`. Consult the web framework of your choice on how to redirect but here's how
to get the authorization endpoint's URL with parameters already encoded in the query to redirect
to.

```ts
/**
 * Value used in the authorization request as redirect_uri pre-registered at the
 * Authorization Server.
 */
let redirect_uri!: string
let scope!: string
/**
 * The following MUST be generated for every redirect to the
 * authorization_endpoint. You must store the code_verifier and state in the
 * end-user session such that it can be recovered as the user gets redirected
 * from the authorization server back to your application.
 */
let code_verifier: string = client.randomPKCECodeVerifier()
let code_challenge: string =
  await client.calculatePKCECodeChallenge(code_verifier)
let state!: string

let parameters: Record<string, string> = {
  redirect_uri,
  scope,
  code_challenge,
  code_challenge_method: 'S256',
}

if (
  config.serverMetadata().code_challenge_methods_supported?.includes('S256') !==
  true
) {
  /**
   * We cannot be sure the server supports PKCE so we're going to use state too.
   * Use of PKCE is backwards compatible even if the AS doesn't support it which
   * is why we're using it regardless.
   */
  state = client.randomState()
  parameters.state = state
}

let redirectTo: URL = client.buildAuthorizationUrl(config, parameters)

// now redirect the user to redirectTo.href
console.log('redirecting to', redirectTo.href)
```

When end-users are redirected back to your `redirect_uri` your application consumes the callback and
passes in the `code_verifier` to include it in the authorization code grant token exchange.

```ts
let getCurrentUrl!: (...args: any) => URL

let tokens: client.TokenEndpointResponse = await client.authorizationCodeGrant(
  config,
  getCurrentUrl(),
  {
    pkceCodeVerifier: code_verifier,
    expectedState: state,
  },
)

console.log('Token Endpoint Response', tokens)
```

You can then fetch a protected resource response

```ts
let protectedResourceResponse: Response = await client.fetchProtectedResource(
  config,
  tokens.access_token,
  new URL('https://rs.example.com/api'),
  'GET',
)

console.log(
  'Protected Resource Response',
  await protectedResourceResponse.json(),
)
```

### Device Authorization Grant (Device Flow)

```ts
let scope!: string
let response = await client.initiateDeviceAuthorization(config, { scope })

console.log('User Code:', response.user_code)
console.log('Verification URI:', response.verification_uri)
console.log('Verification URI (complete):', response.verification_uri_complete)
```

You will display the instructions to the end-user and have them directed at `verification_uri` or
`verification_uri_complete`, afterwards you can start polling for the Device Access Token Response.

```ts
let tokens: client.TokenEndpointResponse =
  await client.pollDeviceAuthorizationGrant(config, response)

console.log('Token Endpoint Response', tokens)
```

This will poll in a regular interval and only resolve with tokens once the end-user authenticates.

### Client Credentials Grant

Client Credentials flow is for obtaining Access Tokens to use with third party APIs on behalf of your application, rather than an end-user which was the case in previous examples.

```ts
let scope!: string
let resource!: string

let tokens: client.TokenEndpointResponse = await lib.clientCredentialsGrant(
  config,
  { scope, resource },
)

console.log('Token Endpoint Response', tokens)
```

## [API Reference](docs/README.md)

`openid-client` is distributed via [npmjs.com](https://www.npmjs.com/package/openid-client) and [github.com](https://github.com/panva/openid-client).

## [Examples](examples/README.md)

**`example`** ESM import

```ts
import * as client from 'openid-client'
```

- Authorization Code Flow (OAuth 2.0) - [source](examples/oauth.ts)
- Authorization Code Flow (OpenID Connect) - [source](examples/oidc.ts) | [diff](examples/oidc.diff)
- Extensions
  - JWT Secured Authorization Request (JAR) - [source](examples/jar.ts) | [diff](examples/jar.diff)
  - JWT Secured Authorization Response Mode (JARM) - [source](examples/jarm.ts) | [diff](examples/jarm.diff)
  - Pushed Authorization Request (PAR) - [source](examples/par.ts) | [diff](examples/par.diff)

## Supported Runtimes

The supported JavaScript runtimes include those that support the utilized Web API globals and standard built-in objects. These are _(but are not limited to)_:

- Browsers
- Bun
- Cloudflare Workers
- Deno
- Electron
- Node.js[^nodejs]
- Vercel's Edge Runtime

## Supported Versions

| Version                                                  | Security Fixes 🔑 | Other Bug Fixes 🐞 | New Features ⭐ | Runtime and Module type         |
| -------------------------------------------------------- | ----------------- | ------------------ | --------------- | ------------------------------- |
| [v6.x](https://github.com/panva/openid-client/tree/v6.x) | ✅                | ✅                 | ✅              | Universal[^universal] ESM[^cjs] |
| [v5.x](https://github.com/panva/openid-client/tree/v5.x) | ✅                | ❌                 | ❌              | Node.js CJS + ESM               |

[sponsor-auth0]: https://auth0.com/signup?utm_source=external_sites&utm_medium=panva&utm_campaign=devn_signup
[WebCryptoAPI]: https://w3c.github.io/webcrypto/
[Fetch API]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

[^nodejs]: Node.js v20.x as baseline is required

[^universal]: Assumes runtime support of [WebCryptoAPI][] and [Fetch API][]

[^cjs]: CJS style `require('openid-client')` is possible in Node.js versions where `process.features.require_module` is `true` or with the `--experimental-require-module` Node.js CLI flag.
