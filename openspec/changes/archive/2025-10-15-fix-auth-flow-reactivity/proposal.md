## Why

The current authentication flow has timing issues where reactive data flow is broken - the userProfile store isn't staying in sync with firekitDoc reactive updates, causing race conditions and incorrect redirects during loading transitions.

## What Changes

- Fix userProfile store to be properly reactive with firekitDoc updates
- Remove problematic initialization flags that prevent re-initialization
- Improve auth layout loading state handling to prevent premature redirects
- Add proper error handling and recovery mechanisms
- Enhance debugging capabilities for auth flow tracking

## Impact

- Affected specs: user-auth, user-onboarding, company-management
- Affected code: src/lib/stores/user.ts, src/routes/(auth)/+layout.svelte, src/routes/(app)/+layout.svelte
- **BREAKING**: Changes auth flow behavior to be more reliable during loading states
