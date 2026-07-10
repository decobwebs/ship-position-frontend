import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'media',
  plugins: [
    ({ addVariant }: any) => {
      // Use `hoverable:` instead of `hover:` for any state that should never
      // stick after a tap on touch devices.
      addVariant('hoverable', '@media (hover: hover) and (pointer: fine) { &:hover }')
    },
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        bg: 'var(--bg)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        cta: 'var(--cta-bg)',
        'cta-ink': 'var(--cta-ink)',
        'accent-ai': 'var(--accent-ai)',
        'accent-ai-soft': 'var(--accent-ai-soft)',
        berth: 'var(--berth)',
        anchor: 'var(--anchor)',
        expect: 'var(--expect)',
        sail: 'var(--sail)',
        cancel: 'var(--cancel)',
        high: 'var(--high)',
        medium: 'var(--medium)',
        low: 'var(--low)',
        info: 'var(--info)',
      },
      spacing: {
        1: 'var(--sp-1)',
        2: 'var(--sp-2)',
        3: 'var(--sp-3)',
        4: 'var(--sp-4)',
        6: 'var(--sp-6)',
        8: 'var(--sp-8)',
        12: 'var(--sp-12)',
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      transitionDuration: {
        instant: 'var(--dur-instant)',
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        out: 'var(--ease-out)',
        pop: 'var(--ease-pop)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'typing-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '.4' },
          '40%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in var(--dur-base) var(--ease-standard)',
        shimmer: 'shimmer 1.6s linear infinite',
        'typing-bounce': 'typing-bounce 1.2s ease-in-out infinite',
      },
    },
  },
}
