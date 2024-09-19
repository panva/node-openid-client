# Class: AuthorizationResponseError

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

Thrown when OAuth 2.0 Authorization Error Response is encountered.

## Example

```http
HTTP/1.1 302 Found
Location: https://client.example.com/cb?error=access_denied&state=xyz
```

## Properties

### cause

• **cause**: [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams)

Authorization Response parameters as [URLSearchParams](https://developer.mozilla.org/docs/Web/API/URLSearchParams)

***

### code

• **code**: `"OAUTH_AUTHORIZATION_RESPONSE_ERROR"`

***

### error

• **error**: `string`

Error code given in the Authorization Response

***

### message

• **message**: `string`

***

### name

• **name**: `string`

***

### error\_description?

• `optional` **error\_description**: `string`

Human-readable text providing additional information, used to assist the developer in
understanding the error that occurred, given in the Authorization Response

***

### stack?

• `optional` **stack**: `string`
