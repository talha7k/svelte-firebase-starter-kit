# Project Context

## Purpose

A comprehensive starter template for building full-stack Svelte applications with Firebase integration. This project provides authentication, blog functionality, marketing pages, and a basic app setup with sidebar navigation to accelerate development of modern web applications.

## Tech Stack

- **Svelte**: 5.39.11 (with runes enabled)
- **SvelteKit**: 2.46.5 (full-stack framework)
- **TypeScript**: 5.9.3 (strict mode enabled)
- **Tailwind CSS**: 4.1.14 (styling framework)
- **Firebase**: 12.4.0 (authentication and backend services)
- **Shadcn/Svelte** (bits-ui): 2.11.5 (UI component library)
- **Vite**: 6.3.6 (build tool)
- **Svelte FireKit**: 0.1.9 (Firebase integration)

## Project Conventions

### Code Style

- **Formatting**: Prettier with Svelte and Tailwind plugins
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Component Structure**: Follow atomic design patterns with UI components in `$lib/components/ui/`
- **File Naming**: kebab-case for files and directories
- **Imports**: Use `$lib` alias for internal imports
- **Svelte Conventions**: Runes-based reactivity (`$state`, `$derived`, `$effect`)
- **Icon Usage**: Always use Iconify for icons
  - Import from `@iconify/svelte`: `import { Icon } from '@iconify/svelte'`
  - Use icon names from Iconify sets: `<Icon icon="lucide:home" />`, `<Icon icon="heroicons:user" />`
  - Never use other icon libraries or create custom SVG icons unless absolutely necessary
  - Choose consistent icon sets within the same feature area (e.g., lucide for UI, heroicons for actions)

### Utility Functions

- **Utils Location**: Place all reusable utility functions in `$lib/utils.ts` or organized subdirectories
  - Date utilities: `$lib/utils/date.ts` (formatting, parsing, validation)
  - String utilities: `$lib/utils/string.ts` (formatting, validation, manipulation)
  - Array utilities: `$lib/utils/array.ts` (sorting, filtering, transformations)
  - Validation utilities: `$lib/utils/validation.ts` (common validation patterns)
- **Function Organization**:
  - Export pure functions without side effects
  - Use JSDoc comments for function documentation
  - Include TypeScript types for all parameters and return values
  - Group related functions in the same file
- **Common Utilities**:
  - Date formatting: Use `@internationalized/date` for complex date operations
  - Currency formatting: Create reusable currency formatters
  - URL validation and manipulation
  - File size formatting and validation
  - Text truncation and ellipsis handling
- **Import Patterns**: Import utilities with clear aliases: `import { formatDate, validateEmail } from '$lib/utils'`

### UI Component Conventions

- **Shadcn Components**: Always use shadcn components from `$lib/components/ui/` directory
  - Import individual components: `import { Button } from '$lib/components/ui/button'`
  - Never create custom UI components when shadcn equivalents exist
  - Extend shadcn components only when additional functionality is needed
- **Theme Variables**: Always use CSS custom properties for colors and styling
  - Use semantic color tokens: `bg-primary`, `text-muted-foreground`, `border-border`
  - Avoid hardcoded colors: never use `bg-blue-500`, `text-gray-800` directly
  - Use theme-aware utilities: `bg-background`, `text-foreground`, `border-input`
  - Reference available theme variables in `tailwind.config.ts` and `app.css`
- **Component Composition**:
  - Combine shadcn components for complex UI patterns
  - Use `Card` components for content sections
  - Use `Dialog`/`Sheet` for modals and drawers
  - Use `Form` components with `SuperForms` integration
- **Styling Consistency**:
  - Maintain consistent spacing using Tailwind's spacing scale
  - Use border radius variables: `rounded-lg`, `rounded-md`
  - Apply consistent shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
  - Use transition utilities for smooth interactions

### Architecture Patterns

- **Route Organization**:
  - `(app)/` - Protected application routes with auth guards
  - `(auth)/` - Authentication pages (sign-in, sign-up, forgot-password)
  - `(marketing)/` - Public marketing pages (home, features, pricing, contact)
  - `api/` - Server-side API endpoints
