## Why

The current authentication flow directly redirects users to the dashboard after Google Sign-In without verifying if they have completed necessary onboarding steps like company selection. This creates a broken user experience where authenticated users may access the application without proper profile setup, leading to undefined behavior and missing data relationships.

## What Changes

- Separate authentication logic from user onboarding flow
- Add user profile validation after successful authentication
- Create onboarding screen for new users to create or join companies
- Implement company management system with proper user-company relationships
- Update authentication redirects to check for completed onboarding
- Add database structure for users and companies collections

## Impact

- Affected specs: user-auth, user-onboarding, company-management
- Affected code: components/auth/, routes/(auth)/, routes/(app)/, lib/types/user.ts
- **BREAKING**: Changes authentication flow and user data structure
- **NEW**: Adds company management and onboarding functionality
