# Function: useCodeIdTokenResponseType()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **useCodeIdTokenResponseType**(`config`): `void`

This changes the `response_type` used by the client to be `code id_token` and
expects the authorization server response passed to
[authorizationCodeGrant](authorizationCodeGrant.md) to be one described by
[OpenID Connect 1.0 Hybrid Flow](https://openid.net/specs/openid-connect-core-1_0.html#HybridFlowAuth).

Note:
[URL of the authorization server's JWK Set document](../interfaces/ServerMetadata.md#jwks_uri)
must be configured.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) |

## Returns

`void`

## Examples

Usage with a [Configuration](../classes/Configuration.md) obtained through [discovery](discovery.md)

```ts
let server!: URL
let clientId!: string
let clientMetadata!: Partial<client.ClientMetadata> | string | undefined
let clientAuth!: client.ClientAuth | undefined

let config = await client.discovery(
  server,
  clientId,
  clientMetadata,
  clientAuth,
  {
    execute: [client.useCodeIdTokenResponseType],
  },
)
```

Usage with a [Configuration](../classes/Configuration.md) instance

```ts
let config!: client.Configuration

client.useCodeIdTokenResponseType(config)
```

## See

[OpenID Connect 1.0 Hybrid Flow](https://openid.net/specs/openid-connect-core-1_0.html#HybridFlowAuth)
