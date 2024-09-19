# Function: genericGrantRequest()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **genericGrantRequest**(`config`, `grantType`, `parameters`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

Performs any Grant request at the
[token endpoint](../interfaces/ServerMetadata.md#token_endpoint). The purpose is to be
able to execute grant requests such as Token Exchange Grant, JWT Bearer Token
Grant, SAML 2.0 Bearer Assertion Grant, or any other grant.

Note:
[URL of the authorization server's token endpoint](../interfaces/ServerMetadata.md#token_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `grantType` | `string` | Grant Type |
| `parameters` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Parameters required by the given grant type to send to the [token endpoint](../interfaces/ServerMetadata.md#token_endpoint) |
| `options`? | [`DPoPOptions`](../interfaces/DPoPOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

## Example

Requesting an Access Token using the JWT Bearer Token Grant

```ts
let config!: client.Configuration
let scope!: string
let resource!: string
let assertion!: string

let tokenEndpointResponse = await client.genericGrantRequest(
  config,
  'urn:ietf:params:oauth:grant-type:jwt-bearer',
  { scope, resource, assertion },
)
```

## See

 - [Token Exchange Grant](https://www.rfc-editor.org/rfc/rfc8693.html)
 - [JWT Bearer Token Grant](https://www.rfc-editor.org/rfc/rfc7523.html#section-2.1)
 - [SAML 2.0 Bearer Assertion Grant](https://www.rfc-editor.org/rfc/rfc7522.html#section-2.1)
