# Function: discovery()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **discovery**(`server`, `clientId`, `metadata`?, `clientAuthentication`?, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Configuration`](../classes/Configuration.md)\>

Performs Authorization Server Metadata discovery and returns a
[Configuration](../classes/Configuration.md) with the discovered
[Authorization Server](../interfaces/ServerMetadata.md) metadata.

This is the RECOMMENDED method of client configuration.

This has the same effect as calling the [Configuration](../classes/Configuration.md) constructor
except that the server metadata is discovered from its own Authorization
Server Metadata discovery document.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `server` | [`URL`](https://developer.mozilla.org/docs/Web/API/URL) | URL representation of the Authorization Server's Issuer Identifier |
| `clientId` | `string` | Client Identifier at the Authorization Server |
| `metadata`? | `string` \| [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ClientMetadata`](../interfaces/ClientMetadata.md)\> | Client Metadata, when a string is passed in it is a shorthand for passing just [ClientMetadata.client_secret](../interfaces/ClientMetadata.md#client_secret) |
| `clientAuthentication`? | [`ClientAuth`](../type-aliases/ClientAuth.md) | - |
| `options`? | [`DiscoveryRequestOptions`](../interfaces/DiscoveryRequestOptions.md) |  |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Configuration`](../classes/Configuration.md)\>
