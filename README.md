# Gravity Lab

A browser orbital-mechanics playground with hybrid N-body/Kepler simulation, celestial templates, belts and clouds, collision predictions, and simulation state import/export. It runs as a static page with no server-side application or third-party runtime dependencies.

Existing Netlify project: **orbital-mechanics-simulation**, https://orbital-mechanics-simulation.netlify.app/. The dashboard recorded deploy `6a7aea8516a3402a25c6581f` as published on August 11, 2026. This project is distinct from `Leigh-Ola/Gravity`.

## Run locally

Use Node.js 20+ for the dependency-free build/tests. Python 3 provides a convenient static server:

```sh
npm ci
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. Serve over HTTP: opening the HTML directly as a file can prevent preset fetches. The build/tests do not contact Netlify or start a deployment.

## Explore

- Add stars, planets, moons, black holes, neutron stars and custom objects in incoming/orbiting modes.
- Change time rate, pause, zoom, trails, labels and camera follow.
- Generate belts/clouds, inspect bodies and predict encounters within a bounded calculation budget.
- Load **Full Solar System** (210 saved bodies) or **Stable Black Hole Orbit** (4 saved bodies) from the Info tab.
- Export a `.gravitylab.json` snapshot and import it later. Choosing a preset or importing state replaces the current simulation.

## Model and limitations

Units are AU, solar masses and Julian years, with `G = 4π²`. General encounters use kick–drift–kick leapfrog integration; strongly bound hierarchical orbits use two-body Kepler drift between external gravity kicks. Major bodies interact. Tracers feel major-body gravity without mutually perturbing one another. Generated populations use analytic orbits until stronger perturbations promote members to dynamic tracers.

This is an educational simulation, not a precision ephemeris or general-relativity solver. Black-hole appearance, lensing and some disruption effects are approximations. Time steps adapt to body count/frame time. Tracer–tracer collisions are omitted, and generated population collisions are checked per rendered frame. Large time steps and dense encounters can reduce accuracy. The 8,000-body import limit does not guarantee interactive performance. Import state files only from trusted sources.

## Files and build

| Path | Purpose |
| --- | --- |
| `index.html` | Recovered readable single-file interface, renderer and physics |
| `presets/*.gravitylab.json` | Saved simulation presets |
| `presets/index.json` | Source catalog and display names |
| `scripts/build.mjs` | Static build and served preset catalog/report generation |
| `tests/recovery.test.mjs` | Script syntax, actual Kepler routine and preset consistency checks |
| `netlify.toml` | Original deployed build/header configuration |

Add exported states to `presets/` and run `npm run build`. The build discovers `.gravitylab.json` files, reuses catalog display names when present and writes `dist/`. Commit new preset files and preferred names in the source catalog; generated output is ignored.

## Recovery provenance

Recovered through Netlify's normal dashboard **deployed-file download**, without requesting the public application. The complete downloaded artifact is retained outside this repository. Chrome blocked the original source-archive download, so the original build program and development history were not recovered.

The HTML and both preset contents preserve the deployed bytes. The Solar System filename is restored to `Full Solar System.gravitylab.json` to match the deployed catalog's exact case; the downloaded archive lowercased it. This prevents a case-sensitive hosting mismatch. The original Netlify configuration is preserved. A replacement static build, validation tests and this README were added. No missing backend has been inferred; the application loads presets directly from static files.

The original generated `build-report.json` stays only with the recovery archive. New reports and the served catalog are generated in `dist/`. Dependency caches, logs, account state and private conversation exports are excluded. No license has been added.

## Deployment reference

Run `npm run build` and publish `dist/` on a static host. The original Netlify configuration retains its Node 20 build setting and no-store headers for presets/build reports. This GitHub import does not change the Netlify project, connect automatic deployment or publish a new version. A future deployment is a separate action that may consume hosting credits.

Commits record current import steps: simulation application, saved presets, then build/validation/documentation. They are not invented historical dates. Local tests check selected numerical behavior and recovered-file consistency, not every scenario's scientific accuracy or the current hosted site.
