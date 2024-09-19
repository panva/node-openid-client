# Variable: clockSkew

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• `const` **clockSkew**: *typeof* `oauth.clockSkew` = `oauth.clockSkew`

Use to adjust the assumed current time. Positive and negative finite values
representing seconds are allowed. Default is `0` (Date.now() + 0 seconds is
used).

## Examples

When the local clock is mistakenly 1 hour in the past

```ts
let clientMetadata: client.ClientMetadata = {
  client_id: 'abc4ba37-4ab8-49b5-99d4-9441ba35d428',
  // ... other metadata
  [client.clockSkew]: +(60 * 60),
}
```

When the local clock is mistakenly 1 hour in the future

```ts
let clientMetadata: client.ClientMetadata = {
  client_id: 'abc4ba37-4ab8-49b5-99d4-9441ba35d428',
  // ... other metadata
  [client.clockSkew]: -(60 * 60),
}
```
