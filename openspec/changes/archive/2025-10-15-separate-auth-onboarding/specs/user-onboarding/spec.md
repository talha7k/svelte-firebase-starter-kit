## ADDED Requirements

### Requirement: User Onboarding Flow MUST

After successful Google authentication, the system MUST check if the user has completed onboarding before granting access to the main application.

#### Scenario: New User Authentication

Given a user signs in with Google for the first time
When the authentication completes successfully
Then the system should check for an existing user profile in Firestore
And if no profile exists, redirect the user to the onboarding page
And prevent access to the main application until onboarding is completed

#### Scenario: Returning User Authentication

Given a user signs in with Google who has previously completed onboarding
When the authentication completes successfully
Then the system should find their existing user profile in Firestore
And redirect them directly to the dashboard
And grant full access to the application

### Requirement: Onboarding Page MUST

The system MUST provide an onboarding page where new users can create or join a company.

#### Scenario: Create New Company

Given a new user lands on the onboarding page
When they choose "Create a New Company"
Then display a form to enter company name
And create a new company document in Firestore
And create the user's profile with admin role and the new companyId
And redirect them to the dashboard after completion

#### Scenario: Join Existing Company

Given a new user lands on the onboarding page
When they choose "Join an Existing Company"  
Then display a form to enter company invite code or select from available companies
And validate the company exists and joining is permitted
And create the user's profile with member role and the existing companyId
And redirect them to the dashboard after completion

### Requirement: User Profile Creation MUST

The system MUST create a comprehensive user profile document when onboarding is completed.

#### Scenario: Profile Document Creation

Given a user completes onboarding (creates or joins company)
When the onboarding process finishes
Then create a user document in Firestore using their Firebase Auth UID as the document ID
And include displayName, email, and photoURL from their Google profile
And include the companyId they are associated with
And include their role (admin or member)
And set onboardingCompleted to true
And include createdAt and updatedAt timestamps
