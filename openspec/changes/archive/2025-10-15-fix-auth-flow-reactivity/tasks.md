## 1. Fix UserProfile Store Reactivity

- [x] 1.1 Update userProfile store to use derived store from firekitDoc
- [x] 1.2 Remove manual store updates and rely on firekitDoc reactivity
- [x] 1.3 Ensure proper loading state propagation from firekitDoc
- [x] 1.4 Add error handling for firekitDoc failures

## 2. Fix Auth Layout Loading State

- [x] 2.1 Update (auth)/+layout.svelte to handle loading transitions properly
- [x] 2.2 Add proper loading state checks to prevent premature redirects
- [x] 2.3 Fix condition `profile.data === undefined && !profile.loading` timing issue
- [x] 2.4 Add debugging logs for auth flow transitions

## 3. Improve Company Context Initialization

- [x] 3.1 Remove hasInitializedCompanyContext flag if present
- [x] 3.2 Add retry logic for company context when profile data becomes available
- [x] 3.3 Initialize company context reactively based on firekitDoc changes
- [x] 3.4 Set proper loading states for company context

## 4. Add Debugging and Error Recovery

- [x] 4.1 Add comprehensive logging for auth flow data tracking
- [x] 4.2 Monitor firekitDoc loading and store update timing
- [x] 4.3 Add error recovery mechanisms for failed profile loads
- [x] 4.4 Implement proper cleanup for reactive effects

## 5. Validation and Testing

- [x] 5.1 Test auth flow with various network conditions
- [x] 5.2 Verify no premature redirects during loading states
- [x] 5.3 Ensure company context initializes correctly after profile loads
- [x] 5.4 Run linting and type checking to ensure code quality
