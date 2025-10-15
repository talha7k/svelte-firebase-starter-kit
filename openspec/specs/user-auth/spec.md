## Requirements

### Requirement: Authentication Flow with Onboarding Check MUST

The Google Sign-In process MUST be modified to check for user onboarding completion before redirecting to the main application.

#### Scenario: Authentication with Onboarding Validation

Given a user successfully authenticates with Google
When the authentication response is received
Then immediately check Firestore for a user profile document using their UID
And if the profile exists with onboardingCompleted: true, redirect to /dashboard
And if no profile exists or onboardingCompleted: false, redirect to /onboarding
And prevent direct access to /dashboard without completed onboarding

#### Scenario: Authentication Guard Updates

Given the (auth)/+layout.svelte authentication guard
When a user becomes authenticated
Then modify the redirect logic to check for onboarding completion
And redirect to /onboarding instead of /dashboard for new users
And maintain existing behavior for users with completed onboarding

### Requirement: Protected Route Validation MUST

The application routes MUST validate that authenticated users have completed onboarding before granting access.

#### Scenario: App Layout Protection

Given the (app)/+layout.svelte route guard
When an authenticated user attempts to access app routes
Then verify the user has a valid companyId in their profile
And verify onboardingCompleted is true
And redirect to /onboarding if either condition is not met
And allow access only when both conditions are satisfied

#### Scenario: Onboarding Route Protection

Given the /onboarding route
When an authenticated user accesses it
Then allow access only if onboardingCompleted is false
And redirect to /dashboard if onboarding is already completed
And redirect to /sign-in if user is not authenticated

### Requirement: User Profile Extension MUST

The UserProfile type MUST be extended to support company relationships and onboarding status.

#### Scenario: Enhanced User Profile

Given the UserProfile interface in lib/types/user.ts
When defining the user data structure
Then add companyId field of type string | null
And add onboardingCompleted field of type boolean
And maintain backward compatibility with existing user data
And update all references to use the new fields appropriately
