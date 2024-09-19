# Interface: ConfigurationProperties

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

Public properties available on a [Configuration](../classes/Configuration.md) instance

## Properties

### \[customFetch\]?

• `optional` **\[customFetch\]**: [`CustomFetch`](../type-aliases/CustomFetch.md)

Custom [Fetch API](https://developer.mozilla.org/docs/Web/API/Window/fetch) implementation to use for the HTTP Requests
the client will be making.

#### See

[customFetch](../variables/customFetch.md)

***

### timeout?

• `optional` **timeout**: `number`

Timeout (in seconds) for the HTTP Requests the client will be making.
Default is `30` (seconds)
