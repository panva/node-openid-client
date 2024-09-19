# Function: authorizationCodeGrant()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **authorizationCodeGrant**(`config`, `currentUrl`, `checks`?, `parameters`?, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

This method validates the authorization response and then executes the
[Authorization Code Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1) at the Authorization Server's
[token endpoint](../interfaces/ServerMetadata.md#token_endpoint) to obtain an access
token. ID Token and Refresh Token are also optionally issued by the server.

Note:
[URL of the authorization server's token endpoint](../interfaces/ServerMetadata.md#token_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `currentUrl` | [`URL`](https://developer.mozilla.org/docs/Web/API/URL) | Current URL the Authorization Server provided an Authorization Response to, the `redirect_uri` [Authorization Code Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1) parameter is extracted from this URL by stripping the query string parameters and fragment components. The authorization response parameters are typically expected to be encoded in its query string, and for `code id_token` [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) Response Types in the URL's fragment. |
| `checks`? | [`AuthorizationCodeGrantChecks`](../interfaces/AuthorizationCodeGrantChecks.md) | CSRF Protection checks like PKCE, expected state, or expected nonce |
| `parameters`? | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Additional parameters that will be sent to the token endpoint, typically used for parameters such as `resource` ([Resource Indicator](https://www.rfc-editor.org/rfc/rfc8707)) in cases where multiple resource indicators were requested but the authorization server only supports issuing an access token with a single audience |
| `options`? | [`AuthorizationCodeGrantOptions`](../interfaces/AuthorizationCodeGrantOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`TokenEndpointResponse`](../interfaces/TokenEndpointResponse.md) & [`TokenEndpointResponseHelpers`](../interfaces/TokenEndpointResponseHelpers.md)\>

## Example

```ts
let config!: client.Configuration
let getCodeVerifierFromSession!: (...args: any) => string
let getCurrentUrl!: (...args: any) => URL

let tokens = await client.authorizationCodeGrant(
  config,
  getCurrentUrl(),
  {
    pkceCodeVerifier: getCodeVerifierFromSession(),
  },
)
```
