# Dependency Vulnerability Report — plumber-finder

**Date:** 2026-11-04
**Scanner:** `npm audit` (npm 11.17.0, Node v22.12.0), run in `backend/`, `frontend/` and `admin/`. The project root has no dependencies or lockfile of its own.
**Also run:** `npm audit --omit=dev` (production only) and `npm outdated`.

## Result at a glance

| App | Packages scanned | Critical | High | Moderate | Low | In production code? |
|-----|-----------------|---------:|-----:|---------:|----:|---------------------|
| `backend/` | 119 | 0 | 0 | 0 | 0 | — |
| `frontend/` | 435 | 0 | 0 | 15 | 0 | **No** (dev tooling only) |
| `admin/` | 439 | 0 | 0 | 16 | 0 | **No** (dev tooling only) |
| **Total** | | **0** | **0** | **31** | **0** | |

**There are no high-risk (high or critical) vulnerabilities.** With development tools excluded (`npm audit --omit=dev`), every app reports **0 vulnerabilities**. Nothing the servers or browsers run in production is affected.

## The moderate findings, in plain English

All 31 warnings come from **one** advisory in one small library, reported many times over because many packages depend on it.

| | |
|---|---|
| **Advisory** | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): *minimatch has potential denial of service via globparts amplification* |
| **Package** | `minimatch` < 11.0.1 (installed: 3.1.5 and 10.2.6) |
| **Weakness** | CWE-405, asymmetric resource consumption |
| **Pulled in by** | `eslint` 10.14 and `eslint-config-next` 16.4 (and their plugins: `typescript-eslint`, `eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `@next/eslint-plugin-next`) |

**What it means:** `minimatch` matches file names against wildcard patterns such as `src/**/*.ts`. A specially crafted pattern makes it do a huge amount of work, so whatever is running it freezes or slows to a crawl (a "denial of service").

**Why the risk is low here:**
- Only **ESLint**, the code-style checker developers run with `npm run lint`, uses it. ESLint isn't part of the production backend, and it isn't in the website bundle users download.
- To trigger it, someone would have to put a malicious pattern into this repo's own ESLint config or ignore files. Anyone who can do that can already change your code, so the bug gives them nothing extra.
- The worst realistic outcome is a slow or hung `npm run lint` on a developer machine or in CI.

**Moderate risk, dev-only, no action needed urgently.**

### How to fix it (and what *not* to do)

- ⚠️ **Don't run `npm audit fix --force`.** npm's suggested "fix" is to *downgrade* to `eslint@4.0.0` and `eslint-config-next@0.2.4` / `12.0.4`. Those are versions from years ago that would break linting for Next 16 and React 19. npm suggests them only because they predate the vulnerable dependency.
- ✅ **Recommended:** wait for ESLint and `eslint-config-next` to move to `minimatch` ≥ 11.0.1, then update normally (`npm update eslint eslint-config-next`). Re-run `npm audit` after each routine update.
- ✅ **Optional, if you want a clean audit now:** force a patched version in `frontend/package.json` and `admin/package.json`, then run `npm install && npm run lint` to confirm linting still works:
  ```json
  "overrides": { "minimatch": "^11.0.1" }
  ```
  Caution: `minimatch` 3 → 11 changed its API, and older plugins that use `minimatch` 3 may stop working. Only keep the override if `npm run lint` passes.

## Outdated packages (not vulnerabilities, but worth knowing)

None of these has a known advisory today. Keeping up with patch releases is the cheapest way to stay clean.

| App | Package | Installed | Safe update (same major) | Latest | Note |
|-----|---------|-----------|--------------------------|--------|------|
| backend | `express` | 5.2.1 | 5.3.0 | 5.3.0 | Minor; update |
| backend | `mongoose` | 8.24.1 | 8.24.8 | 9.11.4 | Take 8.24.8 now; 9.x is a major upgrade (plan it) |
| backend | `google-auth-library` | 10.9.1 | 10.9.1 | 11.3.3 | Major; handles sign-in tokens, so plan the upgrade and retest Google login |
| backend | `dotenv` | 16.6.1 | 16.6.1 | 18.0.9 | Major; low priority |
| frontend, admin | `next` | 16.4.3 | 16.4.5 | 16.4.5 | **Patch, recommended**: Next patch releases often contain security fixes |
| frontend, admin | `eslint-config-next` | 16.4.3 | 16.4.5 | 16.4.5 | Patch; update alongside `next` |
| frontend, admin | `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | 4.3.4 | 4.3.4 | Patch |
| admin | `react-dom` | 19.3.0 | 19.3.1 | 19.3.1 | Patch; keep `react` and `react-dom` on the same version |
| frontend, admin | `typescript` | 5.9.3 | 5.9.3 | 7.0.2 | Major; dev only, plan separately |
| frontend | `@hookform/resolvers` | 5.9.2 | 5.9.2 | 7.0.2 | Major; test forms before upgrading |
| frontend | `react-intersection-observer` | 10.1.0 | 10.1.0 | 11.0.1 | Major; low priority |

One-line safe update (patch and minor only, stays within the version ranges in `package.json`):

```bash
npm --prefix backend update && npm --prefix frontend update && npm --prefix admin update
npm test && npm run lint && npm run build
```

## Other observations

- **Node version mismatch:** `backend/package.json` declares `"engines": { "node": "26.x" }`, but this machine runs **Node v22.12.0**. Make the declared and actual versions match (in CI and hosting too), so tests run on the same runtime as production and Node security patches aren't missed.
- **Lockfiles are committed** for all three apps, which is good: installs are reproducible, and `npm audit` checks exactly what ships. Use `npm ci` in CI and deployments.
- **The backend has a small dependency footprint** (8 direct packages, 119 total), which keeps its attack surface small.

## Recommended routine

1. **Now:** update `next` and `eslint-config-next` to 16.4.5, `express` to 5.3.0 and `mongoose` to 8.24.8, then run the tests and build.
2. **CI:** add `npm audit --omit=dev --audit-level=high` to the pipeline for each app. It fails the build only on high or critical problems in production code, so dev-tool noise like the `minimatch` warning won't block releases.
3. **Automation:** turn on Dependabot or Renovate for the three `package.json` files to get update PRs automatically.
4. **Monthly:** run a full `npm audit` (including dev) and review majors (`mongoose` 9, `google-auth-library` 11).

---

*This report covers known vulnerabilities in third-party packages only. For issues in the project's own code, see [SECURITY_AUDIT.md](SECURITY_AUDIT.md). Its critical account-takeover finding (C-1) is much more urgent than anything in this report.*
