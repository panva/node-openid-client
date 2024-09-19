# Function: buildEndSessionUrl()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **buildEndSessionUrl**(`config`, `parameters`?): [`URL`](https://developer.mozilla.org/docs/Web/API/URL)

Returns a URL to redirect the user-agent to after they log out to trigger
[RP-Initiated Logout](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout)
at the Authorization Server.

Note:
[URL of the authorization server's end session endpoint](../interfaces/ServerMetadata.md#end_session_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `parameters`? | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Logout endpoint parameters |

## Returns

[`URL`](https://developer.mozilla.org/docs/Web/API/URL)

[URL](https://developer.mozilla.org/docs/Web/API/URL) Instance with [URL.searchParams](https://developer.mozilla.org/docs/Web/API/URL/searchParams) including
  `client_id` and all parameters from the `parameters` argument

## Example

```ts
let config!: client.Configuration
let post_logout_redirect_uri!: string
let id_token!: string

let redirectTo = client.buildEndSessionUrl(config, {
  post_logout_redirect_uri,
  id_token_hint: id_token,
})
// redirect now
```
