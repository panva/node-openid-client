export default {
  extensions: {
    ts: 'module',
    mjs: true,
  },
  files: ['test/**/*.ts', '!test/**/_*.ts'],
  workerThreads: false,
  nodeArguments: ['--enable-source-maps'],
}
