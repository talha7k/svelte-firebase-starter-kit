<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { siteConfig } from '../../../../config';
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';

	let {
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const sidebar = Sidebar.useSidebar();
</script>

<div
	class="relative"
	onmouseenter={() => sidebar.setOpen(true)}
	onmouseleave={() => sidebar.setOpen(false)}
>
	<Sidebar.Root
		bind:ref
		{...restProps}
		class="[&_[data-slot='sidebar-gap']]:group-data-[collapsible=icon]:w-0 z-50"
	>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex items-center">
				<Sidebar.MenuButton
					size="lg"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-grow"
				>
					{#snippet child({ props })}
						<a href="/" class="cursor-pointer" {...props}>
							<img src={siteConfig.logo} alt={siteConfig.title} class="h-6 dark:hidden" />
							<img src={siteConfig.logoDark} alt={siteConfig.title} class="hidden h-6 dark:block" />
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
</div>
