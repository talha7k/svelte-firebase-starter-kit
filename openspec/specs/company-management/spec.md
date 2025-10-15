## Purpose

The company-management capability handles the creation, management, and validation of company entities, including user-company relationships and access controls within the application.
## Requirements
### Requirement: Company Data Model MUST

The system MUST maintain a companies collection to store company information and establish relationships with users.

#### Scenario: Company Creation

Given a user chooses to create a new company during onboarding
When they submit the company creation form
Then create a new document in the companies collection
And generate a unique companyId as the document ID
And store the companyName, ownerUid (creator's UID), and timestamps
And return the companyId for user profile association

#### Scenario: Company Retrieval

Given a user needs to access company information
When the system queries for their company data
Then retrieve the company document using the user's companyId
And return the company information for display in the application

### Requirement: Company Membership Management MUST

The system MUST manage user-company relationships and enforce proper access controls.

#### Scenario: Admin Privileges

Given a user with admin role for a company
When they perform company-related operations
Then allow full access to company management features
And permit adding/removing users from the company
And enable company settings modifications

#### Scenario: Member Privileges

Given a user with member role for a company
When they access company features
Then allow read access to company information
And restrict company management operations
And prevent adding/removing other users

### Requirement: Company Joining Validation MUST

The system MUST validate and control how users join existing companies.

#### Scenario: Invite Code Joining

Given a user wants to join an existing company
When they enter a company invite code
Then validate the invite code matches an existing company
And verify the company allows new members
And create the user profile with member role and the company's ID

#### Scenario: Company Discovery

Given a user needs to find companies to join
When they search for available companies
Then display companies that allow public joining
Or show companies where they have valid invites
And prevent joining companies that are closed to new members

### Requirement: Company Context Initialization MUST

The company context MUST be properly initialized and synchronized with user profile data to ensure company information is available when needed in the application.

#### Scenario: Reactive Company Context

Given a user with a companyId in their profile
When the user profile loads successfully
Then the company context MUST automatically initialize with the company data
And MUST stay synchronized with profile updates
And MUST handle cases where companyId changes
And MUST provide proper loading states during company data retrieval

#### Scenario: Company Data Availability

Given the application dashboard or company-related features
When the user navigates to these areas
Then company data MUST already be loaded and available
And MUST not cause additional loading delays
And MUST handle company data errors gracefully
And MUST provide fallback states when company data is unavailable

#### Scenario: Company Context Error Handling

Given errors during company data loading
When a company document fails to load or doesn't exist
Then the company context MUST handle the error appropriately
And MUST provide meaningful error states
And MUST allow retry mechanisms for failed loads
And MUST not break the overall application flow

### Requirement: Company-Profile Synchronization MUST

The relationship between user profiles and company data MUST be properly maintained and synchronized throughout the application lifecycle.

#### Scenario: Profile-Company Data Consistency

Given changes to user profile or company data
When either entity is updated
Then the related entity MUST reflect changes appropriately
And MUST maintain data consistency across the application
And MUST handle cascading updates correctly
And MUST prevent stale data issues

#### Scenario: Company Access Validation

Given user access to company features
When the user attempts to access company-specific functionality
Then validate the user's company affiliation in real-time
And ensure company data is available before granting access
And handle cases where company access becomes invalid
And redirect appropriately if company access is lost

