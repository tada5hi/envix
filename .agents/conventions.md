# Conventions

Use the installed shared ESLint configuration through the repository's lint command. Keep interface/type naming and declaration placement compatible with public exports; qualify filesystem/deep type compatibility against the declared exports map.

Keep parsing, fallback and failure behavior consistent across the supported environment sources. Avoid adding Node-only dependencies to shared readers. `@ebec/core` is the only runtime dependency.

The runtime source is resolved on every call in the order `globalThis.process.env`, `globalThis.__env__`, in-memory record; the first available one handles the whole call and sources are never merged. For every source, only string values count as set; the runtime source also reads own properties only. Reader and parser options must be objects; anything else throws a `TypeError`. Error messages and properties name keys only and never include values, since values may be secrets.

Keep the runtime engine and emitted JavaScript contract separate from tooling requirements. Bundler upgrades must retain output names, module formats, declaration generation and source-map behavior. Avoid introducing runtime APIs unsupported by the package's declared engine or documented consumers.

No dependency overrides are declared. For any compatibility pin introduced during future work, record its reason and the condition for removing it here.

Release configuration lives in `.github/workflows/` and the release-please files. Changes to release triggers must preserve the separation between creating release metadata and publishing artifacts.
