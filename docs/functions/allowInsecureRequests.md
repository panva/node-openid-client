# Function: ~~allowInsecureRequests()~~

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **allowInsecureRequests**(`config`): `void`

By default the module only allows interactions with HTTPS endpoints. This
removes that restriction.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) |

## Returns

`void`

## Deprecated

Marked as deprecated only to make it stand out as something you
  shouldn't have the need to use, possibly only for local development and
  testing against non-TLS secured environments.

## Examples

Usage with a [Configuration](../classes/Configuration.md) obtained through [discovery](discovery.md) to also
disable its HTTPS-only restriction.

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
    execute: [client.allowInsecureRequests],
  },
)
```

Usage with a [Configuration](../classes/Configuration.md) instance

```ts
let config!: client.Configuration

client.allowInsecureRequests(config)
```
