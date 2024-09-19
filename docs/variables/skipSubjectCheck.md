# Variable: ~~skipSubjectCheck~~

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• `const` **skipSubjectCheck**: *typeof* `oauth.skipSubjectCheck` = `oauth.skipSubjectCheck`

DANGER ZONE - This option has security implications that must be understood,
assessed for applicability, and accepted before use.

Use this as a value to [fetchUserInfo](../functions/fetchUserInfo.md) `expectedSubject` parameter to
skip the `sub` claim value check.

## Deprecated

Marked as deprecated only to make it stand out as something you
  shouldn't use unless you've assessed the implications.

## See

[OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#UserInfoResponse)
