## MODIFIED Requirements

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
