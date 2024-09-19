# Function: buildAuthorizationUrlWithPAR()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **buildAuthorizationUrlWithPAR**(`config`, `parameters`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`URL`](https://developer.mozilla.org/docs/Web/API/URL)\>

Returns a URL to redirect the user-agent to to request authorization at the
Authorization Server with a prior step of using [PAR](https://www.rfc-editor.org/rfc/rfc9126.html)

Note:
[URL of the authorization server's authorization endpoint](../interfaces/ServerMetadata.md#authorization_endpoint)
must be configured.

Note:
[URL of the authorization server's pushed authorization request endpoint](../interfaces/ServerMetadata.md#pushed_authorization_request_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `parameters` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\> \| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Authorization request parameters that will be sent to [PAR](https://www.rfc-editor.org/rfc/rfc9126.html) |
| `options`? | [`DPoPOptions`](../interfaces/DPoPOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`URL`](https://developer.mozilla.org/docs/Web/API/URL)\>

[URL](https://developer.mozilla.org/docs/Web/API/URL) Instance with [URL.searchParams](https://developer.mozilla.org/docs/Web/API/URL/searchParams) including
  `client_id` and `request_uri`.

## Examples

Using [PAR](https://www.rfc-editor.org/rfc/rfc9126.html)

```ts
let config!: client.Configuration
let redirect_uri!: string
let scope!: string

// these must be unique for every single authorization request
let code_verifier = client.randomPKCECodeVerifier()
let code_challenge =
  await client.calculatePKCECodeChallenge(code_verifier)

let redirectTo = await client.buildAuthorizationUrlWithPAR(config, {
  redirect_uri,
  scope,
  code_challenge,
  code_challenge_method: 'S256',
})
// redirect now
```

Using [JAR](https://www.rfc-editor.org/rfc/rfc9101.html) and [PAR](https://www.rfc-editor.org/rfc/rfc9126.html) together

```ts
let config!: client.Configuration
let redirect_uri!: string
let scope!: string
let key!: client.CryptoKey

// these must be unique for every single authorization request
let code_verifier = client.randomPKCECodeVerifier()
let code_challenge =
  await client.calculatePKCECodeChallenge(code_verifier)

let { searchParams: params } = await client.buildAuthorizationUrlWithJAR(
  config,
  {
    redirect_uri,
    scope,
    code_challenge,
    code_challenge_method: 'S256',
  },
  key,
)

let redirectTo = await client.buildAuthorizationUrlWithPAR(
  config,
  params,
)
// redirect now
```
