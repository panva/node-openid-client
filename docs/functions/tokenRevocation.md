# Function: tokenRevocation()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **tokenRevocation**(`config`, `token`, `parameters`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Attempts revocation of an OAuth 2.0 token by making a request to the
[token revocation endpoint](../interfaces/ServerMetadata.md#revocation_endpoint). Whether
the token gets revoked, and the effect of that revocation is at the
discretion of the authorization server.

Note:
[URL of the authorization server's token revocation endpoint](../interfaces/ServerMetadata.md#revocation_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `token` | `string` | OAuth 2.0 token (either access token or refresh token) that is being revoked |
| `parameters`? | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Additional parameters to be included in the revocation request body, such as `token_type_hint` |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

## See

[RFC 7009 - OAuth 2.0 Token Revocation](https://www.rfc-editor.org/rfc/rfc7009.html#section-2)
