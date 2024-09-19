# Function: initiateDeviceAuthorization()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **initiateDeviceAuthorization**(`config`, `parameters`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`DeviceAuthorizationResponse`](../interfaces/DeviceAuthorizationResponse.md)\>

Initiates a [Device Authorization Grant](https://www.rfc-editor.org/rfc/rfc8628.html) using parameters from the
`parameters` argument.

Note:
[URL of the authorization server's device authorization endpoint](../interfaces/ServerMetadata.md#device_authorization_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `parameters` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Authorization request parameters that will be sent to the device authorization endpoint |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`DeviceAuthorizationResponse`](../interfaces/DeviceAuthorizationResponse.md)\>

## Example

```ts
let config!: client.Configuration
let scope!: string

let deviceAuthorizationResponse =
  await client.initiateDeviceAuthorization(config, { scope })

let { user_code, verification_uri, verification_uri_complete } =
  deviceAuthorizationResponse

console.log({ user_code, verification_uri, verification_uri_complete })
```
