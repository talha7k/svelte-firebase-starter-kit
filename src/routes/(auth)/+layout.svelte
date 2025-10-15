<script>
	import { goto } from '$app/navigation';
	import { firekitUser } from 'svelte-firekit';
	import { userProfile } from '$lib/stores/user';
	import { validateUserState } from '$lib/utils/auth';

	let { children } = $props();

	$effect(() => {
		if (firekitUser.initialized && firekitUser.isAuthenticated) {
			// If user is authenticated, validate their state
			const unsubscribe = userProfile.subscribe(profile => {
				const validation = validateUserState(firekitUser.user, profile.data);

				if (validation.isValid) {
					// User is fully set up, redirect to dashboard
					goto('/dashboard');
				} else if (validation.needsOnboarding) {
					// User needs onboarding
					goto('/onboarding');
				}
				// If not valid but doesn't need onboarding, stay on auth pages
			});
			return unsubscribe;
		}
	});
</script>

{#if firekitUser.initialized && !firekitUser.isAuthenticated}
	<main class="flex h-[100dvh] flex-col items-center justify-center">
		{@render children()}
	</main>
{/if}
