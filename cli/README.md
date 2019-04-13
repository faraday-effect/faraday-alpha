uf
==

Faraday CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/uf.svg)](https://npmjs.org/package/uf)
[![Downloads/week](https://img.shields.io/npm/dw/uf.svg)](https://npmjs.org/package/uf)
[![License](https://img.shields.io/npm/l/uf.svg)](https://github.com/faraday-effect/faraday/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g uf
$ uf COMMAND
running command...
$ uf (-v|--version|version)
uf/0.0.0 darwin-x64 node-v10.15.1
$ uf --help [COMMAND]
USAGE
  $ uf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`uf hello [FILE]`](#uf-hello-file)
* [`uf help [COMMAND]`](#uf-help-command)
* [`uf telemetry [FILE]`](#uf-telemetry-file)

## `uf hello [FILE]`

describe the command here

```
USAGE
  $ uf hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ uf hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/faraday-effect/faraday/blob/v0.0.0/src/commands/hello.ts)_

## `uf help [COMMAND]`

display help for uf

```
USAGE
  $ uf help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `uf telemetry [FILE]`

describe the command here

```
USAGE
  $ uf telemetry [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/telemetry.ts](https://github.com/faraday-effect/faraday/blob/v0.0.0/src/commands/telemetry.ts)_
<!-- commandsstop -->
