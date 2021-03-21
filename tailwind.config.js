const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                p: '#fafafa',
                s: '#f1f1f5',
            },
            textColor: {
                p: 'rgba(0, 0, 0)',
                s: 'rgb(85, 85, 85)',
            },
            minWidth: {
                ...defaultTheme.spacing,
            },
            maxWidth: {
                ...defaultTheme.spacing,
            }
        },
        flexGrow: {
            DEFAULT: 1,
            '0': 0,
            '1': 1,
            '2': 2,
        },
    },
    variants: {
        extend: {
            zIndex: ['hover', 'active'],
            scale: ['active']
        },
    },
    plugins: [],
}
