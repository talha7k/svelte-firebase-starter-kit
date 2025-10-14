<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { NotificationChannel } from '$lib/types/notification';

	export const channels: NotificationChannel[] = [
		{ id: 'email', icon: 'lucide:mail', name: 'Email', description: '', enabled: false, settings: {} },
		{ id: 'desktop', icon: 'lucide:monitor', name: 'Desktop', description: 'Push notification', enabled: false, settings: {} },
		{ id: 'mobile', icon: 'lucide:smartphone', name: 'Mobile', description: 'Push notification', enabled: false, settings: {} }
	];
</script>

<div class="hidden md:block">
	<div class="grid grid-cols-4 items-center gap-4">
		<div>
			<h3 class="text-sm font-medium">Notify me about</h3>
		</div>
		{#each channels as channel}
			<div class="flex flex-col items-center justify-center text-center">
				<Icon icon={channel.icon} class="size-5" />
				<span class="mt-2 text-sm font-medium">{channel.name}</span>
				{#if channel.description}
					<span class="text-xs text-muted-foreground">{channel.description}</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
