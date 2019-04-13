import {expect, test} from '@oclif/test'

describe('telemetry', () => {
  test
    .stdout()
    .command(['telemetry'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['telemetry', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
