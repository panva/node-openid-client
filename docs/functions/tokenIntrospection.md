# Function: tokenIntrospection()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **tokenIntrospection**(`config`, `token`, `parameters`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`IntrospectionResponse`](../interfaces/IntrospectionResponse.md)\>

Queries the
[token introspection endpoint](../interfaces/ServerMetadata.md#introspection_endpoint) to
obtain the status and metadata of a given token. The range of metadata
returned is at the discretion of the authorization server.

Note:
[URL of the authorization server's token introspection endpoint](../interfaces/ServerMetadata.md#introspection_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `token` | `string` | OAuth 2.0 token (either access token or refresh token) that is being introspected |
| `parameters`? | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Additional parameters to be included in the introspection request body, such as `token_type_hint` |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`IntrospectionResponse`](../interfaces/IntrospectionResponse.md)\>

## See

 - [RFC 7662 - OAuth 2.0 Token Introspection](https://www.rfc-editor.org/rfc/rfc7662.html#section-2)
 - [draft-ietf-oauth-jwt-introspection-response-12 - JWT Response for OAuth Token Introspection](https://www.ietf.org/archive/id/draft-ietf-oauth-jwt-introspection-response-12.html#section-4)
