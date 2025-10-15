import type { UserProfile } from "$lib/types/user";

/**
 * Validates if a user profile is complete and ready for full application access
 * @param profile - The user profile to validate
 * @returns true if profile is complete, false otherwise
 */
export function isProfileComplete(
  profile: UserProfile | null | undefined,
): boolean {
  if (!profile) return false;

  // Required fields for complete profile
  const requiredFields = [
    profile.email,
    profile.displayName,
    profile.companyId,
    profile.onboardingCompleted,
  ];

  // Check that all required fields are present and valid
  return requiredFields.every((field) => {
    if (typeof field === "boolean") return field === true;
    if (typeof field === "string") return field.trim().length > 0;
    return false;
  });
}

/**
 * Gets a list of missing fields from an incomplete profile
 * @param profile - The user profile to check
 * @returns array of missing field names
 */
export function getMissingProfileFields(
  profile: UserProfile | null | undefined,
): string[] {
  if (!profile) return ["profile"];

  const missing: string[] = [];

  if (!profile.email || profile.email.trim().length === 0) {
    missing.push("email");
  }

  if (!profile.displayName || profile.displayName.trim().length === 0) {
    missing.push("displayName");
  }

  if (!profile.companyId || profile.companyId.trim().length === 0) {
    missing.push("companyId");
  }

  if (!profile.onboardingCompleted) {
    missing.push("onboardingCompleted");
  }

  return missing;
}

/**
 * Checks if a user profile has company affiliation
 * @param profile - The user profile to check
 * @returns true if user has company affiliation, false otherwise
 */
export function hasCompanyAffiliation(
  profile: UserProfile | null | undefined,
): boolean {
  return !!(profile?.companyId && profile.companyId.trim().length > 0);
}
