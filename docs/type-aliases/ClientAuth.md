# Type Alias: ClientAuth()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• **ClientAuth**: (`as`, `client`, `body`, `headers`) => `void`

Implementation of the Client's Authentication Method at the Authorization
Server.

The default is [ClientSecretPost](../functions/ClientSecretPost.md) if [ClientMetadata.client_secret](../interfaces/ClientMetadata.md#client_secret)
is present, [None](../functions/None.md) otherwise.

Other Client Authentication Methods must be provided explicitly and their
implementations are linked below.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `as` | [`ServerMetadata`](../interfaces/ServerMetadata.md) |
| `client` | [`ClientMetadata`](../interfaces/ClientMetadata.md) |
| `body` | [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) |
| `headers` | [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers) |

## Returns

`void`

## See

 - [ClientSecretBasic](../functions/ClientSecretBasic.md)
 - [ClientSecretJwt](../functions/ClientSecretJwt.md)
 - [ClientSecretPost](../functions/ClientSecretPost.md)
 - [None](../functions/None.md)
 - [PrivateKeyJwt](../functions/PrivateKeyJwt.md)
 - [TlsClientAuth](../functions/TlsClientAuth.md)
