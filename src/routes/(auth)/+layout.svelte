<script lang="ts">
	import { goto } from '$app/navigation';
	import { firekitUser, firekitDoc } from 'svelte-firekit';
	import { userProfile } from '$lib/stores/user';
	import { validateUserState } from '$lib/utils/auth';
	import { Spinner } from '$lib/components/ui/spinner';
	import type { UserProfile } from '$lib/types/user';

	let { children } = $props();

	// Track if we're validating the user's profile
	let isValidatingProfile = $derived(firekitUser.initialized && firekitUser.isAuthenticated);

	$effect(() => {
		if (firekitUser.initialized && firekitUser.isAuthenticated && firekitUser.user?.uid) {
			// Load user profile directly to make routing decisions
			const doc = firekitDoc<UserProfile>(`users/${firekitUser.user.uid}`);

			$effect(() => {
				// Don't make routing decisions while profile is still loading
				if (doc.loading) {
					console.log('[Auth Layout] Profile still loading, waiting...');
					return;
				}

				console.log('[Auth Layout] Profile loaded, validating state:', {
					hasData: !!doc.data,
					onboardingCompleted: doc.data?.onboardingCompleted,
					hasCompanyId: !!doc.data?.companyId,
					error: doc.error
				});

				const validation = validateUserState(firekitUser.user, doc.data ?? undefined);

				if (validation.isValid) {
					// User is fully set up, redirect to dashboard
					console.log('[Auth Layout] User is valid, redirecting to dashboard');
					goto('/dashboard');
				} else if (validation.needsOnboarding) {
					// User needs onboarding
					console.log('[Auth Layout] User needs onboarding, redirecting to onboarding');
					goto('/onboarding');
				}
				// If not valid but doesn't need onboarding, stay on auth pages
			});
		}
	});
</script>

{#if firekitUser.initialized && !firekitUser.isAuthenticated}
	<main class="flex h-[100dvh] flex-col items-center justify-center">
		{@render children()}
	</main>
{:else if isValidatingProfile}
	<main class="flex h-[100dvh] flex-col items-center justify-center">
		<div class="flex flex-col items-center gap-4">
			<Spinner class="h-8 w-8" />
			<p class="text-sm text-muted-foreground">Validating your account...</p>
		</div>
	</main>
{/if}
