/** @type {import('tailwindcss').Config} */
const {fontFamily} = require("tailwindcss/defaultTheme");
export default {
    darkMode: ["class"],
    content: [
        "./src/**/*.{ts,tsx}"
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px"
            }
        },
        extend: {
            colors: {
            // Custom
                background: {
                    DEFAULT: "hsl(var(--background))",
                    light: "hsl(var(--background-light))"
                },
                foreground: {
                    DEFAULT: "hsl(var(--foreground))",
                    dark: "hsl(var(--foreground-dark))"
                },
                placeholder: "hsl(var(--placeholder))",
                border: {
                    DEFAULT: "hsl(var(--border))",
                    gray: {
                        DEFAULT: "hsl(var(--border-gray))",
                        dark: "hsl(var(--border-gray-dark))"
                    }
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    hover: "hsl(var(--primary-hover))",
                    pressed: "hsl(var(--primary-pressed))",
                    disabled: "hsl(var(--primary-disabled))"
                },
                positive: {
                    DEFAULT: "hsl(var(--positive))",
                    hover: "hsl(var(--positive-hover))",
                    pressed: "hsl(var(--positive-pressed))",
                    disabled: "hsl(var(--positive-disabled))"
                },
                negative: {
                    DEFAULT: "hsl(var(--negative))",
                    hover: "hsl(var(--negative-hover))",
                    pressed: "hsl(var(--negative-pressed))",
                    disabled: "hsl(var(--negative-disabled))"
                },
                cwhite: "hsl(var(--custom-white))",
                cblack: "hsl(var(--custom-black))",
                icon: {
                    gray: {
                        DEFAULT: "hsl(var(--icon-gray))",
                        light: "hsl(var(--icon-gray-light))"
                    }
                },
    
                // Defaults
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))"
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))"
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))"
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))"
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))"
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))"
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)"
            },
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
                display: "Roboto",
                primary: "Public Sans",
                code: "Source Code Pro"
            },
            keyframes: {
                "accordion-down": {
                    from: {height: "0"},
                    to: {height: "var(--radix-accordion-content-height)"}
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: "0"}
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out"
            },
            spacing: {
                icon: "20px"
            },
            typography: {
                DEFAULT: {
                    css: {
                        "--tw-prose-headings": "hsl(var(--custom-black))",
                        "--tw-prose-invert-headings": "hsl(var(--custom-white))",
                        "--tw-prose-pre-bg": "rgba(255, 255, 255, 0.8)",
                        "--tw-prose-pre-code": "hsl(var(--custom-black))",
                        "--tw-prose-invert-pre-bg": "rgba(0, 0, 0, 0.15)",
                        "--tw-prose-bullets": "hsl(var(--custom-black))",
                        "--tw-prose-invert-bullets": "hsl(var(--custom-white))"
                    }
                }
            },
            screens: {
                "3xl": "1800px"
            }
        }
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
};

