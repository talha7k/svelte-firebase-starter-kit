## Why

The application currently allows access to protected routes without ensuring users have complete profiles and company affiliations. This creates inconsistent user experiences and potential security issues. Users need a comprehensive authentication and profile management system that guarantees complete onboarding before accessing the application.

## What Changes

**BREAKING**: Implement strict profile validation that prevents access to protected routes without complete user profiles.

- User Sign-Up Flow: Create Firebase Auth user + basic profile document
- User Login Flow: Load and validate profile completeness
- Profile Validation Gate: Only allow dashboard access with complete profiles
- Company Context Initialization: Only load company data for complete profiles
- Account Page Enhancement: Display company information with loading/error states
- Sidebar Enhancement: Show company context across the application

## Impact

- Affected specs: user-auth, user-onboarding, account-management, app-navigation
- Affected code: All authentication flows, route guards, user stores, account page, sidebar
- **BREAKING**: Users without complete profiles cannot access protected routes
