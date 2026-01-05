---
inclusion: fileMatch
fileMatchPattern: "**/*.{tsx,jsx,css}"
---

# UI and Styling Standards

## Component Library

- Use Shadcn UI components as the primary component library
- Place Shadcn UI components in `components/ui/` directory
- Customize Shadcn components through CSS variables and Tailwind classes
- Context: Shadcn UI provides accessible, customizable components that integrate well with Tailwind CSS
- Extend Shadcn components by wrapping them in custom components
- Use composition patterns to combine multiple Shadcn components
- Maintain consistent styling patterns across custom components
- Context: Composition over inheritance provides flexibility while maintaining consistency

## Tailwind CSS

- Use Tailwind CSS classes exclusively for styling
- Avoid custom CSS unless absolutely necessary for complex animations
- Use Tailwind's utility classes for responsive design and state variants
- Context: Utility-first CSS reduces bundle size and provides consistent design tokens
- Implement mobile-first responsive design using Tailwind breakpoints
- Use `sm:`, `md:`, `lg:`, and `xl:` prefixes for responsive variations
- Test designs across different screen sizes and devices
- Context: Mobile-first design ensures good experience on all devices
- Use Tailwind's built-in spacing, color, and typography scales
- Define custom design tokens in `tailwind.config.js` when needed
- Maintain consistency by using the same tokens across components
- Context: Design tokens ensure visual consistency and make design changes easier

## Dark Mode

- Use dark mode as the primary theme with light mode as alternative
- Implement theme switching using Tailwind's dark mode utilities
- Use appropriate color schemes that work well in both themes
- Context: Dark mode reduces eye strain and is preferred by many developers
- Ensure sufficient color contrast in both light and dark themes
- Test color combinations for accessibility compliance
- Provide alternative indicators beyond color for important information
- Context: Color accessibility ensures usability for users with visual impairments

## Brand Color System

- Use the established brand color palette consistently across all components:
  - Primary: Indigo (#4F46E5 light / #818CF8 dark)
  - Secondary: Violet (#7C3AED light / #A78BFA dark)
  - Complementary: Cyan (#06B6D4)
- Apply gradient backgrounds using brand colors for visual hierarchy
- Use `.text-gradient` utility class for gradient text effects on headings
- Use `.card-gradient` and `.card-gradient-hover` for card backgrounds
- Define brand colors as CSS custom properties for theme consistency
- Context: Consistent brand colors create visual identity and improve recognition

## Layout and Spacing

- Use CSS Grid for two-dimensional layouts
- Use Flexbox for one-dimensional layouts and component alignment
- Leverage Tailwind's grid and flex utilities for consistent layouts
- Context: Modern CSS layout methods provide flexible, responsive designs
- Use Tailwind's spacing scale for consistent margins and padding
- Maintain consistent spacing patterns across similar components
- Use logical spacing that follows visual hierarchy principles
- Context: Consistent spacing improves visual coherence and user experience

## Typography

- Establish clear typography hierarchy using Tailwind's text utilities
- Use consistent font sizes, weights, and line heights
- Ensure good readability across different screen sizes
- Context: Good typography improves readability and visual hierarchy
- Maintain sufficient contrast ratios for text readability
- Use appropriate font sizes for different content types
- Provide text alternatives for non-text content
- Context: Text accessibility ensures content is readable by all users

## Performance Optimization

- Use Tailwind's purge functionality to remove unused CSS
- Minimize custom CSS to reduce bundle size
- Use CSS-in-JS sparingly and only when necessary
- Context: Optimized CSS improves page load times and performance
- Use Next.js Image component for automatic image optimization
- Implement proper alt text for all images
- Use appropriate image formats (WebP, AVIF) when supported
- Context: Image optimization significantly improves page performance

## Animation and Interactions

- Use subtle animations to enhance user experience
- Implement hover and focus states for interactive elements
- Use Tailwind's transition utilities for smooth animations
- Context: Well-designed micro-interactions improve perceived performance and usability
- Respect user preferences for reduced motion using `prefers-reduced-motion` media query
- Provide alternatives to motion-based interactions
- Ensure animations don't interfere with screen readers
- Context: Motion accessibility ensures usability for users with vestibular disorders
- Use canvas-based animations (like PixelParticles) for complex visual effects
- Implement animation cleanup in useEffect return functions to prevent memory leaks
- Keep particle counts reasonable based on viewport size for performance
- Context: Canvas animations provide smooth visuals without impacting DOM performance

## Component Styling Patterns

- Create reusable styling patterns through component composition
- Use consistent naming conventions for style variants
- Document styling patterns for team consistency
- Context: Consistent styling patterns improve maintainability and design coherence
- Implement style variants using conditional classes or variant APIs
- Use TypeScript to enforce valid variant combinations
- Provide sensible defaults for component variants
- Context: Style variants provide flexibility while maintaining consistency
- Use type-specific gradient backgrounds for content cards (CompactCard pattern)
- Apply transform scale effects on hover for interactive card elements
- Use backdrop-blur for overlay and navigation components
- Context: Consistent interaction patterns improve user experience and learnability

## Layout Components

- Use sticky positioning for navigation headers with backdrop blur
- Implement responsive navigation with hidden elements on mobile
- Structure footer with grid layout for link sections
- Use container with max-width constraints for content centering
- Context: Consistent layout patterns ensure visual coherence across pages
- Create hero sections with relative positioning for layered effects
- Use gradient overlays for visual depth in hero backgrounds
- Implement CTAs with gradient backgrounds for visual prominence
- Context: Hero sections establish visual hierarchy and guide user attention