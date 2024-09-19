# openid-client API Reference

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## You are probably looking for this

- [authorizationCodeGrant](functions/authorizationCodeGrant.md)
- [buildAuthorizationUrl](functions/buildAuthorizationUrl.md)
- [ClientMetadata](interfaces/ClientMetadata.md)
- [discovery](functions/discovery.md)
- [ServerMetadata](interfaces/ServerMetadata.md)

## Configuration

- [Configuration](classes/Configuration.md)
- [discovery](functions/discovery.md)

## Grants

- [authorizationCodeGrant](functions/authorizationCodeGrant.md)
- [clientCredentialsGrant](functions/clientCredentialsGrant.md)
- [genericGrantRequest](functions/genericGrantRequest.md)
- [initiateDeviceAuthorization](functions/initiateDeviceAuthorization.md)
- [pollDeviceAuthorizationGrant](functions/pollDeviceAuthorizationGrant.md)
- [refreshTokenGrant](functions/refreshTokenGrant.md)

## Advanced Configuration

- [allowInsecureRequests](functions/allowInsecureRequests.md)
- [enableDecryptingResponses](functions/enableDecryptingResponses.md)
- [enableDetachedSignatureResponseChecks](functions/enableDetachedSignatureResponseChecks.md)
- [enableNonRepudiationChecks](functions/enableNonRepudiationChecks.md)
- [useCodeIdTokenResponseType](functions/useCodeIdTokenResponseType.md)
- [useJwtResponseMode](functions/useJwtResponseMode.md)

## Client Authentication Methods

- [ClientSecretBasic](functions/ClientSecretBasic.md)
- [ClientSecretJwt](functions/ClientSecretJwt.md)
- [ClientSecretPost](functions/ClientSecretPost.md)
- [None](functions/None.md)
- [PrivateKeyJwt](functions/PrivateKeyJwt.md)
- [TlsClientAuth](functions/TlsClientAuth.md)

## Errors

- [AuthorizationResponseError](classes/AuthorizationResponseError.md)
- [ClientError](classes/ClientError.md)
- [ResponseBodyError](classes/ResponseBodyError.md)
- [WWWAuthenticateChallengeError](classes/WWWAuthenticateChallengeError.md)

## Authorization Request

- [buildAuthorizationUrl](functions/buildAuthorizationUrl.md)
- [buildAuthorizationUrlWithJAR](functions/buildAuthorizationUrlWithJAR.md)
- [buildAuthorizationUrlWithPAR](functions/buildAuthorizationUrlWithPAR.md)
- [calculatePKCECodeChallenge](functions/calculatePKCECodeChallenge.md)
- [randomNonce](functions/randomNonce.md)
- [randomState](functions/randomState.md)

## DPoP

- [getDPoPHandle](functions/getDPoPHandle.md)
- [randomDPoPKeyPair](functions/randomDPoPKeyPair.md)

## OpenID Connect 1.0

- [authorizationCodeGrant](functions/authorizationCodeGrant.md)
- [buildEndSessionUrl](functions/buildEndSessionUrl.md)
- [discovery](functions/discovery.md)
- [fetchUserInfo](functions/fetchUserInfo.md)

## PKCE

- [authorizationCodeGrant](functions/authorizationCodeGrant.md)
- [calculatePKCECodeChallenge](functions/calculatePKCECodeChallenge.md)
- [randomPKCECodeVerifier](functions/randomPKCECodeVerifier.md)

## Protected Resource Requests

- [fetchProtectedResource](functions/fetchProtectedResource.md)
- [fetchUserInfo](functions/fetchUserInfo.md)

## Token Management

- [tokenIntrospection](functions/tokenIntrospection.md)
- [tokenRevocation](functions/tokenRevocation.md)

## Interfaces

- [AuthorizationCodeGrantChecks](interfaces/AuthorizationCodeGrantChecks.md)
- [AuthorizationCodeGrantOptions](interfaces/AuthorizationCodeGrantOptions.md)
- [AuthorizationDetails](interfaces/AuthorizationDetails.md)
- [ConfigurationMethods](interfaces/ConfigurationMethods.md)
- [ConfigurationProperties](interfaces/ConfigurationProperties.md)
- [ConfirmationClaims](interfaces/ConfirmationClaims.md)
- [CryptoKeyPair](interfaces/CryptoKeyPair.md)
- [DeviceAuthorizationResponse](interfaces/DeviceAuthorizationResponse.md)
- [DeviceAutorizationGrantPollOptions](interfaces/DeviceAutorizationGrantPollOptions.md)
- [DiscoveryRequestOptions](interfaces/DiscoveryRequestOptions.md)
- [DPoPHandle](interfaces/DPoPHandle.md)
- [DPoPOptions](interfaces/DPoPOptions.md)
- [GenerateKeyPairOptions](interfaces/GenerateKeyPairOptions.md)
- [IDToken](interfaces/IDToken.md)
- [IntrospectionResponse](interfaces/IntrospectionResponse.md)
- [ModifyAssertionFunction](interfaces/ModifyAssertionFunction.md)
- [ModifyAssertionOptions](interfaces/ModifyAssertionOptions.md)
- [MTLSEndpointAliases](interfaces/MTLSEndpointAliases.md)
- [PrivateKey](interfaces/PrivateKey.md)
- [TokenEndpointResponse](interfaces/TokenEndpointResponse.md)
- [TokenEndpointResponseHelpers](interfaces/TokenEndpointResponseHelpers.md)
- [UserInfoAddress](interfaces/UserInfoAddress.md)
- [UserInfoResponse](interfaces/UserInfoResponse.md)
- [WWWAuthenticateChallenge](interfaces/WWWAuthenticateChallenge.md)
- [WWWAuthenticateChallengeParameters](interfaces/WWWAuthenticateChallengeParameters.md)

## Type Aliases

- [ClientAuth](type-aliases/ClientAuth.md)
- [CustomFetch](type-aliases/CustomFetch.md)
- [FetchBody](type-aliases/FetchBody.md)
- [JsonArray](type-aliases/JsonArray.md)
- [JsonObject](type-aliases/JsonObject.md)
- [JsonPrimitive](type-aliases/JsonPrimitive.md)
- [JsonValue](type-aliases/JsonValue.md)
- [JWSAlgorithm](type-aliases/JWSAlgorithm.md)

## Variables

- [clockSkew](variables/clockSkew.md)
- [clockTolerance](variables/clockTolerance.md)
- [customFetch](variables/customFetch.md)
- [modifyAssertion](variables/modifyAssertion.md)
- [skipStateCheck](variables/skipStateCheck.md)
- [skipSubjectCheck](variables/skipSubjectCheck.md)
