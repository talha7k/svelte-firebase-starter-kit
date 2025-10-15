import { goto } from "$app/navigation";
import { userProfile } from "$lib/stores/user";
import type { UserProfile } from "$lib/types/user";

/**
 * Handles user onboarding flow after authentication
 * Checks if user has completed onboarding and redirects accordingly
 */
export async function handleUserOnboarding(): Promise<void> {
  try {
    // Get user profile from store
    let currentProfile: UserProfile | undefined;
    const unsubscribe = userProfile.subscribe((store) => {
      currentProfile = store.data;
    });
    unsubscribe(); // Immediately unsubscribe after getting current value

    if (!currentProfile) {
      // If no profile exists, user needs onboarding
      console.log("No user profile found, redirecting to onboarding");
      await goto("/onboarding");
      return;
    }

    if (!currentProfile.onboardingCompleted) {
      // User exists but hasn't completed onboarding
      console.log(
        "User profile exists but onboarding not completed, redirecting to onboarding",
      );
      await goto("/onboarding");
      return;
    }

    if (!currentProfile.companyId) {
      // User completed onboarding but no company ID - this shouldn't happen
      console.warn(
        "User completed onboarding but has no company ID, redirecting to onboarding",
      );
      await goto("/onboarding");
      return;
    }

    // User has completed onboarding with company, redirect to dashboard
    console.log("User onboarding complete, redirecting to dashboard");
    await goto("/dashboard");
  } catch (error) {
    console.error("Error handling user onboarding:", error);
    // On error, redirect to onboarding as safe fallback
    await goto("/onboarding");
  }
}

/**
 * Validates user authentication state and profile completeness
 */
export function validateUserState(
  user: any,
  profile: UserProfile | undefined,
): {
  isValid: boolean;
  needsOnboarding: boolean;
  error?: string;
} {
  if (!user) {
    return {
      isValid: false,
      needsOnboarding: false,
      error: "User not authenticated",
    };
  }

  if (!profile) {
    return {
      isValid: false,
      needsOnboarding: true,
      error: "User profile not found",
    };
  }

  if (!profile.onboardingCompleted) {
    return {
      isValid: false,
      needsOnboarding: true,
      error: "Onboarding not completed",
    };
  }

  if (!profile.companyId) {
    return {
      isValid: false,
      needsOnboarding: true,
      error: "No company affiliation",
    };
  }

  return { isValid: true, needsOnboarding: false };
}

/**
 * Checks if a user profile is complete for onboarding
 */
export function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.firstName &&
    profile.lastName &&
    profile.companyId &&
    profile.onboardingCompleted
  );
}

/**
 * Creates a new user profile with default values
 */
export function createDefaultUserProfile(
  uid: string,
  email: string,
  displayName?: string | null,
  photoURL?: string | null,
): Omit<UserProfile, "createdAt" | "updatedAt" | "lastLoginAt"> {
  return {
    uid,
    email,
    displayName: displayName || null,
    photoURL: photoURL || null,
    isActive: true,
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    phoneNumber: "",
    emailNotifications: true,
    pushNotifications: true,
    theme: "system",
    language: "en",
    role: "user",
    permissions: [],
    companyId: undefined,
    onboardingCompleted: false,
    address: undefined,
    metadata: {
      deviceInfo: undefined,
      lastIPAddress: "",
      accountStatus: "active",
    },
  };
}
