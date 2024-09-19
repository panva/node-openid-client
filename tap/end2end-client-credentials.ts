import type QUnit from 'qunit'
import * as jose from 'jose'

import { setup } from './helper.js'
import * as lib from '../src/index.js'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('end2end-client-credentials.ts')

  const alg = 'ES256'

  const authMethodOptions: string[] = [
    'client_secret_basic',
    'client_secret_post',
    'private_key_jwt',
    'client_secret_jwt',
    'none',
  ]

  const options = (
    authMethod: string,
    ...flags: Array<'dpop' | 'jwtIntrospection' | 'encryption'>
  ) => {
    const conf = {
      authMethod,
      dpop: false,
      jwtIntrospection: false,
      encryption: false,
    }
    for (const flag of flags) {
      conf[flag] = true
    }
    return conf
  }

  // - every auth method with all options off
  // - dpop alone
  // - jwtIntrospection alone
  // - jwtIntrospection & encryption
  const testCases = [
    ...authMethodOptions.map((authMethod) => options(authMethod)),
    options(authMethodOptions[0], 'dpop'),
    options(authMethodOptions[0], 'jwtIntrospection'),
    options(authMethodOptions[0], 'jwtIntrospection', 'encryption'),
  ]

  for (const config of testCases) {
    const { authMethod, dpop, jwtIntrospection, encryption } = config

    function label(config: Record<string, string | boolean>) {
      const keys = Object.keys(
        Object.fromEntries(
          Object.entries(config).filter(([, v]) => v === true),
        ),
      )
      return keys.length
        ? `${config.authMethod} w/ ${keys.join(', ')}`
        : config.authMethod
    }

    test(`end-to-end client auth, client credentials, introspection, revocation ${label(
      config,
    )}`, async (t) => {
      const kp = (await jose.generateKeyPair('ES256', {
        extractable: true,
      })) as lib.CryptoKeyPair
      const {
        metadata,
        issuerIdentifier,
        clientSigningKey,
        clientDecryptionKey,
      } = await setup(
        kp,
        authMethod,
        false,
        false,
        jwtIntrospection,
        ['client_credentials'],
        encryption,
      )

      let clientAuth: lib.ClientAuth | undefined

      if (authMethod === 'private_key_jwt') {
        clientAuth = lib.PrivateKeyJwt(clientSigningKey)
      } else if (authMethod === 'client_secret_jwt') {
        clientAuth = lib.ClientSecretJwt(metadata.client_secret as string)
      } else if (authMethod === 'client_secret_basic') {
        clientAuth = lib.ClientSecretBasic(metadata.client_secret as string)
      }

      const client = await lib.discovery(
        issuerIdentifier,
        metadata.client_id,
        metadata,
        clientAuth,
        {
          execute: [lib.allowInsecureRequests, lib.enableNonRepudiationChecks],
        },
      )

      if (encryption) {
        lib.enableDecryptingResponses(client, clientDecryptionKey)
      }

      const DPoP = dpop
        ? lib.getDPoPHandle(client, await lib.randomDPoPKeyPair(alg))
        : undefined

      const params = new URLSearchParams()
      const resource = 'urn:example:resource:opaque'
      params.set('resource', resource)
      params.set('scope', 'api:write')

      {
        const cc = await lib.clientCredentialsGrant(client, params, { DPoP })

        const { access_token, token_type } = cc
        t.equal(token_type, dpop ? 'dpop' : 'bearer')

        {
          const introspection = await lib.tokenIntrospection(
            client,
            access_token,
          )

          t.propContains(introspection, {
            active: true,
            scope: 'api:write',
            aud: resource,
            token_type: dpop ? 'DPoP' : 'Bearer',
          })
        }

        await lib.tokenRevocation(client, access_token)
      }

      t.ok(1)
    })
  }
}
