## MODIFIED Requirements

### Requirement: Authentication Flow with Onboarding Check MUST

The Google Sign-In process MUST be modified to check for user onboarding completion before redirecting to the main application, with proper handling of loading states to prevent race conditions.

#### Scenario: Authentication with Onboarding Validation

Given a user successfully authenticates with Google
When the authentication response is received
Then immediately check Firestore for a user profile document using their UID
And if the profile exists with onboardingCompleted: true, redirect to /dashboard
And if no profile exists or onboardingCompleted: false, redirect to /onboarding
And prevent direct access to /dashboard without completed onboarding
And ensure loading states are properly handled to prevent premature redirects

#### Scenario: Authentication Guard Updates

Given the (auth)/+layout.svelte authentication guard
When a user becomes authenticated
Then modify the redirect logic to check for onboarding completion
And redirect to /onboarding instead of /dashboard for new users
And maintain existing behavior for users with completed onboarding
And handle loading transitions properly to avoid race conditions

#### Scenario: Loading State Handling

Given the authentication system during profile loading
When the profile data is temporarily undefined during loading transitions
Then the system MUST NOT redirect based on temporary undefined state
And MUST wait for loading to complete before making redirect decisions
And MUST use proper loading state flags to prevent race conditions

### Requirement: Protected Route Validation MUST

The application routes MUST validate that authenticated users have completed onboarding before granting access, with robust loading state management.

#### Scenario: App Layout Protection

Given the (app)/+layout.svelte route guard
When an authenticated user attempts to access app routes
Then verify the user has a valid companyId in their profile
And verify onboardingCompleted is true
And redirect to /onboarding if either condition is not met
And allow access only when both conditions are satisfied
And handle loading states properly to prevent incorrect redirects during initialization

#### Scenario: Onboarding Route Protection

Given the /onboarding route
When an authenticated user accesses it
Then allow access only if onboardingCompleted is false
And redirect to /dashboard if onboarding is already completed
And redirect to /sign-in if user is not authenticated
And handle loading states to prevent premature redirects

## ADDED Requirements

### Requirement: Reactive Profile Management MUST

The userProfile store MUST be properly synchronized with firekitDoc reactive updates to ensure consistent state throughout the application.

#### Scenario: Profile Store Reactivity

Given the userProfile store and firekitDoc integration
When firekitDoc data updates from Firestore
Then the userProfile store MUST immediately reflect the changes
And MUST maintain proper loading state synchronization
And MUST handle error states appropriately
And MUST prevent stale data issues

#### Scenario: Store Initialization

Given the application startup sequence
When firekitDoc initializes for user profile data
Then the userProfile store MUST be properly initialized with loading state
And MUST wait for firekitDoc data before making profile available
And MUST handle initialization failures gracefully
