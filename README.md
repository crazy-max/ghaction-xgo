[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-xgo.svg?style=flat-square)](https://github.com/crazy-max/ghaction-xgo/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-golang--cgo--cross--compiler-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/golang-cgo-cross-compiler)
[![Release workflow](https://github.com/crazy-max/ghaction-xgo/workflows/release/badge.svg)](https://github.com/crazy-max/ghaction-xgo/actions?workflow=release)
[![Test workflow](https://github.com/crazy-max/ghaction-xgo/workflows/test/badge.svg)](https://github.com/crazy-max/ghaction-xgo/actions?workflow=test)
[![Support me on Patreon](https://img.shields.io/badge/donate-patreon-f96854.svg?logo=patreon&style=flat-square)](https://www.patreon.com/crazymax) 
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## ✨ About

A GitHub Action for [xgo](https://github.com/crazy-max/xgo), a Golang CGO cross compiler.

> **:warning: Note:** To use this action, you must have access to the [GitHub Actions](https://github.com/features/actions) feature. GitHub Actions are currently only available in public beta. You can [apply for the GitHub Actions beta here](https://github.com/features/actions/signup/).

## 🚀 Usage

Below is a simple snippet to cross compile your Golang app. A [live example](https://github.com/crazy-max/ghaction-xgo/actions) is also available for this repository.

```yaml
name: build

on:
  pull_request:
  push:

jobs:
  xgo:
    strategy:
      matrix:
        go_version:
          - 1.12.4
          - 1.13.x
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@master
      -
        name: Build with xgo
        uses: crazy-max/ghaction-xgo@v1
        with:
          xgo_version: latest
          go_version: ${{ matrix.go_version }}
          dest: build
          prefix: myapp
          targets: windows/386,windows/amd64,linux/386,linux/amd64,darwin/386,darwin/amd64
          v: true
          x: false
          ldflags: -s -w
```

## 💅 Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name            | Type    | Default              | Description                                                                                                                      |
|-----------------|---------|----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `xgo_version`   | String  | `latest`             | xgo version. Example: `v0.3.2`                                                                                                   |
| `go_version`    | String  | `latest`             | Go release to use for cross compilation from those [docker tags](https://hub.docker.com/r/crazymax/xgo/tags/). Example: `1.12.x` |
| `dest`          | String  | `build`              | Destination folder to put binaries in                                                                                            |
| `pkg`           | String  |                      | Sub-package to build if not root import                                                                                          |
| `prefix`        | String  |                      | Prefix to use for output naming. Default to package name                                                                         |
| `targets`       | String  | `*/*`                | Comma separated targets to build for. Example: `windows/amd64,linux/386`                                                         |
| `v`             | Bool    | `false`              | Prints the names of packages as they are compiled                                                                                |
| `x`             | Bool    | `false`              | Prints the build commands as compilation progresses                                                                              |
| `ldflags`       | String  |                      | Arguments to pass on each go tool link invocation                                                                                |

## :warning: Limitation

This action is only available for Linux [virtual environments](https://help.github.com/en/articles/virtual-environments-for-github-actions#supported-virtual-environments-and-hardware-resources).

## 🤝 How can I help ?

All kinds of contributions are welcome :raised_hands:!<br />
The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon:<br />
But we're not gonna lie to each other, I'd rather you buy me a beer or two :beers:!

[![Support me on Patreon](.res/patreon.png)](https://www.patreon.com/crazymax) 
[![Paypal Donate](.res/paypal.png)](https://www.paypal.me/crazyws)

## 📝 License

MIT. See `LICENSE` for more details.
