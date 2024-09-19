# Function: refreshTokenGrant()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **refreshTokenGrant**(`config`, `refreshToken`, `parameters`?, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

Performs an OAuth 2.0 [Refresh Token Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-6) at the Authorization
Server's [token endpoint](../interfaces/ServerMetadata.md#token_endpoint) using parameters
from the `parameters` argument, allowing a client to obtain a new access
token using a valid refresh token.

Note:
[URL of the authorization server's token endpoint](../interfaces/ServerMetadata.md#token_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `refreshToken` | `string` | OAuth 2.0 Refresh Token provided by the authorization server that is used to obtain a new access token. |
| `parameters`? | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Additional parameters that will be sent to the token endpoint, typically used for parameters such as `scope` and a `resource` ([Resource Indicator](https://www.rfc-editor.org/rfc/rfc8707)) |
| `options`? | [`DPoPOptions`](../interfaces/DPoPOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

## Example

Requesting a new Access Token using the [Refresh Token Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-6) with a
`scope` and a `resource` ([Resource Indicator](https://www.rfc-editor.org/rfc/rfc8707))
parameters.

```ts
let config!: client.Configuration
let refreshToken!: string
let scope!: string
let resource!: string

let tokenEndpointResponse = await client.refreshTokenGrant(
  config,
  refreshToken,
  {
    scope,
    resource,
  },
)
```
