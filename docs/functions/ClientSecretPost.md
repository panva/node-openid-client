# Function: ClientSecretPost()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **ClientSecretPost**(`clientSecret`): [`ClientAuth`](../type-aliases/ClientAuth.md)

**`client_secret_post`** uses the HTTP request body to send `client_id` and
`client_secret` as `application/x-www-form-urlencoded` body parameters

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clientSecret` | `string` | Client Secret |

## Returns

[`ClientAuth`](../type-aliases/ClientAuth.md)

## Examples

Usage with a [Configuration](../classes/Configuration.md) obtained through [discovery](discovery.md)

```ts
let server!: URL
let clientId!: string
let clientSecret!: string
let clientMetadata!: Partial<client.ClientMetadata> | string | undefined

let config = await client.discovery(
  server,
  clientId,
  clientMetadata,
  client.ClientSecretPost(clientSecret),
)
```

Usage with a [Configuration](../classes/Configuration.md) instance

```ts
let server!: client.ServerMetadata
let clientId!: string
let clientSecret!: string
let clientMetadata!: Partial<client.ClientMetadata> | string | undefined

let config = new client.Configuration(
  server,
  clientId,
  clientMetadata,
  client.ClientSecretPost(clientSecret),
)
```

## See

 - [OAuth Token Endpoint Authentication Methods](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#token-endpoint-auth-method)
 - [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3)
 - [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
