import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      maxHeight: {
        '50': '50px',
        '100': '100px',
        '450': '450px',
        '500': '500px',
        '800': '800px',
        '1000': '1000px',
        '80%': '80%',
      },
      width: {
        '5%': '5%',
      },
      maxWidth: {
        '50': '50px',
        '170': '170px',
        '450': '450px',
        '500': '500px',
        '800': '800px',
        '1000': '1000px',
        '80%': '80%',
      },
      colors: {
        white: '#ffffff',
        black: '#000000',
        'black-shadow': 'rgba(0, 0, 0, 0.5)',
        'padrao-red-300': 'rgba(255, 1, 0, 1)',
        'padrao-yellow-300': 'rgba(254, 218, 21, 1)',
        'padrao-orange-300': 'rgba(245, 109, 1, 1)',
        'padrao-pink-300': 'rgba(245, 4, 103, 1)',
        'padrao-purple-300': 'rgba(151, 71, 255, 1)',
        'padrao-blue-300': 'rgba(41, 171, 227, 1)',
        'padrao-green-300': 'rgba(31, 170, 77, 1)',
        'padrao-red-500': 'rgba(255, 1, 0, 0.5)',
        'padrao-yellow-500': 'rgba(254, 218, 21, 0.5)',
        'padrao-orange-500': 'rgba(245, 109, 1, 0.5)',
        'padrao-pink-500': 'rgba(245, 4, 103, 0.5)',
        'padrao-purple-500': 'rgba(151, 71, 255, 0.5)',
        'padrao-blue-500': 'rgba(41, 171, 227, 0.5)',
        'padrao-green-500': 'rgba(31, 170, 77, 0.5)',
      },
      spacing: {
        'custom-right': '-500px',
      },
      typography: {
        'underline-offset': {
          css: {
            'text-underline-offset': '2em',
          },
        },
      },
      screens: {
        sm: '640px',
        md: '900px',
        lg: '1200px',
        xl: '1500px',
        '2xl': '2000px',
      },
    },
  },
  plugins: [],
}
export default config
