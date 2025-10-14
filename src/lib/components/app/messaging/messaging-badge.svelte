<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { unreadMessageCount } from '$lib/stores/message';
	import Icon from '@iconify/svelte';

	interface Props {
		showCount?: boolean;
		maxCount?: number;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'destructive' | 'secondary' | 'outline';
	}

	let {
		showCount = true,
		maxCount = 99,
		size = 'md',
		variant = 'destructive'
	}: Props = $props();

	const iconSize = $derived(() => {
		switch (size) {
			case 'sm': return 'h-4 w-4';
			case 'lg': return 'h-6 w-6';
			default: return 'h-5 w-5';
		}
	});

	const badgeSize = $derived(() => {
		switch (size) {
			case 'sm': return 'text-xs px-1.5 py-0.5';
			case 'lg': return 'text-sm px-2 py-1';
			default: return 'text-xs px-1.5 py-0.5';
		}
	});

	const displayCount = $derived(() => {
		if ($unreadMessageCount === 0) return null;
		if ($unreadMessageCount > maxCount) return `${maxCount}+`;
		return $unreadMessageCount.toString();
	});
</script>

<div class="relative inline-flex">
	<Icon icon="lucide:message-circle" class={iconSize} />

	{#if showCount && displayCount}
		<Badge
			{variant}
			class="absolute -top-2 -right-2 min-w-[1.25rem] h-5 flex items-center justify-center {badgeSize}"
		>
			{displayCount}
		</Badge>
	{/if}
</div>