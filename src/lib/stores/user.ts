import { writable, derived } from "svelte/store";
import type { UserProfile } from "$lib/types/user";
import type { Company } from "$lib/types/company";
import { isProfileComplete, hasCompanyAffiliation } from "$lib/utils/user";
import { firekitDoc } from "svelte-firekit";

type UserProfileStore = {
  data: UserProfile | undefined;
  loading: boolean;
  error: any;
  update: (data: Partial<UserProfile>) => Promise<void>;
};

export const userProfile = writable<UserProfileStore>({
  data: undefined,
  loading: true,
  error: null,
  update: async () => {},
});

// Derived store for profile validation status
export const profileValidation = derived(userProfile, ($userProfile) => ({
  isComplete: isProfileComplete($userProfile.data),
  hasCompany: hasCompanyAffiliation($userProfile.data),
  isLoading: $userProfile.loading,
  error: $userProfile.error,
}));

// Derived store for company data - loads when user has company affiliation
export const userCompany = derived(userProfile, ($userProfile) => {
  const companyId = $userProfile.data?.companyId;

  if (!companyId) {
    return {
      data: undefined,
      loading: false,
      error: null,
    };
  }

  // Load company data using firekit
  const companyDoc = firekitDoc<Company>(`companies/${companyId}`);

  return {
    data: companyDoc.data,
    loading: companyDoc.loading,
    error: companyDoc.error,
  };
});
