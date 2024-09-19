# Function: useJwtResponseMode()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **useJwtResponseMode**(`config`): `void`

This changes the `response_mode` used by the client to be `jwt` and expects
the authorization server response passed to [authorizationCodeGrant](authorizationCodeGrant.md) to
be one described by [JARM](https://openid.net/specs/oauth-v2-jarm.html).

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
    execute: [client.useJwtResponseMode],
  },
)
```

Usage with a [Configuration](../classes/Configuration.md) instance

```ts
let config!: client.Configuration

client.useJwtResponseMode(config)
```

## See

[JARM](https://openid.net/specs/oauth-v2-jarm.html)
