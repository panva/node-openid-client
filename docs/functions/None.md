# Function: None()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **None**(): [`ClientAuth`](../type-aliases/ClientAuth.md)

**`none`** (public client) uses the HTTP request body to send only
`client_id` as `application/x-www-form-urlencoded` body parameter.

## Returns

[`ClientAuth`](../type-aliases/ClientAuth.md)

## Examples

Usage with a [Configuration](../classes/Configuration.md) obtained through [discovery](discovery.md)

```ts
let server!: URL
let clientId!: string
let clientMetadata!: Partial<client.ClientMetadata> | string | undefined

let config = await client.discovery(
  server,
  clientId,
  clientMetadata,
  client.None(),
)
```

Usage with a [Configuration](../classes/Configuration.md) instance

```ts
let server!: client.ServerMetadata
let clientId!: string
let clientMetadata!: Partial<client.ClientMetadata> | string | undefined

let config = new client.Configuration(
  server,
  clientId,
  clientMetadata,
  client.None(),
)
```

## See

 - [OAuth Token Endpoint Authentication Methods](https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#token-endpoint-auth-method)
 - [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
