# Interface: TokenEndpointResponseHelpers

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

Helpers attached to any resolved [TokenEndpointResponse](TokenEndpointResponse.md)

## Methods

### claims()

▸ **claims**(): `undefined` \| [`IDToken`](IDToken.md)

Returns the parsed JWT Claims Set of an
[id_token](TokenEndpointResponse.md#id_token) returned by the
authorization server

Note: Returns `undefined` when
[expires_in](TokenEndpointResponse.md#expires_in) was not returned by the
authorization server

#### Returns

`undefined` \| [`IDToken`](IDToken.md)

***

### expiresIn()

▸ **expiresIn**(): `undefined` \| `number`

Returns the number of seconds until the
[access_token](TokenEndpointResponse.md#access_token) expires

Note: Returns `0` when already expired

Note: Returns `undefined` when
[expires_in](TokenEndpointResponse.md#expires_in) was not returned by the
authorization server

#### Returns

`undefined` \| `number`
