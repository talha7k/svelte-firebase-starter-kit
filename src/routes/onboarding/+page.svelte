<script lang="ts">
  import OnboardingWelcome from '$lib/components/auth/onboarding-welcome.svelte';
  import { firekitUser } from 'svelte-firekit';
  import { goto } from '$app/navigation';
  import { userProfile } from '$lib/stores/user';

  // Redirect if not authenticated
  $effect(() => {
    if (firekitUser.initialized && !firekitUser.isAuthenticated) {
      goto('/sign-in');
    }
  });

  // Redirect if already completed onboarding
  $effect(() => {
    const unsubscribe = userProfile.subscribe(profile => {
      if (profile.data && profile.data.onboardingCompleted && profile.data.companyId) {
        goto('/dashboard');
      }
    });
    return unsubscribe;
  });
</script>

<main class="flex h-[100dvh] flex-col items-center justify-center">
  <OnboardingWelcome />
</main>