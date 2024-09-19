# Function: getDPoPHandle()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **getDPoPHandle**(`config`, `keyPair`, `options`?): [`DPoPHandle`](../interfaces/DPoPHandle.md)

Returns a wrapper / handle around a public/private key pair that is used for
negotiating and proving proof-of-possession to sender-constrain OAuth 2.0
tokens via [DPoP](https://www.rfc-editor.org/rfc/rfc9449.html) at the Authorization Server and Resource Server.

Support for [DPoP](https://www.rfc-editor.org/rfc/rfc9449.html) at the authorization is indicated by
[ServerMetadata.dpop_signing_alg_values_supported](../interfaces/ServerMetadata.md#dpop_signing_alg_values_supported). Whether the
authorization server ends up sender-constraining the access token is at the
server's discretion. When an access token is sender-constrained then the
resulting
[`token_type` will be `dpop`](../interfaces/TokenEndpointResponse.md#token_type).

This wrapper / handle also keeps track of server-issued nonces, allowing this
module to automatically retry requests with a fresh nonce when the server
indicates the need to use one.

Note: Public Clients that use DPoP will also get their Refresh Token
sender-constrained, this binding is not indicated in the response.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `keyPair` | [`CryptoKeyPair`](../interfaces/CryptoKeyPair.md) | [CryptoKeyPair](../interfaces/CryptoKeyPair.md) to sign the DPoP Proof JWT, [randomDPoPKeyPair](randomDPoPKeyPair.md) may be used to generate it |
| `options`? | [`ModifyAssertionOptions`](../interfaces/ModifyAssertionOptions.md) | - |

## Returns

[`DPoPHandle`](../interfaces/DPoPHandle.md)

## See

[RFC 9449 - OAuth 2.0 Demonstrating Proof of Possession (DPoP)](https://www.rfc-editor.org/rfc/rfc9449.html)
