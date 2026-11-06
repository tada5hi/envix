# Conventions

Use the installed shared ESLint configuration through the repository's lint command. Keep interface/type naming and declaration placement compatible with public exports; preserve intentional deep import facades.

Keep parsing, fallback and failure behavior consistent across the supported environment sources. Avoid adding Node-only dependencies to shared readers.

Keep the runtime engine and emitted JavaScript contract separate from tooling requirements. Bundler upgrades must retain output names, module formats, declaration generation and source-map behavior. Avoid introducing runtime APIs unsupported by the package's declared engine or documented consumers.

No dependency overrides are declared. For any compatibility pin introduced during future work, record its reason and the condition for removing it here.

Release configuration lives in `.github/workflows/` and the release-please files. Changes to release triggers must preserve the separation between creating release metadata and publishing artifacts.
