## ADDED Requirements

### Requirement: Header Layout Enhancement

The system SHALL update the header layout to include notification and messaging icons alongside existing controls.

#### Scenario: Enhanced header

- **WHEN** user views any page with header
- **THEN** display dark mode toggle, notifications icon, and messaging icon
- **AND** show unread count badges on notification and messaging icons

#### Scenario: Responsive header

- **WHEN** viewing on mobile devices
- **THEN** adapt header layout for smaller screens
- **AND** ensure all icons remain accessible and functional

### Requirement: Icon Library Migration

The system SHALL replace Lucide Svelte icons with Iconify throughout the application.

#### Scenario: Icon replacement

- **WHEN** components use icons
- **THEN** use Iconify components with consistent icon sets
- **AND** maintain visual consistency across the application

#### Scenario: Icon consistency

- **WHEN** selecting icons for features
- **THEN** use consistent icon sets (lucide for UI, heroicons for actions)
- **AND** ensure icons are meaningful and accessible

## REMOVED Requirements

### Requirement: Lucide Svelte Icons

**Reason**: Consolidate to Iconify for consistent icon management and reduce bundle size
**Migration**: Replace all Lucide icon imports with Iconify equivalents

#### Scenario: Lucide removal

- **WHEN** Lucide Svelte dependency is removed
- **THEN** update all component imports to use Iconify
- **AND** remove Lucide from package.json dependencies
