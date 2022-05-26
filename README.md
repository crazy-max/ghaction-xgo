[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-xgo.svg?style=flat-square)](https://github.com/crazy-max/ghaction-xgo/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-golang--cgo--cross--compiler-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/golang-cgo-cross-compiler)
[![Test workflow](https://img.shields.io/github/workflow/status/crazy-max/ghaction-xgo/test?label=test&logo=github&style=flat-square)](https://github.com/crazy-max/ghaction-xgo/actions?workflow=test)
[![Codecov](https://img.shields.io/codecov/c/github/crazy-max/ghaction-xgo?logo=codecov&style=flat-square)](https://codecov.io/gh/crazy-max/ghaction-xgo)
[![Become a sponsor](https://img.shields.io/badge/sponsor-crazy--max-181717.svg?logo=github&style=flat-square)](https://github.com/sponsors/crazy-max)
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## About

A GitHub Action for [xgo](https://github.com/crazy-max/xgo), a Golang CGO cross-compiler.

If you are interested, [check out](https://git.io/Je09Y) my other :octocat: GitHub Actions!

___

* [Usage](#usage)
* [Customizing](#customizing)
  * [inputs](#inputs)
* [Contributing](#contributing)
* [License](#license)

## Usage

```yaml
name: build

on:
  push:
  pull_request:

jobs:
  xgo:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v3
      -
        name: Build
        uses: crazy-max/ghaction-xgo@v2
        with:
          xgo_version: latest
          go_version: 1.18
          dest: build
          prefix: myapp
          targets: windows/amd64,linux/amd64,linux/arm64,darwin/arm64
          v: true
          x: false
          race: false
          ldflags: -s -w
          buildmode: default
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name          | Type    | Default             | Description                                                                                                                  |
|---------------|---------|---------------------|------------------------------------------------------------------------------------------------------------------------------|
| `xgo_version` | String  | `latest`            | xgo version (e.g., `v0.3.2`)                                                                                                 |
| `go_version`  | String  | `latest`            | Go release to use for cross compilation from those [docker tags](https://hub.docker.com/r/crazymax/xgo/tags/) (e.g., `1.17`) |
| `dest`        | String  | `build`             | Destination folder to put binaries in                                                                                        |
| `pkg`         | String  |                     | Sub-package to build if not root import                                                                                      |
| `prefix`      | String  | _package name_      | Prefix to use for output naming                                                                                              |
| `targets`     | String  | `*/*`               | Comma separated targets to build for (e.g. `windows/amd64,linux/386`)                                                        |
| `v`           | Bool    | `false`             | Prints the names of packages as they are compiled                                                                            |
| `x`           | Bool    | `false`             | Prints the build commands as compilation progresses                                                                          |
| `race`        | Bool    | `false`             | Enable data race detection                                                                                                   |
| `tags`        | String  |                     | Comma separated list of build tags to consider satisfied during the build                                                    |
| `ldflags`     | String  |                     | Arguments to pass on each go tool link invocation                                                                            |
| `buildmode`   | String  | `default`           | Indicates which kind of object file to build                                                                                 |
| `buildvcs`    | String  |                     | Whether to stamp binaries with version control information                                                                   |
| `working_dir` | String  | `$GITHUB_WORKSPACE` | Working directory                                                                                                            |

## Limitation

This action is only available for Linux [virtual environments](https://help.github.com/en/articles/virtual-environments-for-github-actions#supported-virtual-environments-and-hardware-resources).

## Contributing

Want to contribute? Awesome! The most basic way to show your support is to star the project, or to raise issues. If
you want to open a pull request, please read the [contributing guidelines](.github/CONTRIBUTING.md).

You can also support this project by [**becoming a sponsor on GitHub**](https://github.com/sponsors/crazy-max) or by
making a [Paypal donation](https://www.paypal.me/crazyws) to ensure this journey continues indefinitely!

Thanks again for your support, it is much appreciated! :pray:

## License

MIT. See `LICENSE` for more details.
