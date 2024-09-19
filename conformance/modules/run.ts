import * as runner from '../runner.js'

export default function pass(metaUrl: string, options?: runner.MacroOptions) {
  for (const module of runner.modules(metaUrl)) {
    runner.test.serial(runner.flow(options), module)
  }
}

export function skippable(metaUrl: string, options?: runner.MacroOptions) {
  for (const module of runner.modules(metaUrl)) {
    runner.test.serial(runner.skippable(runner.flow(options)), module)
  }
}

export function rejects(
  metaUrl: string,
  expected: runner.CodeErrorAssertion | runner.NameErrorAssertion,
  cause?: runner.CodeErrorAssertion | runner.NameErrorAssertion,
  options?: runner.MacroOptions,
) {
  for (const module of runner.modules(metaUrl)) {
    runner.test.serial(
      runner.rejects(runner.flow(options)),
      module,
      expected,
      cause,
    )
  }
}
