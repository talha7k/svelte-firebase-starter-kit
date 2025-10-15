<script lang="ts">
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import * as v from 'valibot';

  import Button from '$lib/components/ui/button/button.svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import Icon from '@iconify/svelte';

  const joinSchema = v.object({
    inviteCode: v.pipe(v.string(), v.minLength(1, 'Invite code is required'), v.regex(/^[A-Z0-9]{8}$/, 'Invalid invite code format')),
  });

  let formData = $state({
    inviteCode: '',
  });

  let errors = $state({
    inviteCode: '',
  });

  let isSubmitting = $state(false);

  async function handleSubmit(event: Event) {
    event.preventDefault();
    isSubmitting = true;

    // Clear previous errors
    errors = { inviteCode: '' };

    try {
      // Validate form data
      const result = v.safeParse(joinSchema, formData);
      if (!result.success) {
        // Set validation errors
        for (const issue of result.issues) {
          const field = issue.path?.[0]?.key as keyof typeof errors;
          if (field && field in errors) {
            errors[field] = issue.message;
          }
        }
        return;
      }

      // Join company
      const response = await fetch('/api/companies/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: formData.inviteCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join company');
      }

      toast.success('Successfully joined company!');
      goto('/dashboard');
    } catch (error) {
      console.error('Company joining error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to join company');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle class="flex items-center gap-2">
      <Icon icon="lucide:users" class="w-5 h-5" />
      Join a Company
    </CardTitle>
  </CardHeader>
  <CardContent>
    <form onsubmit={handleSubmit} class="space-y-4">
      <div class="space-y-2">
        <label for="inviteCode" class="text-sm font-medium">Invite Code *</label>
        <Input
          id="inviteCode"
          bind:value={formData.inviteCode}
          placeholder="Enter company invite code"
          disabled={isSubmitting}
          required
        />
        {#if errors.inviteCode}
          <p class="text-sm text-destructive">{errors.inviteCode}</p>
        {/if}
        <p class="text-xs text-muted-foreground">
          Ask your company administrator for an invite code.
        </p>
      </div>

      <div class="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onclick={() => goto('/onboarding')}
          class="flex-1"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting} class="flex-1">
          {#if isSubmitting}
            <Icon icon="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
            Joining...
          {:else}
            Join Company
          {/if}
        </Button>
      </div>
    </form>
  </CardContent>
</Card>