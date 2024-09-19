# Variable: ~~skipStateCheck~~

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• `const` **skipStateCheck**: *typeof* `oauth.skipStateCheck` = `oauth.skipStateCheck`

DANGER ZONE - This option has security implications that must be understood,
assessed for applicability, and accepted before use.

Use this as a value for `state` check state parameter options to skip the
`state` value check. This should only be done if the `state` parameter value
used is integrity protected (and its integrity and expiration is checked) and
bound to the browsing session. One such mechanism to do so is described in an
I-D
[draft-bradley-oauth-jwt-encoded-state-09](https://datatracker.ietf.org/doc/html/draft-bradley-oauth-jwt-encoded-state-09).

## Deprecated

Marked as deprecated only to make it stand out as something you
  shouldn't use unless you've assessed the implications.
