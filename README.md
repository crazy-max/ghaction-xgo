[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-xgo.svg?style=flat-square)](https://github.com/crazy-max/ghaction-xgo/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-golang--cgo--cross--compiler-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/golang-cgo-cross-compiler)
[![Release workflow](https://github.com/crazy-max/ghaction-xgo/workflows/release/badge.svg)](https://github.com/crazy-max/ghaction-xgo/actions?workflow=release)
[![Test workflow](https://github.com/crazy-max/ghaction-xgo/workflows/test/badge.svg)](https://github.com/crazy-max/ghaction-xgo/actions?workflow=test)
[![Become a sponsor](https://img.shields.io/badge/sponsor-crazy--max-181717.svg?logo=github&style=flat-square)](https://github.com/sponsors/crazy-max)
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## About

A GitHub Action for [xgo](https://github.com/crazy-max/xgo), a Golang CGO cross compiler.

If you are interested, [check out](https://git.io/Je09Y) my other :octocat: GitHub Actions!

## Usage

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
        uses: actions/checkout@v1
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

## Customizing

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

## Limitation

This action is only available for Linux [virtual environments](https://help.github.com/en/articles/virtual-environments-for-github-actions#supported-virtual-environments-and-hardware-resources).

## How can I help ?

All kinds of contributions are welcome :raised_hands:! The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon: You can also support this project by [**becoming a sponsor on GitHub**](https://github.com/sponsors/crazy-max) :clap: or by making a [Paypal donation](https://www.paypal.me/crazyws) to ensure this journey continues indefinitely! :rocket:

Thanks again for your support, it is much appreciated! :pray:

## License

MIT. See `LICENSE` for more details.
