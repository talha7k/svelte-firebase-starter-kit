<script lang="ts">
	import { userCompany } from '$lib/stores/user';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { AlertCircle } from '@lucide/svelte';

	const companyData = $derived($userCompany.data);
	const isLoading = $derived($userCompany.loading);
	const error = $derived($userCompany.error);
</script>

<div class="flex flex-col gap-4">
	{#if isLoading}
		<div class="space-y-2">
			<Skeleton class="h-4 w-24" />
			<Skeleton class="h-6 w-48" />
		</div>
	{:else if error}
		<div class="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
			<AlertCircle class="h-4 w-4" />
			<span>Unable to load company information. Please try refreshing the page.</span>
		</div>
	{:else if companyData}
		<div class="grid grid-cols-4">
			<span class="font-normal text-muted-foreground">Company</span>
			<div class="col-span-3">
				<p class="text-sm font-medium">{companyData.name}</p>
				<p class="text-xs text-muted-foreground">
					Member since {new Date(companyData.createdAt.toDate()).toLocaleDateString()}
				</p>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-4">
			<span class="font-normal text-muted-foreground">Company</span>
			<div class="col-span-3">
				<p class="text-sm text-muted-foreground">No company affiliation</p>
			</div>
		</div>
	{/if}
</div>