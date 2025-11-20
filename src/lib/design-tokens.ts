/**
 * Alumimundo Design System Tokens
 * Centralized design tokens for consistent theming across the application
 */

export const designTokens = {
  // Border styles
  borders: {
    card: 'border border-slate-200 dark:border-gray-700',
    cardHover: 'hover:border-alumimundo-teal',
    input: 'border border-gray-200 dark:border-gray-700',
    divider: 'border-gray-200 dark:border-gray-700',
    dividerSubtle: 'border-gray-100 dark:border-gray-800',
  },

  // Background colors
  backgrounds: {
    card: 'bg-white dark:bg-gray-800',
    cardSecondary: 'bg-gray-50 dark:bg-gray-700',
    cardHover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    page: 'bg-gray-50 dark:bg-gray-900',
    overlay: 'bg-white/80 dark:bg-gray-900/80',
  },

  // Text colors
  text: {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    tertiary: 'text-gray-500 dark:text-gray-500',
    muted: 'text-gray-400 dark:text-gray-600',
    brand: 'text-alumimundo-teal',
    brandHover: 'hover:text-alumimundo-teal',
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    card: 'shadow-sm hover:shadow-lg',
  },

  // Rounded corners
  rounded: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },

  // Spacing
  spacing: {
    cardPadding: 'p-4 sm:p-6',
    cardPaddingSm: 'p-3 sm:p-6',
    sectionGap: 'space-y-4 sm:space-y-6',
    gridGap: 'gap-4 sm:gap-6',
  },

  // Interactive states
  interactive: {
    button: 'transition-all duration-200',
    card: 'transition hover:shadow-lg',
    link: 'hover:underline',
  },

  // Status colors
  status: {
    success: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
  },
} as const

/**
 * Helper function to combine design tokens
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
