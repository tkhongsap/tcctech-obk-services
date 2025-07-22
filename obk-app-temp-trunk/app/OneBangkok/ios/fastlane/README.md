fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios alpha

```sh
[bundle exec] fastlane ios alpha
```

Push an alpha build to App Distribution

### ios bump

```sh
[bundle exec] fastlane ios bump
```

Push an bump build to App Distribution

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Push a new beta build to TestFlight

### ios sit

```sh
[bundle exec] fastlane ios sit
```

Push an SIT build to App Distribution

### ios build_uat

```sh
[bundle exec] fastlane ios build_uat
```

Build IPA UAT

### ios build_prod

```sh
[bundle exec] fastlane ios build_prod
```

Build IPA PROD

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
