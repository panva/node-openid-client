# Variable: clockTolerance

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• `const` **clockTolerance**: *typeof* `oauth.clockTolerance` = `oauth.clockTolerance`

Use to set allowed clock tolerance when checking DateTime JWT Claims. Only
positive finite values representing seconds are allowed. Default is `30` (30
seconds).

## Example

Tolerate 30 seconds clock skew when validating JWT claims like exp or nbf.

```ts
let clientMetadata: client.ClientMetadata = {
  client_id: 'abc4ba37-4ab8-49b5-99d4-9441ba35d428',
  // ... other metadata
  [client.clockTolerance]: 30,
}
```
