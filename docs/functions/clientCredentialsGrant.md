# Function: clientCredentialsGrant()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **clientCredentialsGrant**(`config`, `parameters`?, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

Performs an OAuth 2.0 [Client Credentials Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4) at the Authorization
Server's [token endpoint](../interfaces/ServerMetadata.md#token_endpoint) using parameters
from the `parameters` argument

Note:
[URL of the authorization server's token endpoint](../interfaces/ServerMetadata.md#token_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `parameters`? | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Additional parameters that will be sent to the token endpoint, typically used for parameters such as `scope` and a `resource` ([Resource Indicator](https://www.rfc-editor.org/rfc/rfc8707)) |
| `options`? | [`DPoPOptions`](../interfaces/DPoPOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

## Example

Requesting an Access Token using the [Client Credentials Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4) with
a `scope` and a `resource` ([Resource Indicator](https://www.rfc-editor.org/rfc/rfc8707))
parameters.

```ts
let config!: client.Configuration
let scope!: string
let resource!: string

let tokenEndpointResponse = await client.clientCredentialsGrant(config, {
  scope,
  resource,
})
```
