# @teqbench/TODO-package-name

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/teqbench.dev.templates.tbx-package-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/teqbench.dev.templates.tbx-package-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/teqbench.dev.templates.tbx-package-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/teqbench.dev.templates.tbx-package-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/teqbench.dev.templates.tbx-package-main-build-number.json)

> TODO: Package description (1-2 sentences explaining what this package provides).

## Installation

Configure [npm ↗](https://www.npmjs.com) to use [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) for the `@teqbench` scope:

```bash
echo "@teqbench:registry=https://npm.pkg.github.com" >> .npmrc
```

Install the package:

```bash
npm install @teqbench/TODO-package-name
```

## Usage

```typescript
// TODO: Add usage example
import {} from '@teqbench/TODO-package-name';
```

## API Reference

<!-- TODO: Document the public API -->

## Naming Convention

All public exports follow the `@teqbench` naming convention. The prefix is determined by the package scope:

| Package pattern       | PascalCase prefix | UPPER_SNAKE_CASE prefix |
| --------------------- | ----------------- | ----------------------- |
| `@teqbench/tbx-mat-*` | `TbxMat`          | `TBX_MAT_`              |
| `@teqbench/tbx-ngx-*` | `TbxNgx`          | `TBX_NGX_`              |
| `@teqbench/tbx-*`     | `Tbx`             | `TBX_`                  |

| Symbol type        | Casing                       | Example (`tbx-*`)           |
| ------------------ | ---------------------------- | --------------------------- |
| Classes / Services | PascalCase with prefix       | `TbxGreetService`           |
| Interfaces / Types | PascalCase with prefix       | `TbxGreetConfig`            |
| Enums              | PascalCase with prefix       | `TbxGreetMode`              |
| Injection tokens   | UPPER_SNAKE_CASE with prefix | `TBX_GREET_DEFAULT_OPTIONS` |
| Constants          | UPPER_SNAKE_CASE with prefix | `TBX_DEFAULT_TIMEOUT`       |

Functions, internal symbols, and third-party types are not prefixed.

## Compatibility

| Dependency                                     | Version  |
| ---------------------------------------------- | -------- |
| [TypeScript ↗](https://www.typescriptlang.org) | ~5.9.0   |
| [Node.js ↗](https://nodejs.org)                | >=24.0.0 |

## Feedback

- [Bug Report ↗](https://github.com/teqbench/teqbench.dev.templates.tbx-package/issues/new?template=bug_report.md)
- [Feature Request ↗](https://github.com/teqbench/teqbench.dev.templates.tbx-package/issues/new?template=feature_request.md)

## License

[AGPL-3.0](LICENSE) — Copyright 2026 TeqBench
