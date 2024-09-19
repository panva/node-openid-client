# Function: fetchUserInfo()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **fetchUserInfo**(`config`, `accessToken`, `expectedSubject`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`UserInfoResponse`](../interfaces/UserInfoResponse.md)\>

Performs a UserInfo Request at the
[userinfo endpoint](../interfaces/ServerMetadata.md#userinfo_endpoint) and returns the
parsed UserInfo claims from either its JSON or JWT response.

Authorization Header is used to transmit the Access Token value. No other
Access Token means of transport are supported.

Note:
[URL of authorization server's UserInfo endpoint](../interfaces/ServerMetadata.md#userinfo_endpoint)
must be configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Configuration`](../classes/Configuration.md) | - |
| `accessToken` | `string` | OAuth 2.0 Access Token |
| `expectedSubject` | `string` \| *typeof* `skipSubjectCheck` | Expected `sub` claim value. In response to OpenID Connect authentication requests, the expected subject is the one from the ID Token claims retrieved from [TokenEndpointResponseHelpers.claims](../interfaces/TokenEndpointResponseHelpers.md#claims) which is available on all returned Token Endpoint responses. |
| `options`? | [`DPoPOptions`](../interfaces/DPoPOptions.md) | - |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`UserInfoResponse`](../interfaces/UserInfoResponse.md)\>

## See

[OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo)
