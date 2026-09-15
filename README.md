# Clorio wallet | A Mina Protocol wallet

<p align="center"> 
<img height="300" src="https://clor.io/index_files/meta.png">
</p>

## Introduction

Clorio is a full-stack wallet for Mina Protocol. It is built with Typescript, communicates with the backend through network-aware REST APIs, and is offered in three versions. Hosted wallet on https://clor.io, the desktop builds compiled by Electron and Mobile.

## Hosted wallet

You can try the hosted version of Clorio wallet on [mainnet](https://mainnet.clor.io) or [devnet](https://devnet.clor.io).

## User docs

User docs are available on https://docs.clor.io/

## Support

You can get support on [Discord](https://discord.gg/XakPRT3SCY). For security disclosures please get in touch privately on Discord with carbonara#5880.

## Bugs & Issues

Please open an issue on Github.

## Linux desktop packages

Docker Desktop is required on macOS. Build native Linux packages for both
64-bit Intel/AMD and ARM machines with:

```bash
yarn compile:linux:docker
```

The command writes architecture-labelled AppImage and Debian packages under
`release/linux/x64` and `release/linux/arm64`, then verifies their CPU type and
the Debian sandbox installation hooks.

Build the native Apple Silicon DMG on macOS with:

```bash
yarn compile:mac
```

The macOS artifacts are always written under `release/mac`.

The Debian package is recommended on Ubuntu 24.04 and newer: installation sets
the Chromium sandbox helper permissions and installs the AppArmor user-namespace
profile required by those releases. AppImage remains portable and keeps the
Chromium sandbox enabled, but on distributions that block unprivileged user
namespaces (notably Ubuntu 24.04+) it requires a suitable administrator-provided
AppArmor profile. Do not work around that restriction with `--no-sandbox` in
production.

## License

Copyright 2021-2024 WeStake.Club.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. Furthermore you may not remove attributions of WeStake.Club or Carbonara.

~Clorio is a wallet offered by [WeStake.Club⚡️](https://mina.westake.club) and is not developed by O(1)Labs.
