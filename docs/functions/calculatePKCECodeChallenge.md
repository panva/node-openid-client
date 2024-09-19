# Function: calculatePKCECodeChallenge()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **calculatePKCECodeChallenge**(`codeVerifier`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Calculates the PKCE `code_challenge` value to send with an authorization
request using the S256 PKCE Code Challenge Method transformation

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `codeVerifier` | `string` | `code_verifier` value generated e.g. from [randomPKCECodeVerifier](randomPKCECodeVerifier.md) |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

S256 `code_challenge` value calculated from a provided
  `code_verifier`
