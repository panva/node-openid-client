# Function: fetchProtectedResource()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **fetchProtectedResource**(`config`, `accessToken`, `url`, `method`, `body`?, `headers`?, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Response`](https://developer.mozilla.org/docs/Web/API/Response)\>

Performs an arbitrary Protected Resource resource.

Authorization Header is used to transmit the Access Token value. No other
Access Token means of transport are supported.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `accessToken` | `string` | OAuth 2.0 Access Token |
| `url` | [`URL`](https://developer.mozilla.org/docs/Web/API/URL) | URL to send the request to |
| `method` | `string` | HTTP Request method to use for the request |
| `body`? | [`FetchBody`](../type-aliases/FetchBody.md) | HTTP Request body to send in the request |
| `headers`? | [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers) | HTTP Request headers to add to the request |
| `options`? | [`DPoPOptions`](../interfaces/DPoPOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Response`](https://developer.mozilla.org/docs/Web/API/Response)\>
