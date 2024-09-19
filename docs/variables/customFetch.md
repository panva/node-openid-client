# Variable: customFetch

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• `const` **customFetch**: *typeof* `oauth.customFetch` = `oauth.customFetch`

When set on a [Configuration](../classes/Configuration.md), this replaces the use of global fetch. As
a fetch replacement the arguments and expected return are the same as fetch.

In theory any module that claims to be compatible with the
[Fetch API](https://developer.mozilla.org/docs/Web/API/Window/fetch) can be used but your mileage may vary. No workarounds
to allow use of non-conform [Response](https://developer.mozilla.org/docs/Web/API/Response) instances will be considered.

If you only need to update the [Request](https://developer.mozilla.org/docs/Web/API/Request) properties you do not need to
use a [Fetch API](https://developer.mozilla.org/docs/Web/API/Window/fetch) module, just change what you need and pass it
to globalThis.fetch just like this module would normally do.

Its intended use cases are:

- [Request](https://developer.mozilla.org/docs/Web/API/Request)/[Response](https://developer.mozilla.org/docs/Web/API/Response) tracing and logging
- Custom caching strategies
- Changing the [Request](https://developer.mozilla.org/docs/Web/API/Request) properties like headers, body, credentials, mode
  before it is passed to fetch

Known caveats:

- Expect Type-related issues when passing the inputs through to fetch-like
  modules, they hardly ever get their typings inline with actual fetch, you
  should `@ts-expect-error` them.
- Returning self-constructed [Response](https://developer.mozilla.org/docs/Web/API/Response) instances prohibits
  AS/RS-signalled DPoP Nonce caching.

## Examples

Using [sindresorhus/ky](https://github.com/sindresorhus/ky) for retries and
its hooks feature for logging outgoing requests and their responses.

```ts
import ky from 'ky'

let config!: client.Configuration
let logRequest!: (request: Request) => void
let logResponse!: (request: Request, response: Response) => void
let logRetry!: (
  request: Request,
  error: Error,
  retryCount: number,
) => void

config[client.customFetch] = (...args) =>
  ky(args[0], {
    ...args[1],
    hooks: {
      beforeRequest: [
        (request) => {
          logRequest(request)
        },
      ],
      beforeRetry: [
        ({ request, error, retryCount }) => {
          logRetry(request, error, retryCount)
        },
      ],
      afterResponse: [
        (request, _, response) => {
          logResponse(request, response)
        },
      ],
    },
  })
```

Using [nodejs/undici](https://github.com/nodejs/undici) to detect and use
HTTP proxies.

```ts
import * as undici from 'undici'

// see https://undici.nodejs.org/#/docs/api/EnvHttpProxyAgent
let envHttpProxyAgent = new undici.EnvHttpProxyAgent()

let config!: client.Configuration

// @ts-ignore
config[client.customFetch] = (...args) => {
  // @ts-ignore
  return undici.fetch(args[0], { ...args[1], dispatcher: envHttpProxyAgent }) // prettier-ignore
}
```

Using [nodejs/undici](https://github.com/nodejs/undici) to automatically
retry network errors.

```ts
import * as undici from 'undici'

// see https://undici.nodejs.org/#/docs/api/RetryAgent
let retryAgent = new undici.RetryAgent(new undici.Agent(), {
  statusCodes: [],
  errorCodes: [
    'ECONNRESET',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ENETDOWN',
    'ENETUNREACH',
    'EHOSTDOWN',
    'UND_ERR_SOCKET',
  ],
})

let config!: client.Configuration

// @ts-ignore
config[client.customFetch] = (...args) => {
  // @ts-ignore
  return undici.fetch(args[0], { ...args[1], dispatcher: retryAgent }) // prettier-ignore
}
```

Using [nodejs/undici](https://github.com/nodejs/undici) to mock responses in
tests.

```ts
import * as undici from 'undici'

// see https://undici.nodejs.org/#/docs/api/MockAgent
let mockAgent = new undici.MockAgent()
mockAgent.disableNetConnect()

let config!: client.Configuration

// @ts-ignore
config[client.customFetch] = (...args) => {
  // @ts-ignore
  return undici.fetch(args[0], { ...args[1], dispatcher: mockAgent }) // prettier-ignore
}
```
