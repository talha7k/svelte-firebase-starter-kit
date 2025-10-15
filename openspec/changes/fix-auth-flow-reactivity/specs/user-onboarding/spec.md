## MODIFIED Requirements

### Requirement: User Onboarding Flow MUST

After successful Google authentication, the system MUST check if the user has completed onboarding before granting access to the main application, with a seamless loading experience that prevents flash of incorrect pages.

#### Scenario: New User Authentication

Given a user signs in with Google for the first time
When the authentication completes successfully
Then the system should display a loading state while checking for existing user profile
And if no profile exists, redirect the user to the onboarding page
And prevent access to the main application until onboarding is completed
And MUST NOT show a flash of the onboarding page for returning users

#### Scenario: Returning User Authentication

Given a user signs in with Google who has previously completed onboarding
When the authentication completes successfully
Then the system should display a unified loading state during profile validation
And find their existing user profile in Firestore
And redirect them directly to the dashboard without showing onboarding page
And grant full access to the application
And MUST prevent any flash of the onboarding page during loading

#### Scenario: Seamless Loading Experience

Given any user authenticating (new or returning)
When the authentication process completes
Then the system MUST display a loading indicator instead of routing to any page
And MUST wait for profile data to be fully loaded before making routing decisions
And MUST prevent page flashes that create poor user experience
And MUST provide smooth transitions between authentication and destination

## ADDED Requirements

### Requirement: Loading State Management MUST

The system MUST provide robust loading state management to prevent page flashes and ensure smooth user experience during authentication flow.

#### Scenario: Authentication Loading State

Given the moment after user completes Google authentication
When the system is validating user profile and onboarding status
Then display a centralized loading component
And prevent any route changes until validation is complete
And ensure the loading state covers the entire viewport
And provide clear feedback that the system is working

#### Scenario: Profile Loading Coordination

Given the userProfile store and firekitDoc integration
When profile data is being loaded from Firestore
Then coordinate all loading states to prevent premature routing
And ensure all necessary data is available before navigation decisions
And handle loading errors gracefully with appropriate fallbacks

#### Scenario: Route Decision Timing

Given the authentication and profile loading process
When determining whether to show onboarding or dashboard
Then wait until all profile data is available and validated
And make routing decision only after loading is complete
And prevent intermediate states that cause page flashes
