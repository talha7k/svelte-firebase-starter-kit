## Why

Enhance the application with essential user management features including account settings, notifications, messaging system, file handling capabilities, and UI improvements to create a complete user experience.

## What Changes

- Add account management page with password update and role management
- Implement notifications system with header icon indicator
- Add messaging system with header icon indicator
- Create image resizing and compression utility functions
- Add reusable file upload component
- Replace Lucide Svelte icons with Iconify only
- Update header layout to include notification and messaging icons next to dark mode toggle

## Impact

- Affected specs: user-auth, ui-components
- Affected code: routes/(app)/account/, components/shared/, components/ui/, lib/utils.ts, package.json
- **BREAKING**: Removes Lucide Svelte icon dependencies
