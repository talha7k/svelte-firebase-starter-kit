 <script lang="ts">
	import { cn } from "$lib/utils.js";
	import Icon from '@iconify/svelte';

	let { class: className }: { class?: string } = $props();
</script>

<Icon
	icon="lucide:loader-2"
	role="status"
	aria-label="Loading"
	class={cn("size-4 animate-spin", className)}
/>
