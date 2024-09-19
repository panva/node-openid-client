# Function: enableDetachedSignatureResponseChecks()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **enableDetachedSignatureResponseChecks**(`config`): `void`

This builds on top of [useCodeIdTokenResponseType](useCodeIdTokenResponseType.md) and enables the
response to be validated as per the
[FAPI 1.0 Advanced profile](https://openid.net/specs/openid-financial-api-part-2-1_0.html#id-token-as-detached-signature).

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
    execute: [
      client.useCodeIdTokenResponseType,
      client.enableDetachedSignatureResponseChecks,
    ],
  },
)
```

Usage with a [Configuration](../classes/Configuration.md) instance

```ts
let config!: client.Configuration

client.useCodeIdTokenResponseType(config)
client.enableDetachedSignatureResponseChecks(config)
```

## See

[ID Token as Detached Signature](https://openid.net/specs/openid-financial-api-part-2-1_0.html#id-token-as-detached-signature)
