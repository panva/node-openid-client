# Class: Configuration

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

Configuration is an abstraction over the
[OAuth 2.0 Authorization Server metadata](../interfaces/ServerMetadata.md) and
[OAuth 2.0 Client metadata](../interfaces/ClientMetadata.md)

Configuration instances are obtained either through

- (RECOMMENDED) the [discovery](../functions/discovery.md) function that discovers the
  [OAuth 2.0 Authorization Server metadata](../interfaces/ServerMetadata.md) using the
  Authorization Server's Issuer Identifier, or
- The [Configuration](Configuration.md) constructor if the
  [OAuth 2.0 Authorization Server metadata](../interfaces/ServerMetadata.md) is known
  upfront

## Examples

(RECOMMENDED) Setting up a Configuration with a Server Metadata discovery
step

```ts
let server!: URL
let clientId!: string
let clientSecret!: string | undefined

let config = await client.discovery(server, clientId, clientSecret)
```

Setting up a Configuration with a constructor

```ts
let server!: client.ServerMetadata
let clientId!: string
let clientSecret!: string | undefined

let config = new client.Configuration(server, clientId, clientSecret)
```

## Implements

- [`ConfigurationMethods`](../interfaces/ConfigurationMethods.md)
- [`ConfigurationProperties`](../interfaces/ConfigurationProperties.md)

## Constructors

### new Configuration()

▸ **new Configuration**(`server`, `clientId`, `metadata`?, `clientAuthentication`?): [`Configuration`](Configuration.md)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `server` | [`ServerMetadata`](../interfaces/ServerMetadata.md) | Authorization Server Metadata |
| `clientId` | `string` | Client Identifier at the Authorization Server |
| `metadata`? | `string` \| [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ClientMetadata`](../interfaces/ClientMetadata.md)\> | Client Metadata, when a string is passed in it is a shorthand for passing just [ClientMetadata.client_secret](../interfaces/ClientMetadata.md#client_secret). |
| `clientAuthentication`? | [`ClientAuth`](../type-aliases/ClientAuth.md) | Implementation of the Client's Authentication Method at the Authorization Server. |

#### Returns

[`Configuration`](Configuration.md)
