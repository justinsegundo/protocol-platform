export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4EF',
        forest: {
          50: '#f0f5f1',
          100: '#d9e8dc',
          500: '#2D5A3D',
          700: '#1C3829',
          900: '#0F1F17',
        },
        amber: {
          400: '#F0B429',
          500: '#E8A838',
          600: '#D4922A',
        },
        terra: '#C4724A',
        ink: '#1A1A1A',
        muted: '#6B7280',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}