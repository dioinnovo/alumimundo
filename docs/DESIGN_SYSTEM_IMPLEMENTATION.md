# Alumimundo Design System Implementation Guide

## Overview

This design system ensures consistency across the Alumimundo AI Platform through centralized design tokens and reusable components.

## Core Principles

1. **Consistency**: All UI elements follow the same visual language
2. **Accessibility**: Proper dark mode support with WCAG-compliant contrast ratios
3. **Reusability**: Components built from design tokens, not hardcoded values
4. **Maintainability**: Single source of truth for design decisions

## Design Tokens

Location: `src/lib/design-tokens.ts`

### Usage

```tsx
import { designTokens, cn } from '@/lib/design-tokens'

// Use design tokens directly
<div className={designTokens.backgrounds.card}>...</div>

// Combine multiple tokens
<div className={cn(
  designTokens.backgrounds.card,
  designTokens.borders.card,
  designTokens.rounded.md
)}>...</div>
```

### Available Tokens

#### Borders
```typescript
borders: {
  card: 'border border-slate-200 dark:border-gray-700',
  cardHover: 'hover:border-alumimundo-teal',
  input: 'border border-gray-200 dark:border-gray-700',
  divider: 'border-gray-200 dark:border-gray-700',
  dividerSubtle: 'border-gray-100 dark:border-gray-800',
}
```

#### Backgrounds
```typescript
backgrounds: {
  card: 'bg-white dark:bg-gray-800',
  cardSecondary: 'bg-gray-50 dark:bg-gray-700',
  cardHover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
  page: 'bg-gray-50 dark:bg-gray-900',
  overlay: 'bg-white/80 dark:bg-gray-900/80',
}
```

#### Text Colors
```typescript
text: {
  primary: 'text-gray-900 dark:text-gray-100',
  secondary: 'text-gray-600 dark:text-gray-400',
  tertiary: 'text-gray-500 dark:text-gray-500',
  muted: 'text-gray-400 dark:text-gray-600',
  brand: 'text-alumimundo-teal',
  brandHover: 'hover:text-alumimundo-teal',
}
```

#### Shadows
```typescript
shadows: {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  card: 'shadow-sm hover:shadow-lg',
}
```

#### Rounded Corners
```typescript
rounded: {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
}
```

#### Spacing
```typescript
spacing: {
  cardPadding: 'p-4 sm:p-6',
  cardPaddingSm: 'p-3 sm:p-6',
  sectionGap: 'space-y-4 sm:space-y-6',
  gridGap: 'gap-4 sm:gap-6',
}
```

#### Status Colors
```typescript
status: {
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  warning: { ... },
  error: { ... },
  info: { ... },
}
```

## Components

### Card Component

The Card component automatically uses design tokens for consistent theming.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

// Basic usage
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>

// With custom hover behavior
<Card hover={false}>
  {/* Card without hover effect */}
</Card>
```

## Migration Guide

### Before (Manual Border Updates)
```tsx
// ❌ Manual dark mode borders - requires updating everywhere
<div className="bg-white dark:bg-gray-800 border border-slate-200 p-4">
  ...
</div>
```

### After (Design Tokens)
```tsx
// ✅ Using design tokens - updates automatically everywhere
<Card className={designTokens.spacing.cardPadding}>
  ...
</Card>

// Or even simpler with Card component
<Card>
  ...
</Card>
```

## Best Practices

### DO ✅

1. **Use design tokens for all theming**
   ```tsx
   <div className={designTokens.backgrounds.card}>...</div>
   ```

2. **Use Card component for consistent cards**
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>KPI Title</CardTitle>
     </CardHeader>
   </Card>
   ```

3. **Combine tokens with cn() helper**
   ```tsx
   <div className={cn(
     designTokens.backgrounds.card,
     designTokens.borders.card,
     'custom-class'
   )}>...</div>
   ```

### DON'T ❌

1. **Don't hardcode dark mode classes**
   ```tsx
   // ❌ BAD
   <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700">
   ```

2. **Don't use inline styles for theme-dependent values**
   ```tsx
   // ❌ BAD
   <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}>
   ```

3. **Don't create one-off components without tokens**
   ```tsx
   // ❌ BAD
   <div className="bg-white rounded-xl shadow-sm border border-slate-200">

   // ✅ GOOD
   <Card>
   ```

## Adding New Tokens

When you need a new design pattern:

1. Add it to `design-tokens.ts`:
```typescript
export const designTokens = {
  // ... existing tokens
  newCategory: {
    newToken: 'class-with-dark-mode dark:dark-mode-class',
  },
}
```

2. Use it in components:
```tsx
<div className={designTokens.newCategory.newToken}>
```

3. Document it in this guide

## Component Patterns

### KPI Card Pattern
```tsx
<Card className={designTokens.spacing.cardPaddingSm}>
  <div className="flex justify-between items-start">
    <div>
      <p className={designTokens.text.secondary}>KPI Title</p>
      <p className={cn('text-3xl font-bold', designTokens.text.primary)}>
        Value
      </p>
    </div>
    <div className={designTokens.backgrounds.cardSecondary}>
      <Icon />
    </div>
  </div>
</Card>
```

### Section Container Pattern
```tsx
<div className={designTokens.spacing.sectionGap}>
  <Card className={designTokens.spacing.cardPadding}>
    <CardHeader>
      <CardTitle>Section Title</CardTitle>
    </CardHeader>
    <CardContent>
      ...
    </CardContent>
  </Card>
</div>
```

## Future Enhancements

- [ ] Add animation tokens
- [ ] Create button variants with design tokens
- [ ] Add form input components with design tokens
- [ ] Create status badge component
- [ ] Add modal/dialog with design tokens
