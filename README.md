# Gravity Lab

A browser orbital-mechanics playground with hybrid N-body/Kepler simulation, celestial templates, belts and clouds, collision predictions, and simulation state import/export. It runs as a static page with no server-side application or third-party runtime dependencies.

[Open Gravity Lab](https://orbital-mechanics-simulation.netlify.app/)

## Run locally

Use Node.js 20+ for the dependency-free build and tests. Python 3 provides a convenient static server:

```sh
npm ci
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. Serve over HTTP: opening the HTML directly as a file can prevent preset loading.

## Explore

- Add stars, planets, moons, black holes, neutron stars and custom objects in incoming or orbiting modes.
- Change the time rate, pause, zoom, trails, labels and camera follow.
- Generate belts and clouds, inspect bodies, and predict encounters within a bounded calculation budget.
- Load **Full Solar System** (210 saved bodies) or **Stable Black Hole Orbit** (4 saved bodies) from the Info tab.
- Export a `.gravitylab.json` snapshot and import it later. Choosing a preset or importing a state replaces the current simulation.

## Physics model

Units are astronomical units (AU), solar masses and Julian years, with `G = 4π²`. General encounters use kick–drift–kick leapfrog integration. Strongly bound hierarchical orbits use two-body Kepler drift between external gravity kicks.

Major bodies interact with one another. Tracers feel major-body gravity without mutually perturbing one another. Generated populations use analytic orbits until stronger perturbations promote members to dynamic tracers.

## Limitations

Gravity Lab is an educational simulation, not a precision ephemeris or general-relativity solver. Black-hole appearance, lensing and some disruption effects are approximations. Time steps adapt to body count and frame time; large time steps and dense encounters can reduce accuracy.

Tracer–tracer collisions are omitted, and generated population collisions are checked per rendered frame. The 8,000-body import limit does not guarantee interactive performance. Import state files only from trusted sources.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Single-file interface, renderer and physics implementation |
| `presets/*.gravitylab.json` | Saved simulation presets |
| `presets/index.json` | Preset catalog and display names |
| `scripts/build.mjs` | Static build and preset catalog/report generation |
| `tests/recovery.test.mjs` | JavaScript syntax, selected Kepler calculations and preset consistency checks |
| `netlify.toml` | Build and HTTP header configuration |

## Add presets

1. Export a simulation state as a `.gravitylab.json` file.
2. Place it in `presets/`.
3. Optionally add its filename and preferred display name to `presets/index.json`. Match filename capitalization exactly.
4. Run `npm run build` and serve `dist/`.

The build discovers `.gravitylab.json` files, validates their format, reuses catalog display names when available, and writes the served catalog and `build-report.json` into `dist/`. Generated output is excluded from version control.

## Tests

`npm test` checks that the application script parses, exercises selected circular and eccentric Kepler orbits, and checks preset filenames and body-state consistency. These checks do not establish the scientific accuracy of every simulation scenario.

## Deployment

Run `npm run build` and publish `dist/` on a static host. Presets are loaded directly from static JSON files; no backend or API key is required. The Netlify configuration specifies Node 20, the build command and publish directory, plus no-store headers for presets and build reports.
