/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  // Preserve the existing browser defaults, sizing and third-party carousel styles.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        canvas: 'var(--black)',
        surface: 'var(--white)',
        accent: 'var(--primary-color)',
        ink: 'var(--ink)',
        'on-canvas': 'var(--on-canvas)',
        'on-accent': 'var(--on-accent)',
      },
      screens: {
        'short-screen': { raw: '(max-height: 800px)' },
        'compact-screen': { raw: '(max-height: 1100px)' },
        mobile: { raw: '(max-width: 660px)' },
      },
    },
  },
  plugins: [],
};
