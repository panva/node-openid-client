# Function: pollDeviceAuthorizationGrant()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **pollDeviceAuthorizationGrant**(`config`, `deviceAuthorizationResponse`, `parameters`?, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

Continuously polls the [token endpoint](../interfaces/ServerMetadata.md#token_endpoint)
until the end-user finishes the [Device Authorization Grant](https://www.rfc-editor.org/rfc/rfc8628.html) process
on their secondary device

Note:
[URL of the authorization server's token endpoint](../interfaces/ServerMetadata.md#token_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `deviceAuthorizationResponse` | [`DeviceAuthorizationResponse`](../interfaces/DeviceAuthorizationResponse.md) | Device Authorization Response obtained from [initiateDeviceAuthorization](initiateDeviceAuthorization.md) |
| `parameters`? | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Additional parameters that will be sent to the token endpoint, typically used for parameters such as `scope` and a `resource` ([Resource Indicator](https://www.rfc-editor.org/rfc/rfc8707)) |
| `options`? | [`DeviceAutorizationGrantPollOptions`](../interfaces/DeviceAutorizationGrantPollOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

## Example

```ts
let config!: client.Configuration
let scope!: string

let deviceAuthorizationResponse =
  await client.initiateDeviceAuthorization(config, { scope })

let { user_code, verification_uri, verification_uri_complete } =
  deviceAuthorizationResponse

console.log({ user_code, verification_uri, verification_uri_complete })

let tokenEndpointResponse = await client.pollDeviceAuthorizationGrant(
  config,
  deviceAuthorizationResponse,
)
```
