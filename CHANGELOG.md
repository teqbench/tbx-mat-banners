# Changelog

## [0.9.0](https://github.com/teqbench/tbx-mat-banners/compare/v0.8.1...v0.9.0) (2026-04-12)


### Features

* **build:** ship docs manifests in the published tarball ([f9b2cfb](https://github.com/teqbench/tbx-mat-banners/commit/f9b2cfb646be6ebce67b800e5edfe7b0c42a36aa))
* **build:** ship docs manifests in the published tarball ([5cd1996](https://github.com/teqbench/tbx-mat-banners/commit/5cd1996391dea5db2aa23781cd4060224a4f167d))
* **storybook:** split into dev and docs configs with shared base ([437b51b](https://github.com/teqbench/tbx-mat-banners/commit/437b51b6c4d023e8eb018695df278fe7531cef7a))

## [0.8.1](https://github.com/teqbench/tbx-mat-banners/compare/v0.8.0...v0.8.1) (2026-04-10)


### Bug Fixes

* address post-0.8.0 code review findings ([#49](https://github.com/teqbench/tbx-mat-banners/issues/49)) ([d33f318](https://github.com/teqbench/tbx-mat-banners/commit/d33f31812d1297849f34b4acd3913e5685a1aebd))
* address post-0.8.0 code review findings ([#49](https://github.com/teqbench/tbx-mat-banners/issues/49)) ([8ac979d](https://github.com/teqbench/tbx-mat-banners/commit/8ac979de3450ba1b328bf755deda4d5638fa53bf))
* **ci:** move vite override comment to top-level key to unbreak npm ci ([4595a84](https://github.com/teqbench/tbx-mat-banners/commit/4595a840989ff10bbba010158e32b7143db3f4f2))

## [0.8.0](https://github.com/teqbench/tbx-mat-banners/compare/v0.7.1...v0.8.0) (2026-04-10)


### Features

* **banner:** add animation config and wire enter class onto overlay panel ([b328af1](https://github.com/teqbench/tbx-mat-banners/commit/b328af182a2105da860c5799c068c5ab3442096e)), closes [#38](https://github.com/teqbench/tbx-mat-banners/issues/38)
* **banner:** add CSS keyframes for overlay animations and wire Storybook control ([fe74087](https://github.com/teqbench/tbx-mat-banners/commit/fe7408740ca260376a009aa8049b4fb2ec8c8e6e)), closes [#38](https://github.com/teqbench/tbx-mat-banners/issues/38)
* **banner:** add optional enter/exit animations for overlay banners ([fb18c05](https://github.com/teqbench/tbx-mat-banners/commit/fb18c056beb7c90fa182b5760ba8173029a2a8ba))
* **banner:** wire exit animation coordination into dismiss and timeout paths ([3ad0dc9](https://github.com/teqbench/tbx-mat-banners/commit/3ad0dc91ba24f1042077207bfb143b68923d391f)), closes [#38](https://github.com/teqbench/tbx-mat-banners/issues/38)


### Bug Fixes

* **layout:** wrap actions group to a third row in narrow layout ([f5a3e2f](https://github.com/teqbench/tbx-mat-banners/commit/f5a3e2f705c25cfcebd7d65bb4ca33caa81f903d))
* **layout:** wrap actions group to a third row in narrow layout ([ed2114c](https://github.com/teqbench/tbx-mat-banners/commit/ed2114c878501a09ec9e0079e8fdd0dc6564a2be)), closes [#33](https://github.com/teqbench/tbx-mat-banners/issues/33)
* **storybook:** make inline banners dismissible and cover all control types ([44f6f03](https://github.com/teqbench/tbx-mat-banners/commit/44f6f03edca3cf7a9359b68d5b24fc53118c8e31))
* **storybook:** make inline banners dismissible and cover all control types ([27bcee8](https://github.com/teqbench/tbx-mat-banners/commit/27bcee8f1b6cd6258d97ca42d6380d6f1ec50d55))
* **storybook:** unblock build and prevent style override leakage ([93d4e83](https://github.com/teqbench/tbx-mat-banners/commit/93d4e83ac22444a87aa4a04269ec3c3ba5873424))
* **storybook:** unblock build and prevent style override leakage ([30e114e](https://github.com/teqbench/tbx-mat-banners/commit/30e114ef4576a419852ca1f53e6dacf24d3dd9c3))
* **styles:** add explicit z-index to banner overlay panel ([e0059ac](https://github.com/teqbench/tbx-mat-banners/commit/e0059ac37f924449c6d0cf781220f6161aba1c1d))
* **styles:** add explicit z-index to banner overlay panel ([20b7a65](https://github.com/teqbench/tbx-mat-banners/commit/20b7a65fcdf38a7678550bf9b1a5c47db1305cc2)), closes [#40](https://github.com/teqbench/tbx-mat-banners/issues/40)

## [0.7.1](https://github.com/teqbench/tbx-mat-banners/compare/v0.7.0...v0.7.1) (2026-04-09)


### Bug Fixes

* **skills:** replace .claude/skills submodule with .shared-skills aggregator ([92fc44d](https://github.com/teqbench/tbx-mat-banners/commit/92fc44d90dfda9a8ff25aba8fff6fc63be314e10))
* **skills:** replace .claude/skills submodule with .shared-skills aggregator ([42df414](https://github.com/teqbench/tbx-mat-banners/commit/42df414c8175b2a7cf013ee9795295760c043306))

## [0.7.0](https://github.com/teqbench/tbx-mat-banners/compare/v0.6.2...v0.7.0) (2026-04-07)


### Features

* **banner:** add actions group stories and fix form control tokens ([e56a759](https://github.com/teqbench/tbx-mat-banners/commit/e56a759a090f3616f36ca80c0a3cb5161f8333d8))
* **banner:** add icon variant stories ([36cf51a](https://github.com/teqbench/tbx-mat-banners/commit/36cf51a62b4526453b250c104095fdade93f38b0))
* **banner:** add inline story, fix default severity control theming ([6adcb27](https://github.com/teqbench/tbx-mat-banners/commit/6adcb27685db335328920c70e07d5b68b239b427))
* **banner:** implement banner component and service ([67b9ee5](https://github.com/teqbench/tbx-mat-banners/commit/67b9ee5ebcfc703cd67a597dc84edc442d4d6cf7))
* **banner:** implement banner component and service ([de234bc](https://github.com/teqbench/tbx-mat-banners/commit/de234bc5d425d594139507cd96da808ed577a799))
* **banner:** rename to Font Icon Variants, add SVG icon stories ([25e0d5b](https://github.com/teqbench/tbx-mat-banners/commit/25e0d5bb4593fc463786cc77cdf5eea302497fab))

## [0.6.2](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.6.1...v0.6.2) (2026-04-03)


### Bug Fixes

* **security:** switch reporting channel to email for private template repo ([5d0309d](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/5d0309dbb948341cd83a8f39e05cba4d6648ccf4))
* **tsdoc:** set [@related](https://github.com/related) tag to allowMultiple matching CLAUDE.md convention ([3e346a2](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/3e346a21c052ccbd02b76b49714a716d28238ad3))

## [0.6.1](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.6.0...v0.6.1) (2026-03-25)


### Bug Fixes

* **publish:** remove invalid comment field from ng-package.json ([47884f5](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/47884f5ed1c3d267ae27316ce3caa3b1298f71ea))
* **publish:** switch to publishing from dist/ directly ([343ec14](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/343ec1418a941453bbb971b758f6a68c29dc1ab8))
* **publish:** switch to publishing from dist/ directly ([8d96cf1](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/8d96cf1eabd553ba734b3171255e23c46c93a8d3))

## [0.6.0](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.5.2...v0.6.0) (2026-03-24)


### Features

* **config:** configure ESM import extensions for Node module resolution ([ff58eb7](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/ff58eb7f94101297411e6103eb8120fab8443673))
* **config:** configure ESM import extensions for Node module resolution ([7e75d6c](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/7e75d6c439155701552a4c207330d26be530d8f1))
* **config:** ESM import extensions and GitHub Packages access docs ([615d53b](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/615d53bf4a7a9a5bf7d845288d96b0c48649709c))

## [0.5.2](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.5.1...v0.5.2) (2026-03-24)


### Bug Fixes

* **ci:** add GitHub Packages prerequisites to CONTRIBUTING.md ([81c3228](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/81c322888b24a94c802d5dc38421003bf620b9c2))
* **ci:** configure GitHub Packages auth with setup-node and NODE_AUTH_TOKEN ([37660aa](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/37660aade632878e55469227250a5f31f28f1fe8))

## [0.5.1](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.5.0...v0.5.1) (2026-03-24)


### Bug Fixes

* **ci:** configure GitHub Packages auth with setup-node and NODE_AUTH_TOKEN ([7cbdf60](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/7cbdf603aac888a8e28894d00ec073c1186458ce))
* **ci:** configure GitHub Packages auth with setup-node and NODE_AUTH_TOKEN ([5f32cb9](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/5f32cb9ffd62cc547b5b077bfab84aadb5fdcec1))

## [0.5.0](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.4.2...v0.5.0) (2026-03-23)


### Features

* **setup:** add Angular test infrastructure step to SETUP.md checklist ([4c151d6](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/4c151d681ac4b051f934ed005c7704f852de8f83))
* **setup:** add Angular test infrastructure step to SETUP.md checklist ([c02cc9b](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/c02cc9bc84991b7c8930ad2c861a2ffbeff497af))

## [0.4.2](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.4.1...v0.4.2) (2026-03-23)


### Bug Fixes

* **ci:** use \s+ in README version drift regex for TypeScript row ([995cb7c](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/995cb7ce0542a6f892e0110265205a0c6db4fbc6))
* **ci:** use \s+ in README version drift regex for TypeScript row ([6ea7415](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/6ea74155b45532b92127f05b1df91c54e9896bc3))
* **ci:** use \s+ in README version drift regex for TypeScript row ([00b680b](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/00b680b2b35b32cbdb5899809faa0574e853d1e3))

## [0.4.1](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.4.0...v0.4.1) (2026-03-23)


### Bug Fixes

* **readme:** use actual repo name in badge URLs ([694c4d6](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/694c4d6cb61facae1a1a144d3731f78fac8a54d6))
* **readme:** use actual repo name in badge URLs ([5507518](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/55075185cb11c83fa8d7d934ed2efea762548ad5))

## [0.4.0](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.3.2...v0.4.0) (2026-03-23)


### Features

* **ci:** migrate badges from committed SVGs to Shields.io gist endpoints ([649d8c6](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/649d8c6cf7e00f5e11395ec2f211c79c99be3e4f))
* **ci:** migrate badges from committed SVGs to Shields.io gist endpoints ([0e2faeb](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/0e2faeb7a748aa725964a1e003831c6b54a72c05))

## [0.3.2](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.3.1...v0.3.2) (2026-03-22)


### Bug Fixes

* **ci:** handle race condition in sync workflow ([a4f277e](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/a4f277ea6575c0dbecb6841122e6c2e8e2e24469))
* **ci:** handle race condition in sync workflow ([a302093](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/a302093a83defd0b6c5510d553ccb3730c34e5f0))
* use dev build number badge (build [#76](https://github.com/teqbench/teqbench.dev.templates.tbx-package/issues/76)) ([75685f2](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/75685f2da65a249b0d9664d81d020adbde3d61ca))

## [0.3.1](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.3.0...v0.3.1) (2026-03-22)


### Bug Fixes

* **setup:** move dep-compat to auto, add verification table ([964483e](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/964483ea1e6ca3cc0a2cfd7dc9f551215fba7358))

## [0.3.0](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.2.0...v0.3.0) (2026-03-22)


### Features

* **ci:** add test count and coverage badges ([d74fa64](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/d74fa64dc4f3c42e56fab45c69ce7d7768d2777e))
* **ci:** add test count and coverage badges ([31d9e14](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/31d9e14ec5d0252c8bb27ed576d11974fbb884b1))

## [0.2.0](https://github.com/teqbench/teqbench.dev.templates.tbx-package/compare/v0.1.0...v0.2.0) (2026-03-22)


### Features

* scaffold [@teqbench](https://github.com/teqbench) package template ([47fb9c7](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/47fb9c7a708581e9d6188ceaef1ff1214938cc83))
* **template:** harden package template to production-grade ([20cd619](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/20cd6191c9248171f3542b82c381e8ed5c5d1d20))
* **template:** harden package template to production-grade ([b0ec3a2](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/b0ec3a21eab0c23eb1ccfeed83908ba63db436a3))


### Bug Fixes

* **ci:** add Dependabot ignore rules for @types/node and ESLint ([576d5c1](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/576d5c1966ce288b5439f4f41d57e8dd155b8cab))
* **ci:** Dependabot ignore rules and Prettier exclusion for release-please ([f3f3bf5](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/f3f3bf5ff493318afc4cd48bcac5cd09ec024588))
* **ci:** exclude .release-please-manifest.json from Prettier ([813b86d](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/813b86d3a32ef27df9e53352f1fcc5b18b047b01))
* **ci:** prevent Dependabot from bumping @types/node to next major ([1407f02](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/1407f022a83ae641f0ec9f04f1d563b6d9e4fce1))
* **ci:** remove .badges/ from .gitignore so CI can commit badges ([eb8c382](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/eb8c382f51f968fada1d94f4e7367ce28b93ae91))
* **ci:** remove .badges/ from .gitignore so CI can commit badges ([8d43f53](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/8d43f53cf1c1986628cb655c5fdc4eb3e4c28297))
* **deps:** add @vitest/coverage-v8 required by test:coverage ([693851b](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/693851b0bfb658acda5ad365a6e36bdd6363244b))
* **template:** address review findings — coverage, setup steps, and dep pinning ([759a32c](https://github.com/teqbench/teqbench.dev.templates.tbx-package/commit/759a32cc8894130bc986b48df36d7f1166ea5a7e))

## Changelog
