# Interface: DiscoveryRequestOptions

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

## Properties

### \[customFetch\]?

• `optional` **\[customFetch\]**: [`CustomFetch`](../type-aliases/CustomFetch.md)

Custom [Fetch API](https://developer.mozilla.org/docs/Web/API/Window/fetch) implementation to use for the HTTP Requests
the client will be making.

#### See

[customFetch](../variables/customFetch.md)

***

### algorithm?

• `optional` **algorithm**: `"oidc"` \| `"oauth2"`

The issuer transformation algorithm to use. Default is `oidc`.

Note: This has no effect if the first argument is a URL with a pathname
containing `/.well-known/`.

#### Example

```txt
Given the Issuer Identifier is https://example.com
  oidc  => https://example.com/.well-known/openid-configuration
  oauth => https://example.com/.well-known/oauth-authorization-server

Given the Issuer Identifier is https://example.com/pathname
  oidc  => https://example.com/pathname/.well-known/openid-configuration
  oauth => https://example.com/.well-known/oauth-authorization-server/pathname
```

#### See

 - [OpenID Connect Discovery 1.0 (oidc)](https://openid.net/specs/openid-connect-discovery-1_0.html)
 - [RFC8414 - OAuth 2.0 Authorization Server Metadata (oauth)](https://www.rfc-editor.org/rfc/rfc8414.html)

***

### execute?

• `optional` **execute**: (`config`) => `void`[]

Methods (available list linked below) to execute with the
[Configuration](../classes/Configuration.md) instance as argument after it is instantiated

Note: Presence of [allowInsecureRequests](../functions/allowInsecureRequests.md) in this option also enables
the use of insecure HTTP requests for the Authorization Server Metadata
discovery request itself.

#### Example

Disable the HTTPS-only restriction for the discovery call and subsequently
for all requests made with the resulting [Configuration](../classes/Configuration.md) instance.

```ts
let server!: URL
let clientId!: string
let clientMetadata!:
  | Partial<client.ClientMetadata>
  | undefined
  | string
let clientAuth!: client.ClientAuth | undefined

let config = await client.discovery(
  server,
  clientId,
  clientMetadata,
  clientAuth,
  {
    execute: [client.allowInsecureRequests],
  },
)
```

#### See

 - [allowInsecureRequests](../functions/allowInsecureRequests.md)
 - [enableNonRepudiationChecks](../functions/enableNonRepudiationChecks.md)
 - [useCodeIdTokenResponseType](../functions/useCodeIdTokenResponseType.md)
 - [enableDetachedSignatureResponseChecks](../functions/enableDetachedSignatureResponseChecks.md)
 - [useJwtResponseMode](../functions/useJwtResponseMode.md)

***

### timeout?

• `optional` **timeout**: `number`

Timeout (in seconds) for the Authorization Server Metadata discovery. If
this option is used, then the same timeout value will be assigned to the
resolved [Configuration](../classes/Configuration.md) instance for use with all its future
individual HTTP requests. Default is `30` (seconds)
