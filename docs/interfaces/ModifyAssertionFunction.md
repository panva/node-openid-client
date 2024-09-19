# Interface: ModifyAssertionFunction()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **ModifyAssertionFunction**(`header`, `payload`): `void`

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `header` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `undefined` \| [`JsonValue`](../type-aliases/JsonValue.md)\> | JWS Header to modify right before it is signed. |
| `payload` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `undefined` \| [`JsonValue`](../type-aliases/JsonValue.md)\> | JWT Claims Set to modify right before it is signed. |

## Returns

`void`
