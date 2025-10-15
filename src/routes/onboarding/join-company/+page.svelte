<script lang="ts">
  import CompanyJoiningForm from '$lib/components/auth/company-joining-form.svelte';
  import { firekitUser } from 'svelte-firekit';
  import { goto } from '$app/navigation';

  // Redirect if not authenticated
  $effect(() => {
    if (firekitUser.initialized && !firekitUser.isAuthenticated) {
      goto('/sign-in');
    }
  });
</script>

<main class="flex h-[100dvh] flex-col items-center justify-center">
  <CompanyJoiningForm />
</main>