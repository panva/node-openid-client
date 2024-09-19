import * as lib from '../src/index.js'
import * as jose from 'jose'

export function random() {
  return Math.random() < 0.5
}

export async function setup(
  kp: CryptoKeyPair,
  authMethod: string,
  jar: boolean,
  jwtUserinfo: boolean,
  jwtIntrospection: boolean,
  grantTypes: string[],
  encryption: boolean,
): Promise<{
  metadata: lib.ClientMetadata
  issuerIdentifier: URL
  clientSigningKey: lib.PrivateKey
  clientDecryptionKey: lib.PrivateKey
}> {
  const clientKeyPair = kp
  const jwk = await jose.exportJWK(clientKeyPair.publicKey)
  const alg = 'ES256'
  const clientJwk = {
    ...jwk,
    alg,
    use: 'sig',
    kid: await jose.calculateJwkThumbprint(jwk),
    key_ops: undefined,
    ext: undefined,
  }

  let encKp: lib.CryptoKeyPair
  let encAlg: string
  const algorithm = ['RSA-OAEP', 'RSA-OAEP-256', 'P-256', 'X25519'][
    Math.floor(Math.random() * 3)
  ]
  switch (algorithm) {
    case 'RSA-OAEP':
      encAlg = 'RSA-OAEP'
      encKp = await jose.generateKeyPair('RSA-OAEP', {
        modulusLength: 2048,
      })
      break
    case 'RSA-OAEP-256':
      encAlg = 'RSA-OAEP-256'
      encKp = await jose.generateKeyPair('RSA-OAEP-256', {
        modulusLength: 2048,
      })
      break
    case 'P-256':
      encAlg = 'ECDH-ES'
      encKp = await jose.generateKeyPair('ECDH-ES', { crv: 'P-256' })
      break
    case 'X25519':
      encAlg = 'ECDH-ES'
      try {
        // not yet available in all browsers
        encKp = await jose.generateKeyPair('ECDH-ES', { crv: 'X25519' })
      } catch {
        encKp = await jose.generateKeyPair('ECDH-ES', { crv: 'P-256' })
      }
      break
    default:
      throw new Error('unreachable')
  }

  const encJwk = await jose.exportJWK(encKp.publicKey)
  const clientEncJwk = {
    ...encJwk,
    alg: encAlg,
    use: 'enc',
    kid: await jose.calculateJwkThumbprint(encJwk),
    key_ops: undefined,
    ext: undefined,
  }

  const authEndpoint =
    grantTypes.includes('authorization_code') || grantTypes.includes('implicit')

  const metadata = {
    token_endpoint_auth_method: authMethod,
    redirect_uris: <string[]>[],
    id_token_signed_response_alg: alg,
    request_object_signing_alg: jar ? alg : undefined,
    userinfo_signed_response_alg: jwtUserinfo ? alg : undefined,
    introspection_signed_response_alg: alg,
    authorization_signed_response_alg: alg,
    ...(encryption
      ? {
          authorization_encrypted_response_alg: encAlg,
          id_token_encrypted_response_alg: encAlg,
          userinfo_encrypted_response_alg: jwtUserinfo ? encAlg : undefined,
          introspection_encrypted_response_alg: jwtIntrospection
            ? encAlg
            : undefined,
        }
      : undefined),
    response_types: <string[]>[],
    require_auth_time: random(),
    default_max_age: random() ? 30 : undefined,
    grant_types: grantTypes,
    jwks: {
      keys: [
        authMethod === 'private_key_jwt' || jar ? clientJwk : undefined,
        encryption ? clientEncJwk : undefined,
      ].filter(Boolean),
    },
  }

  if (authEndpoint) {
    metadata.redirect_uris.push('http://localhost:3000/cb')
    if (grantTypes.includes('implicit')) {
      if (grantTypes.includes('authorization_code')) {
        metadata.response_types.push('code id_token')
      } else {
        metadata.response_types.push('id_token')
      }
    } else {
      metadata.response_types.push('code')
    }
  }

  let response = await fetch(new URL('http://localhost:3000/reg'), {
    method: 'POST',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    body: JSON.stringify(metadata),
  })

  if (response.status !== 201) {
    throw new Error(await response.text())
  }

  return {
    metadata: {
      ...(await response.json()),
      introspection_signed_response_alg: jwtIntrospection ? alg : undefined,
    },
    clientSigningKey: {
      kid: clientJwk.kid,
      key: clientKeyPair.privateKey,
    },
    clientDecryptionKey: {
      kid: clientEncJwk.kid,
      key: encKp.privateKey,
    },
    issuerIdentifier: new URL('http://localhost:3000'),
  }
}
