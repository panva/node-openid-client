# Interface: AuthorizationCodeGrantChecks

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

## Properties

### expectedNonce?

• `optional` **expectedNonce**: `string`

Expected value of the `nonce` ID Token claim. This value must match
exactly. When `undefined` the expectation is that there is no `nonce` in
the ID Token (i.e. also `undefined`).

Using this option also means that an ID Token must be part of the response.

***

### expectedState?

• `optional` **expectedState**: `string` \| *typeof* `skipStateCheck`

Expected value of the `state` authorization response parameter. This value
must match exactly. When `undefined` the expectation is that there is no
`state` in the authorization response.

***

### idTokenExpected?

• `optional` **idTokenExpected**: `boolean`

Use this to have the client assert that an ID Token is returned by the
Authorization Server.

Note: When `expectedNonce` or `maxAge` is used this has no effect.

***

### maxAge?

• `optional` **maxAge**: `number`

ID Token [`auth_time`](IDToken.md#auth_time) claim value will be checked
to be present and conform to this `maxAge` value. Use of this option is
required if you sent a `max_age` parameter in the authorization request.
Default is [ClientMetadata.default_max_age](ClientMetadata.md#default_max_age) and falls back to not
checking the claim's value beyond it being a number when present.

***

### pkceCodeVerifier?

• `optional` **pkceCodeVerifier**: `string`

When PKCE is used this is the `code_verifier` that will be sent to the
[token endpoint](ServerMetadata.md#token_endpoint).
