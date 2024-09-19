# Function: randomDPoPKeyPair()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **randomDPoPKeyPair**(`alg`?, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKeyPair`](../interfaces/CryptoKeyPair.md)\>

Generates random [CryptoKeyPair](../interfaces/CryptoKeyPair.md) to sign DPoP Proof JWTs with

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `alg`? | `string` | One of the supported [JWS Algorithm](../type-aliases/JWSAlgorithm.md) identifiers. Default is `ES256`. |
| `options`? | [`GenerateKeyPairOptions`](../interfaces/GenerateKeyPairOptions.md) |  |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKeyPair`](../interfaces/CryptoKeyPair.md)\>

## See

[DPoP](https://www.rfc-editor.org/rfc/rfc9449.html)
