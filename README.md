[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-xgo.svg?style=flat-square)](https://github.com/crazy-max/ghaction-xgo/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-golang--cgo--cross--compiler-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/golang-cgo-cross-compiler)
[![Test workflow](https://img.shields.io/github/workflow/status/crazy-max/ghaction-xgo/test?label=test&logo=github&style=flat-square)](https://github.com/crazy-max/ghaction-xgo/actions?workflow=test)
[![Codecov](https://img.shields.io/codecov/c/github/crazy-max/ghaction-xgo?logo=codecov&style=flat-square)](https://codecov.io/gh/crazy-max/ghaction-xgo)
[![Become a sponsor](https://img.shields.io/badge/sponsor-crazy--max-181717.svg?logo=github&style=flat-square)](https://github.com/sponsors/crazy-max)
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## About

A GitHub Action for [xgo](https://github.com/crazy-max/xgo), a Golang CGO cross compiler.

If you are interested, [check out](https://git.io/Je09Y) my other :octocat: GitHub Actions!

___

* [Usage](#usage)
* [Customizing](#customizing)
  * [inputs](#inputs)
* [Keep up-to-date with GitHub Dependabot](#keep-up-to-date-with-github-dependabot)
* [How can I help?](#how-can-i-help)
* [License](#license)

## Usage

```yaml
name: build

on:
  pull_request:
  push:

jobs:
  xgo:
    strategy:
      fail-fast: false
      matrix:
        go_version:
          - 1.12.4
          - 1.13.x
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v2
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
          race: false
          ldflags: -s -w
          buildmode: default
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name            | Type    | Description                                                                                                                      |
|-----------------|---------|----------------------------------------------------------------------------------------------------------------------------------|
| `xgo_version`   | String  | xgo version. Eg. `v0.3.2` (default `latest`)                                                                                     |
| `go_version`    | String  | Go release to use for cross compilation from those [docker tags](https://hub.docker.com/r/crazymax/xgo/tags/). Eg. `1.12.x` (default `latest`) |
| `dest`          | String  | Destination folder to put binaries in (default `build`)                                                                          |
| `pkg`           | String  | Sub-package to build if not root import                                                                                          |
| `prefix`        | String  | Prefix to use for output naming. Default to package name                                                                         |
| `targets`       | String  | Comma separated targets to build for. Eg. `windows/amd64,linux/386` (default `*/*`)                                              |
| `v`             | Bool    | Prints the names of packages as they are compiled (default `false`)                                                              |
| `x`             | Bool    | Prints the build commands as compilation progresses (default `false`)                                                            |
| `race`          | Bool    | Enable data race detection (supported only on amd64) (default `false`)                                                           |
| `tags`          | String  | Comma separated list of build tags to consider satisfied during the build                                                        |
| `ldflags`       | String  | Arguments to pass on each go tool link invocation                                                                                |
| `buildmode`     | String  | Indicates which kind of object file to build (default `default`)                                                                 |
| `root_path`     | String  | Root import path to build (default `$GITHUB_WORKSPACE`)                                                                          |

## Limitation

This action is only available for Linux [virtual environments](https://help.github.com/en/articles/virtual-environments-for-github-actions#supported-virtual-environments-and-hardware-resources).

## Keep up-to-date with GitHub Dependabot

Since [Dependabot](https://docs.github.com/en/github/administering-a-repository/keeping-your-actions-up-to-date-with-github-dependabot)
has [native GitHub Actions support](https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates#package-ecosystem),
to enable it on your GitHub repo all you need to do is add the `.github/dependabot.yml` file:

```yaml
version: 2
updates:
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
```

## How can I help?

All kinds of contributions are welcome :raised_hands:! The most basic way to show your support is to star :star2:
the project, or to raise issues :speech_balloon: You can also support this project by
[**becoming a sponsor on GitHub**](https://github.com/sponsors/crazy-max) :clap: or by making a
[Paypal donation](https://www.paypal.me/crazyws) to ensure this journey continues indefinitely! :rocket:

Thanks again for your support, it is much appreciated! :pray:

## License

MIT. See `LICENSE` for more details.
