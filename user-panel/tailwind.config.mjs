/** @type {import('postcss-load-config').Config} */
const config = {
    // theme: {
    //     container: {
    //         center: true,
    //         screens: {
    //             "2xl": "1400px",
    //         },
    //     },
    //     extend: {
    //         fontFamily: {
    //             primary: ["var(--font-azo-sans)"],
    //             secondary: ["Lexend"],
    //         },
    //         colors: { ...ColorPalatte },
    //         keyframes: {
    //             "accordion-down": {
    //                 from: { height: "0" },
    //                 to: { height: "var(--radix-accordion-content-height)" },
    //             },
    //             "accordion-up": {
    //                 from: { height: "var(--radix-accordion-content-height)" },
    //                 to: { height: "0" },
    //             },
    //         },
    //         animation: {
    //             "accordion-down": "accordion-down 0.2s ease-out",
    //             "accordion-up": "accordion-up 0.2s ease-out",
    //         },
    //     },
    // },
    plugins: {
        '@tailwindcss/postcss': {},
    },
}

export default config
