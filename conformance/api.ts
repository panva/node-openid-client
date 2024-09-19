import * as fs from 'node:fs/promises'

const {
  SUITE_BASE_URL = 'https://www.certification.openid.net',
  SUITE_ACCESS_TOKEN,
} = process.env

export interface ModulePrescription {
  testModule: string
  variant: null | Record<string, string>
  skipLogTestFinished?: boolean
}

export interface Test {
  id: string
  name: string
  url: string
}

export interface ModuleInfo {
  status: string
  result: string
}

export interface Plan {
  id: string
  name: string
  modules: ModulePrescription[]
}

export interface PlanInfo {
  certificationProfileName: string | null
}

function url(pathname: string, search?: Record<string, string>) {
  const target = new URL(pathname, SUITE_BASE_URL)
  target.search = new URLSearchParams(search).toString()
  return target.href
}

function headers(headers?: Record<string, string>) {
  const result = new Headers({ ...headers })
  if (SUITE_ACCESS_TOKEN) {
    result.set('authorization', `bearer ${SUITE_ACCESS_TOKEN}`)
  }
  return result
}

export async function createTestPlan(
  planName: string,
  config: Record<string, unknown>,
  variant: Record<string, string>,
) {
  const response = await fetch(
    url('/api/plan', { planName, variant: JSON.stringify(variant) }),
    {
      method: 'POST',
      headers: headers({ 'content-type': 'application/json;charset=utf-8' }),
      body: JSON.stringify(config),
    },
  )

  if (response.status !== 201) {
    throw new Error(await response.text())
  }

  return <Plan>await response.json()
}

export async function getTestPlanInfo(plan: Plan) {
  const response = await fetch(url(`/api/plan/${plan.id}`), {
    headers: headers(),
  })

  if (response.status !== 200) {
    throw new Error(await response.text())
  }

  return <PlanInfo>await response.json()
}

export async function getTestExposed(
  test: Test,
): Promise<Record<string, string>> {
  const response = await fetch(url(`/api/runner/${test.id}`), {
    method: 'GET',
    headers: headers(),
  })

  if (response.status !== 200) {
    throw new Error(await response.text())
  }

  const { exposed = {} } = await response.json()

  return exposed
}

export async function createTestFromPlan(
  plan: Plan,
  module: ModulePrescription,
) {
  const search = { test: module.testModule, plan: plan.id }

  if (module.variant) {
    Object.assign(search, { variant: JSON.stringify(module.variant) })
  }

  const response = await fetch(url('/api/runner', search), {
    method: 'POST',
    headers: headers(),
  })

  if (response.status !== 201) {
    throw new Error(await response.text())
  }

  const test: Test = await response.json()

  await waitForState(test, { states: new Set(['WAITING']), results: new Set() })

  return test
}

async function getModuleInfo(module: Test) {
  const response = await fetch(url(`/api/info/${module.id}`), {
    headers: headers(),
  })

  if (response.status !== 200) {
    throw new Error(await response.text())
  }

  return <ModuleInfo>await response.json()
}

export async function downloadArtifact(plan: Plan) {
  const response = await fetch(url(`/api/plan/exporthtml/${plan.id}`), {
    headers: headers(),
  })

  await fs.writeFile(
    `${plan.id}.zip`,
    new Uint8Array(await response.arrayBuffer()),
    { flag: 'w' },
  )
}

export async function waitForState(
  test: Test,
  {
    interval = 150,
    timeout = 60_000,
    states = new Set(['FINISHED']),
    results = new Set(['REVIEW', 'PASSED', 'WARNING', 'SKIPPED']),
  } = {},
) {
  const timeoutAt = Date.now() + timeout

  do {
    const { status, result } = await getModuleInfo(test)
    if (states.has(status)) {
      if (results.size) {
        if (!status || !result) continue
        if (!results.has(result)) {
          throw new Error(`module id ${test.id} is ${status} but ${result}`)
        }
      } else {
        if (!status) continue
      }

      return [status, result]
    }

    if (status === 'INTERRUPTED') {
      throw new Error(`module id ${test.id} is ${status}`)
    }

    await new Promise((resolve) => setTimeout(resolve, interval))
  } while (Date.now() < timeoutAt)

  throw new Error(
    `Timed out waiting for test module ${test.id} to be in one of states: ${[
      ...states,
    ].join(', ')}`,
  )
}
