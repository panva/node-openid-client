# Type Alias: CustomFetch()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• **CustomFetch**: (`url`, `options`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Response`](https://developer.mozilla.org/docs/Web/API/Response)\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | - |
| `options` | `object` | - |
| `options.body` | [`FetchBody`](FetchBody.md) | The request body content to send to the server |
| `options.headers` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> | HTTP Headers |
| `options.method` | `string` | The [request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) |
| `options.redirect` | `"manual"` | See [Request.redirect](https://developer.mozilla.org/docs/Web/API/Request/redirect) |
| `options.signal`? | [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal) | An AbortSignal configured as per the [ConfigurationProperties.timeout](../interfaces/ConfigurationProperties.md#timeout) value |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Response`](https://developer.mozilla.org/docs/Web/API/Response)\>

## See

[customFetch](../variables/customFetch.md)
