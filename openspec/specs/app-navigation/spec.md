## Purpose

The app-navigation capability manages the application's navigation structure, including sidebar display, company context visualization, and responsive navigation elements.

## Requirements

### Requirement: Sidebar Company Display

The system SHALL display the user's current company information in the application sidebar for consistent organizational context.

#### Scenario: Company name in sidebar

- **WHEN** user views the application sidebar
- **THEN** display the current company name prominently in the sidebar header
- **AND** show company information across all protected routes

#### Scenario: Responsive sidebar display

- **WHEN** viewing sidebar on different screen sizes
- **THEN** adapt company display layout appropriately
- **AND** maintain readability and visual hierarchy

### Requirement: Company Context Initialization

The system SHALL initialize and validate company context before displaying navigation elements.

#### Scenario: Initialize company context on app load

- **WHEN** user loads the application with complete profile
- **THEN** fetch and initialize company data in global state
- **AND** display company information in sidebar immediately

#### Scenario: Handle missing company data

- **WHEN** company data fails to load or is missing
- **THEN** show appropriate error state in sidebar
- **AND** provide option to rejoin or create company

#### Scenario: Validate company context for navigation

- **WHEN** user navigates between protected routes
- **THEN** ensure company context is available and valid
- **AND** maintain consistent company display across all routes
