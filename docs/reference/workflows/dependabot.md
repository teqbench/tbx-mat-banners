# Dependabot Configuration

**Configuration:** Managed at the org level in [`teqbench/.github` ↗](https://github.com/teqbench/.github)

---

## Purpose

Automatically opens pull requests to update dependencies on a weekly schedule. PRs target the `dev` branch (not `main`) and use [Conventional Commits ↗](https://www.conventionalcommits.org) message prefixes so they integrate cleanly with the [Release Please ↗](https://github.com/googleapis/release-please) workflow.

> **Note:** The [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) configuration file (`dependabot.yml`) is managed at the org level in `teqbench/.github`, not in this repository. The details below describe the org-wide configuration as it applies to this repo.

---

## Schedule

Runs every **Monday**.

---

## Target Branch

All [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) PRs target **`dev`**, not `main`.

---

## Ecosystems

### npm Dependencies

| Setting           | Value          |
| ----------------- | -------------- |
| Package ecosystem | `npm`          |
| Directory         | `/`            |
| Commit prefix     | `chore(deps):` |
| Labels            | `dependencies` |

#### Grouping

Related packages are grouped into single PRs to reduce noise:

| Group        | Packages                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript` | `typescript`                                                                                                                                   |
| `tooling`    | `prettier`, `prettier-*`, `@prettier/*`, `husky`, `lint-staged`, `vitest`, `@vitest/*`, `eslint`, `eslint-*`, `@eslint/*`, `typescript-eslint` |

Ungrouped packages (e.g., `@types/node`) get individual PRs.

### GitHub Actions

| Setting           | Value                |
| ----------------- | -------------------- |
| Package ecosystem | `github-actions`     |
| Directory         | `/`                  |
| Commit prefix     | `chore(ci):`         |
| Labels            | `dependencies`, `ci` |

---

## Interaction with Pinned Dependencies

Some dependencies are intentionally pinned without caret ranges (see the custom `devDependenciesPinned` field in `package.json` — not part of the [npm ↗](https://www.npmjs.com) spec, used for documentation only):

- **`typescript-eslint`** — pinned without `^` because patch releases have introduced breaking rule changes
- **`@types/node`** — pinned to match the [Node.js ↗](https://nodejs.org) runtime major version

[Dependabot ↗](https://docs.github.com/en/code-security/dependabot) will still open PRs for these packages. Review them carefully and test before merging — the pinning is intentional and documented.

---

## CI Integration

[Dependabot ↗](https://docs.github.com/en/code-security/dependabot) PRs trigger the CI workflow like any other PR. However, the CI workflow handles [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) specially:

- **App token generation is skipped** — [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) cannot access repository secrets
- **Submodule checkout is skipped** — [Dependabot ↗](https://docs.github.com/en/code-security/dependabot) cannot access private submodules
- **Falls back to `GITHUB_TOKEN`** — sufficient for read-only validation (audit, lint, typecheck, test)
- **Badge commits are not generated** — badges only commit on push events, not PRs
