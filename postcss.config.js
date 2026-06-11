// Used by the Storybook (Vite) build only — tsup does not process CSS.
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
