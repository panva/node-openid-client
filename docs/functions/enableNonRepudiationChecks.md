# Function: enableNonRepudiationChecks()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **enableNonRepudiationChecks**(`config`): `void`

Enables validating the JWS Signature of either a JWT [Response.body](https://developer.mozilla.org/docs/Web/API/Response/body) or
[TokenEndpointResponse.id_token](../interfaces/TokenEndpointResponse.md#id_token) of a processed [Response](https://developer.mozilla.org/docs/Web/API/Response) such as
JWT UserInfo or JWT Introspection responses.

Note: Validating signatures of JWTs received via direct communication between
the client and a TLS-secured endpoint (which it is here) is not mandatory
since the TLS server validation is used to validate the issuer instead of
checking the token signature. You only need to use this method for
non-repudiation purposes.

Note:
[URL of the authorization server's JWK Set document](../interfaces/ServerMetadata.md#jwks_uri)
must be configured.

Note: Supports only digital signatures using
[these supported JWS Algorithms](../type-aliases/JWSAlgorithm.md).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) |

## Returns

`void`

## Examples

Usage with a [Configuration](../classes/Configuration.md) obtained through [discovery](discovery.md) to also
disable the its HTTPS-only restriction.

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
    execute: [client.enableNonRepudiationChecks],
  },
)
```

Usage with a [Configuration](../classes/Configuration.md) instance

```ts
let config!: client.Configuration

client.enableNonRepudiationChecks(config)
```
