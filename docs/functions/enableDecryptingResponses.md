# Function: enableDecryptingResponses()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **enableDecryptingResponses**(`config`, ...`keys`): `void`

Enables the client to process encrypted ID Tokens, encrypted JWT UserInfo
responses, and encrypted JWT Introspection responses. Multiple private keys
may be provided for the decryption key selection process but only a single
one must match the process.

Only the following JWE Key Management Algorithms are supported

- RSA-OAEP
- RSA-OAEP-256
- ECDH-ES (Using P-256 or X25519)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| ...`keys` | ([`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`PrivateKey`](../interfaces/PrivateKey.md))[] |  |

## Returns

`void`

## Example

```ts
let key!: client.CryptoKey | client.PrivateKey
let config!: client.Configuration

client.enableDecryptingResponses(config, key)
```
