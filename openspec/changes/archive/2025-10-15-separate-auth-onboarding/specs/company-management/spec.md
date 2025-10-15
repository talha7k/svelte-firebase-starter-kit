## ADDED Requirements

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
