<script lang="ts">
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import * as v from 'valibot';

  import Button from '$lib/components/ui/button/button.svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import Icon from '@iconify/svelte';

  const companySchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Company name is required'), v.maxLength(100, 'Company name too long')),
    description: v.optional(v.pipe(v.string(), v.maxLength(500, 'Description too long'))),
  });

  let formData = $state({
    name: '',
    description: '',
  });

  let errors = $state({
    name: '',
    description: '',
  });

  let isSubmitting = $state(false);

  async function handleSubmit(event: Event) {
    event.preventDefault();
    isSubmitting = true;

    // Clear previous errors
    errors = { name: '', description: '' };

    try {
      // Validate form data
      const result = v.safeParse(companySchema, formData);
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

      // Create company
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create company');
      }

      toast.success('Company created successfully!');
      goto('/dashboard');
    } catch (error) {
      console.error('Company creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create company');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle class="flex items-center gap-2">
      <Icon icon="lucide:building-2" class="w-5 h-5" />
      Create Your Company
    </CardTitle>
  </CardHeader>
  <CardContent>
    <form onsubmit={handleSubmit} class="space-y-4">
      <div class="space-y-2">
        <label for="name" class="text-sm font-medium">Company Name *</label>
        <Input
          id="name"
          bind:value={formData.name}
          placeholder="Enter your company name"
          disabled={isSubmitting}
          required
        />
        {#if errors.name}
          <p class="text-sm text-destructive">{errors.name}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <label for="description" class="text-sm font-medium">Description (Optional)</label>
        <Textarea
          id="description"
          bind:value={formData.description}
          placeholder="Brief description of your company"
          rows={3}
          disabled={isSubmitting}
        />
        {#if errors.description}
          <p class="text-sm text-destructive">{errors.description}</p>
        {/if}
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
            Creating...
          {:else}
            Create Company
          {/if}
        </Button>
      </div>
    </form>
  </CardContent>
</Card>