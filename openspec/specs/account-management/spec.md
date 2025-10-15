## Purpose

The account-management capability provides users with tools to manage their personal information, security settings, and view their company affiliation within the application.

## Requirements

### Requirement: Account Settings Page

The system SHALL provide a dedicated account settings page for authenticated users to manage their profile, security settings, and display company information.

#### Scenario: Access account settings

- **WHEN** a logged-in user navigates to /account
- **THEN** display the account settings page with personal information, security options, and current company details

#### Scenario: Update personal information

- **WHEN** user updates their name or email in the account form
- **THEN** save changes to Firebase Auth and show success message

#### Scenario: View company information

- **WHEN** user views their account settings
- **THEN** display their current company name and role
- **AND** show company information in a dedicated section

### Requirement: Profile Validation Gates

The system SHALL enforce complete user profiles before allowing access to account settings and other protected routes.

#### Scenario: Access account settings with complete profile

- **WHEN** user with complete profile navigates to /account
- **THEN** display full account settings page with all sections available

#### Scenario: Attempt access with incomplete profile

- **WHEN** user with incomplete profile attempts to access /account
- **THEN** redirect to onboarding flow to complete profile
- **AND** prevent access until profile is complete

#### Scenario: Profile validation during account updates

- **WHEN** user updates account information
- **THEN** validate profile completeness after changes
- **AND** ensure company affiliation remains intact
