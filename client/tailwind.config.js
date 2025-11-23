/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--primary)',
                    hover: 'var(--primary-hover)',
                    light: 'var(--primary-light)',
                },
                secondary: 'var(--secondary)',
                success: {
                    DEFAULT: 'var(--success)',
                    light: 'var(--success-light)',
                },
                warning: {
                    DEFAULT: 'var(--warning)',
                    light: 'var(--warning-light)',
                },
                danger: {
                    DEFAULT: 'var(--danger)',
                    light: 'var(--danger-light)',
                },
                info: {
                    DEFAULT: 'var(--info)',
                    light: 'var(--info-light)',
                },
                bg: {
                    primary: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    tertiary: 'var(--bg-tertiary)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    tertiary: 'var(--text-tertiary)',
                },
                border: {
                    DEFAULT: 'var(--border-color)',
                    hover: 'var(--border-hover)',
                },
            },
            keyframes: {
                fadeIn: {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' },
                },
                slideInRight: {
                    'from': { transform: 'translateX(100%)' },
                    'to': { transform: 'translateX(0)' },
                },
                slideInUp: {
                    'from': { transform: 'translateY(100%)' },
                    'to': { transform: 'translateY(0)' },
                },
                slideUp: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    'from': { transform: 'scale(0.95)', opacity: '0' },
                    'to': { transform: 'scale(1)', opacity: '1' },
                },
                slideDown: {
                    'from': { opacity: '0', transform: 'translateY(-10px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.2s ease-out',
                slideInRight: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                slideInUp: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                slideUp: 'slideUp 0.3s ease-out',
                scaleIn: 'scaleIn 0.2s ease-out',
                slideDown: 'slideDown 0.2s ease-out',
            },
        },
    },
    plugins: [],
}
