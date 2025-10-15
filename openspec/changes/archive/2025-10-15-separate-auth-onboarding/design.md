## Architecture Overview

The solution separates authentication from user onboarding by implementing a two-phase flow:

1. **Authentication Phase**: Firebase Auth verifies user identity
2. **Onboarding Phase**: Application checks for complete user profile and company association

## Database Structure

### Users Collection

```
users/{user.uid}
├── displayName: string (from Google)
├── email: string (from Google)
├── photoURL: string (from Google)
├── createdAt: Timestamp
├── updatedAt: Timestamp
├── companyId: string (foreign key to companies collection)
├── role: "admin" | "member"
└── onboardingCompleted: boolean
```

### Companies Collection

```
companies/{companyId}
├── companyName: string
├── ownerUid: string (references users collection)
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

## Flow Logic

### Authentication Flow

1. User clicks "Sign in with Google"
2. Firebase Auth popup authenticates user
3. `handleUserOnboarding()` function checks Firestore for user profile
4. **If profile exists**: Redirect to dashboard
5. **If no profile**: Redirect to onboarding screen

### Onboarding Flow

1. New user lands on `/onboarding` page
2. User chooses "Create Company" or "Join Company"
3. **Create Company**:
   - Create company document
   - Create user profile with new companyId and admin role
   - Redirect to dashboard
4. **Join Company**:
   - Validate company invite/selection
   - Create user profile with existing companyId and member role
   - Redirect to dashboard

## Implementation Strategy

### Authentication Guard Updates

- Modify `(auth)/+layout.svelte` to check for onboarding completion
- Update `(app)/+layout.svelte` to verify user has companyId
- Add new route `/onboarding` for new user setup

### Component Changes

- Update `google-sign-in.svelte` to use new onboarding handler
- Create onboarding components for company creation/joining
- Add company management components for admins

### State Management

- Extend `UserProfile` type to include `companyId` and `onboardingCompleted`
- Update user store to handle onboarding state
- Add company store for company data management

## Security Considerations

- All company operations require proper authentication
- Company joining requires validation (invite codes, admin approval)
- Firestore security rules enforce user-company relationships
- Server-side validation for all company operations

## Performance Implications

- Additional Firestore read during authentication (minimal impact)
- User profile data cached in app layout for efficient access
- Company data loaded on-demand when needed
