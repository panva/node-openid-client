import * as client from 'openid-client'

// Prerequisites

let getCurrentUrl!: (...args: any) => URL
let server!: URL // Authorization server's Issuer Identifier URL
let clientId!: string
let clientSecret!: string
/**
 * Value used in the authorization request as redirect_uri pre-registered at the
 * Authorization Server.
 */
let redirect_uri!: string

// End of prerequisites

const config = await client.discovery(server, clientId, clientSecret)

const code_challenge_method = 'S256'
/**
 * The following MUST be generated for every redirect to the
 * authorization_endpoint. You must store the code_verifier and nonce in the
 * end-user session such that it can be recovered as the user gets redirected
 * from the authorization server back to your application.
 */
const code_verifier = client.randomPKCECodeVerifier()
const code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
let nonce!: string

{
  // redirect user to as.authorization_endpoint
  const parameters: Record<string, string> = {
    redirect_uri,
    scope: 'openid email',
    code_challenge,
    code_challenge_method,
  }

  /**
   * We cannot be sure the AS supports PKCE so we're going to use state too. Use
   * of PKCE is backwards compatible even if the AS doesn't support it which is
   * why we're using it regardless.
   */
  if (
    config
      .serverMetadata()
      .code_challenge_methods_supported?.includes('S256') !== true
  ) {
    nonce = client.randomNonce()
    parameters.nonce = nonce
  }

  const redirectTo = client.buildAuthorizationUrl(config, parameters)

  console.log('redirecting to', redirectTo.href)
  // now redirect the user to redirectTo.href
}

// one eternity later, the user lands back on the redirect_uri
// Authorization Code Grant
let sub: string
let access_token: string
{
  const currentUrl: URL = getCurrentUrl()
  const tokens = await client.authorizationCodeGrant(config, currentUrl, {
    pkceCodeVerifier: code_verifier,
    expectedNonce: nonce,
    idTokenExpected: true,
  })

  console.log('Token Endpoint Response', tokens)
  ;({ access_token } = tokens)
  const claims = tokens.claims()!
  console.log('ID Token Claims', claims)
  ;({ sub } = claims)
}

// UserInfo Request
{
  const userInfo = await client.fetchUserInfo(config, access_token, sub)

  console.log('UserInfo Response', userInfo)
}
