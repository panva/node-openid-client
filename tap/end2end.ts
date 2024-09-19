import type QUnit from 'qunit'

import { setup, random } from './helper.js'
import * as lib from '../src/index.js'
import * as jose from 'jose'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('end2end.ts')

  const alg = 'ES256'

  const options = (
    ...flags: Array<
      | 'jarm'
      | 'par'
      | 'jar'
      | 'dpop'
      | 'jwtUserinfo'
      | 'hybrid'
      | 'encryption'
      | 'login'
    >
  ) => {
    const conf = {
      jarm: false,
      par: false,
      jar: false,
      dpop: false,
      jwtUserinfo: false,
      hybrid: false,
      login: false,
      encryption: false,
    }
    for (const flag of flags) {
      conf[flag] = true
    }
    return conf
  }

  const testCases = [
    options(),
    options('par'),
    options('jar'),
    options('dpop'),
    options('par', 'jar'),
    options('par', 'dpop'),
    options('encryption'),
    options('jarm'),
    options('jarm', 'encryption'),
    options('jwtUserinfo'),
    options('jwtUserinfo', 'encryption'),
    options('hybrid'),
    options('hybrid', 'encryption'),
  ]

  for (const config of testCases) {
    const { jarm, par, jar, dpop, jwtUserinfo, hybrid, encryption } = config

    function label(config: Record<string, boolean>) {
      const keys = Object.keys(
        Object.fromEntries(
          Object.entries(config).filter(([, v]) => v === true),
        ),
      )
      let msg = `w/ response_type=${hybrid ? 'code id_token' : 'code'}`
      return keys.length ? `${msg}, ${keys.join(', ')}` : msg
    }

    test(`end-to-end ${label(config)}`, async (t) => {
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
        'client_secret_post',
        jar,
        jwtUserinfo,
        false,
        hybrid
          ? ['implicit', 'authorization_code', 'refresh_token']
          : ['authorization_code', 'refresh_token'],
        encryption,
      )

      const execute: Array<(config: lib.Configuration) => void> = [
        lib.enableNonRepudiationChecks,
        lib.allowInsecureRequests,
      ]

      if (jarm) {
        execute.push(lib.useJwtResponseMode)
      }
      if (hybrid) {
        execute.push(lib.useCodeIdTokenResponseType)
      }

      const client = await lib.discovery(
        issuerIdentifier,
        metadata.client_id,
        metadata,
        undefined,
        { execute },
      )

      if (encryption) {
        lib.enableDecryptingResponses(client, clientDecryptionKey)
      }

      const DPoP = dpop
        ? lib.getDPoPHandle(client, await lib.randomDPoPKeyPair(alg))
        : undefined

      let params = new URLSearchParams()

      const code_verifier = lib.randomPKCECodeVerifier()
      const code_challenge = await lib.calculatePKCECodeChallenge(code_verifier)
      const code_challenge_method = 'S256'
      params.set('code_challenge', code_challenge)
      params.set('code_challenge_method', code_challenge_method)

      const maxAge = random() ? 30 : undefined

      let nonce: string | undefined
      if (hybrid) {
        nonce = lib.randomNonce()
        params.set('nonce', nonce)
      }

      params.set('redirect_uri', 'http://localhost:3000/cb')
      params.set('scope', 'openid offline_access')
      params.set('prompt', 'consent')

      if (maxAge !== undefined) {
        params.set('max_age', maxAge.toString())
      }

      let authorizationUrl: URL
      if (jar && par) {
        authorizationUrl = await lib.buildAuthorizationUrlWithJAR(
          client,
          params,
          clientSigningKey,
        )
        authorizationUrl = await lib.buildAuthorizationUrlWithPAR(
          client,
          authorizationUrl.searchParams,
          { DPoP },
        )
      } else if (par) {
        authorizationUrl = await lib.buildAuthorizationUrlWithPAR(
          client,
          params,
        )
      } else {
        authorizationUrl = lib.buildAuthorizationUrl(client, params)
      }

      let currentUrl: URL
      {
        currentUrl = new URL(
          await fetch('http://localhost:3000/drive', {
            method: 'POST',
            body: new URLSearchParams({
              goto: authorizationUrl.href,
            }),
          }).then((r) => r.text()),
        )
      }

      const response = await lib.authorizationCodeGrant(
        client,
        currentUrl,
        {
          expectedNonce: nonce,
          pkceCodeVerifier: code_verifier,
        },
        undefined,
        { DPoP },
      )

      await lib.fetchUserInfo(
        client,
        response.access_token,
        response.claims()?.sub!,
        {
          DPoP,
        },
      )

      await lib.refreshTokenGrant(client, response.refresh_token!, undefined, {
        DPoP,
      })

      t.ok(1)
    })
  }
}
