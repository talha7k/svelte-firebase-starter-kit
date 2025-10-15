## Context

The current authentication system uses Svelte FireKit for Firebase integration but has timing issues where the userProfile store doesn't stay synchronized with firekitDoc reactive updates. This causes race conditions during loading transitions, particularly in the auth layout where `profile.data === undefined && !profile.loading` can briefly evaluate to true, leading to incorrect redirects.

## Goals / Non-Goals

- Goals: Fix reactive data flow, eliminate race conditions, improve loading state handling
- Non-Goals: Complete rewrite of auth system, changing Firebase integration approach

## Decisions

- Decision: Replace manual userProfile store management with derived store from firekitDoc
  - Rationale: Ensures automatic synchronization with Firebase data
  - Alternatives considered: Manual sync with effects, custom store wrapper
- Decision: Use Svelte 5 runes ($derived, $effect) for reactivity
  - Rationale: Modern Svelte approach, better performance than stores
  - Alternatives considered: Stick with Svelte stores, use custom reactive patterns
- Decision: Add comprehensive debugging for auth flow timing
  - Rationale: Current issues are timing-related, need visibility into data flow
  - Alternatives considered: Silent fixes, minimal logging

## Risks / Trade-offs

- Risk: Changing from stores to runes may affect other components using userProfile
- Mitigation: Maintain backward compatibility by keeping store interface
- Risk: Derived stores may have performance implications
- Mitigation: Profile the changes, optimize if needed
- Trade-off: More complex debugging code vs. better visibility into issues

## Migration Plan

1. Update userProfile store to use derived pattern while maintaining interface
2. Fix auth layout loading conditions with proper state checks
3. Add comprehensive logging to track data flow
4. Test thoroughly with various network conditions
5. Remove debugging logs once issues are resolved

## Open Questions

- Should we migrate completely to runes or maintain store compatibility?
- How much debugging should remain in production vs. development only?
- Are there other components affected by the userProfile store changes?