- **Component Architecture**:
  - UI components in `$lib/components/ui/` (shadcn-based)
  - Feature components organized by domain (auth, marketing, app, shared)
- **State Management**: Svelte runes for local state, Firebase for auth state
- **Form Handling**: SvelteKit SuperForms with Zod validation
- **Styling**: Tailwind CSS with CSS custom properties for theming

### Server-Side Patterns

- **Firebase Admin SDK**: Use server-side Firebase Admin for secure operations
  - Initialize in server hooks or API routes
  - Environment variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
  - Use for: token verification, user management, database operations with admin privileges
- **API Routes**: Place in `src/routes/api/` with `+server.ts` files
  - Use HTTP method handlers (GET, POST, PUT, DELETE)
  - Implement proper error handling and status codes
  - Validate requests with Zod schemas
- **Data Fetching**:
  - Use `load` functions for server-side data fetching
  - Implement caching strategies for frequently accessed data
  - Use `await` for async operations in load functions
- **Authentication Context**:
  - Server-side: Verify tokens using Firebase Admin SDK
  - Client-side: Use Firebase Client SDK for UI state
  - Pass user data via load functions to protected routes

### Database Patterns

- **Firestore Structure**:
  - Collections: `users`, `posts`, `sessions` (as needed)
  - Document IDs: Use Firebase Auth UIDs for user documents
  - Security Rules: Implement proper Firestore security rules
- **Data Validation**:
  - Server-side: Zod schemas for API input validation
  - Client-side: Form validation with SuperForms
  - Database: Use Firestore security rules as final validation layer
- **Real-time Updates**:
  - Use Firestore onSnapshot for real-time features
  - Clean up listeners in component unmount
  - Consider server-sent events for specific use cases

### Security Patterns

- **Environment Variables**:
  - Client-side: `PUBLIC_*` prefix for public variables
  - Server-side: Private variables without prefix for secrets
  - Never expose private keys or service account data to client
- **Authentication Guards**:
  - Implement in `+layout.ts` files for route groups
  - Redirect unauthenticated users to sign-in page
  - Use URL parameters for post-authentication redirects
- **Input Sanitization**:
  - Validate all user inputs with Zod schemas
  - Sanitize HTML content for blog posts
  - Use Content Security Policy headers

### Performance Patterns

- **Code Splitting**:
  - Use dynamic imports for large components
  - Leverage SvelteKit's automatic route-based splitting
  - Lazy load non-critical features
- **Image Optimization**:
  - Use Firebase Storage for image uploads
  - Implement image resizing and compression
  - Use responsive images with srcset
- **Caching Strategy**:
  - Use SvelteKit's cache headers for static assets
  - Implement browser caching for API responses
  - Consider CDN for static assets
- **Bundle Optimization**:
  - Analyze bundle size regularly
  - Tree-shake unused dependencies
  - Use Vite's build analysis tools

### Testing Strategy

- **Linting**: Prettier for code formatting (`bun run lint`)
- **Type Checking**: Svelte Check with TypeScript (`bun run check`)
- **Build Validation**: Vite build process (`bun run build`)
- **OpenSpec Integration**: Use OpenSpec for significant changes (features, breaking changes, architecture)

## Domain Context

This is a web application starter kit focused on:

- **User Authentication**: Firebase-based auth with email/password and Google sign-in
- **Content Management**: MDsveX-powered blog system with frontmatter metadata
- **Marketing Pages**: Pre-built landing pages for SaaS-style applications
- **Application Shell**: Sidebar navigation with protected routes
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## External Dependencies

- **Firebase Services**: Authentication, Firestore (if used), Storage (if used)
- **Shadcn Registry**: Component library accessed via https://shadcn-svelte.com/registry
- **Icon Libraries**: Iconify for icons
- **Form Validation**: Zod schemas for runtime type validation
- **Date Handling**: @internationalized/date for date utilities
