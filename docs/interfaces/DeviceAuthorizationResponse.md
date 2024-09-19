# Interface: DeviceAuthorizationResponse

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

## Indexable

 \[`parameter`: `string`\]: [`JsonValue`](../type-aliases/JsonValue.md) \| `undefined`

## Properties

### device\_code

• `readonly` **device\_code**: `string`

The device verification code

***

### expires\_in

• `readonly` **expires\_in**: `number`

The lifetime in seconds of the "device_code" and "user_code"

***

### user\_code

• `readonly` **user\_code**: `string`

The end-user verification code

***

### verification\_uri

• `readonly` **verification\_uri**: `string`

The end-user verification URI on the authorization server. The URI should be short and easy to
remember as end users will be asked to manually type it into their user agent.

***

### interval?

• `readonly` `optional` **interval**: `number`

The minimum amount of time in seconds that the client should wait between polling requests to
the token endpoint.

***

### verification\_uri\_complete?

• `readonly` `optional` **verification\_uri\_complete**: `string`

A verification URI that includes the "user_code" (or other information with the same function
as the "user_code"), which is designed for non-textual transmission
