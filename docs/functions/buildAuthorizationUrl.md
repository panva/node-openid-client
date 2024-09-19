# Function: buildAuthorizationUrl()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **buildAuthorizationUrl**(`config`, `parameters`): [`URL`](https://developer.mozilla.org/docs/Web/API/URL)

Returns a URL to redirect the user-agent to to request authorization at the
Authorization Server

Note:
[URL of the authorization server's authorization endpoint](../interfaces/ServerMetadata.md#authorization_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `parameters` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Authorization request parameters that will be sent to PAR |

## Returns

[`URL`](https://developer.mozilla.org/docs/Web/API/URL)

[URL](https://developer.mozilla.org/docs/Web/API/URL) Instance with [URL.searchParams](https://developer.mozilla.org/docs/Web/API/URL/searchParams) including
  `client_id`, `response_type`, and all parameters from the `parameters`
  argument

## Example

```ts
let config!: client.Configuration
let redirect_uri!: string
let scope!: string

// these must be unique for every single authorization request
let code_verifier = client.randomPKCECodeVerifier()
let code_challenge =
  await client.calculatePKCECodeChallenge(code_verifier)

let redirectTo = client.buildAuthorizationUrl(config, {
  redirect_uri,
  scope,
  code_challenge,
  code_challenge_method: 'S256',
})
// redirect now
```
