import * as crypto from 'node:crypto'
import { promisify } from 'node:util'

import * as puppeteer from 'puppeteer-core'
import { getChromePath } from 'chrome-launcher'
import Provider from 'oidc-provider'
import raw from 'raw-body'

import koaCors from '@koa/cors'

const generateKeyPair = promisify(crypto.generateKeyPair)

const es256 = await generateKeyPair('ec', { namedCurve: 'P-256' })

const jwks = {
  keys: [{ ...es256.privateKey.export({ format: 'jwk' }), alg: 'ES256' }],
}

const provider = new Provider('http://localhost:3000', {
  jwks,
  clientBasedCORS: () => true,
  features: {
    dPoP: {
      enabled: true,
      nonceSecret: crypto.randomBytes(32),
      requireNonce: () => true,
    },
    introspection: { enabled: true },
    encryption: { enabled: true },
    revocation: { enabled: true },
    clientCredentials: { enabled: true },
    registration: { enabled: true },
    deviceFlow: { enabled: true },
    jwtIntrospection: { enabled: true },
    jwtResponseModes: { enabled: true },
    jwtUserinfo: { enabled: true },
    pushedAuthorizationRequests: { enabled: true },
    resourceIndicators: {
      enabled: true,
      getResourceServerInfo: (ctx, resource) => ({
        scope: 'api:write',
        ...(resource.includes('jwt')
          ? {
              accessTokenFormat: 'jwt',
              jwt: { sign: { alg: 'ES256' } },
            }
          : { accessTokenFormat: 'opaque' }),
      }),
      useGrantedResource: () => true,
    },
    requestObjects: {
      mode: 'strict',
      request: true,
    },
    userinfo: { enabled: true },
    mTLS: {
      enabled: true,
      certificateBoundAccessTokens: true,
      selfSignedTlsClientAuth: true,
    },
  },
  pkce: { required: () => true },
  clientAuthMethods: [
    'client_secret_basic',
    'client_secret_post',
    'client_secret_jwt',
    'private_key_jwt',
    'none',
    'self_signed_tls_client_auth',
  ],
})

const { invalidate: orig } = provider.Client.Schema.prototype

provider.Client.Schema.prototype.invalidate = function invalidate(
  message,
  code,
) {
  if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
    return
  }

  orig.call(this, message)
}

const cors = koaCors()
provider.use((ctx, next) => {
  if (ctx.URL.pathname === '/drive' || ctx.URL.pathname === '/reg') {
    return cors(ctx, next)
  }

  return next()
})

provider.use(async (ctx, next) => {
  if (ctx.URL.pathname === '/drive' && ctx.method === 'POST') {
    let browser
    try {
      const body = await raw(ctx.req, {
        length: ctx.request.length,
        encoding: ctx.charset,
      })
      const params = new URLSearchParams(body.toString())
      const target = params.get('goto')

      console.log('\n\n=====')
      console.log('starting user interaction on', target)

      browser = await puppeteer.launch({
        executablePath: getChromePath(),
        headless: 'new',
      })

      const s = '[type="submit"]'

      const page = await browser.newPage()
      await Promise.all([
        page.goto(target),
        page.waitForSelector(s),
        page.waitForNetworkIdle({ idleTime: 100 }),
      ])

      let pending = true
      let deviceFlow
      let destination
      while (pending) {
        let title
        try {
          title = await page.title()
        } catch {
          continue
        }
        switch (title) {
          case 'Device Login Confirmation':
            deviceFlow = true
            await Promise.all([
              page.click(s),
              page.waitForFunction('document.title === "Sign-in"'),
              page.waitForNetworkIdle({ idleTime: 100 }),
            ])
            break
          case 'Sign-in':
            await page.type('[name="login"]', 'user')
            await page.type('[name="password"]', 'pass')
            await Promise.all([
              page.click(s),
              page.waitForFunction('document.title === "Consent"'),
              page.waitForNetworkIdle({ idleTime: 100 }),
            ])
            break
          case 'Consent':
            await Promise.all([
              page.click(s),
              page.waitForNetworkIdle({ idleTime: 100 }),
            ])
            pending = false
            destination = deviceFlow ? '/device/' : '/cb'
            break
          default:
            throw new Error(title)
        }
      }

      while (page.url().includes(destination) === false) {
        await page.waitForNetworkIdle({ idleTime: 100 })
      }

      ctx.body = page.url()
      console.log('done on title:', await page.title(), 'url:', ctx.body)
      console.log('=====\n\n')
    } finally {
      await browser?.close()
    }
  } else if (ctx.URL.pathname === '/cb') {
    ctx.body = ctx.URL.href
  } else {
    await next()
    if (typeof ctx.body === 'string' && ctx.body.includes('Continue')) {
      ctx.body = ctx.body.replace(
        '<title>Sign-in</title>',
        '<title>Consent</title>',
      )
    }
    if (ctx.body?.verification_uri_complete) {
      ctx.body.interval = 0.1
    }
  }
})

provider.listen(3000)
