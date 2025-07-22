fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android beta

```sh
[bundle exec] fastlane android beta
```

Submit a new Beta Build to Firebase App Distribution

### android bump

```sh
[bundle exec] fastlane android bump
```

Submit a new Alpha Build to Firebase App Distribution

### android deploy

```sh
[bundle exec] fastlane android deploy
```

Deploy a new version to Google Play

### android sit

```sh
[bundle exec] fastlane android sit
```

Deploy a sit version to Firebase App Distribution

### android uat

```sh
[bundle exec] fastlane android uat
```

Deploy a uat version to Firebase App Distribution

### android build_uat

```sh
[bundle exec] fastlane android build_uat
```

Build AAB UAT

### android build_prod

```sh
[bundle exec] fastlane android build_prod
```

Build AAB PROD

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
