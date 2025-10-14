<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { notificationStore, notificationActions, unreadCount } from '$lib/stores/notification';
	import NotificationItem from './notification-item.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		maxHeight?: string;
		showHeader?: boolean;
		compact?: boolean;
		filter?: 'all' | 'unread' | 'archived';
	}

	let {
		maxHeight = '400px',
		showHeader = true,
		compact = false,
		filter = 'all'
	}: Props = $props();

	const notifications = $derived(() => {
		const allNotifications = $notificationStore.notifications;

		switch (filter) {
			case 'unread':
				return allNotifications.filter(n => !n.isRead && !n.isArchived);
			case 'archived':
				return allNotifications.filter(n => n.isArchived);
			default:
				return allNotifications.filter(n => !n.isArchived);
		}
	});

	async function markAllAsRead() {
		await notificationActions.markAllAsRead();
	}

	function clearAll() {
		// In a real app, this would archive all notifications
		notificationStore.update(state => ({
			...state,
			notifications: state.notifications.map(n => ({ ...n, isArchived: true }))
		}));
	}
</script>

<div class="w-full">
	{#if showHeader}
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center space-x-2">
				<h3 class="text-lg font-semibold">Notifications</h3>
				{#if $unreadCount > 0}
					<span class="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
						{$unreadCount}
					</span>
				{/if}
			</div>

			<div class="flex items-center space-x-2">
				{#if $unreadCount > 0}
					<Button variant="outline" size="sm" onclick={markAllAsRead}>
						<Icon icon="lucide:check-check" class="h-4 w-4 mr-1" />
						Mark all read
					</Button>
				{/if}

				{#if notifications.length > 0}
					<Button variant="outline" size="sm" onclick={clearAll}>
						<Icon icon="lucide:trash-2" class="h-4 w-4 mr-1" />
						Clear all
					</Button>
				{/if}
			</div>
		</div>

		<Separator class="mb-4" />
	{/if}

	{#if notifications.length === 0}
		<div class="flex flex-col items-center justify-center py-8 text-center">
			<Icon icon="lucide:bell-off" class="h-12 w-12 text-muted-foreground mb-4" />
			<h4 class="text-sm font-medium text-muted-foreground mb-2">
				{filter === 'unread' ? 'No unread notifications' : 'No notifications'}
			</h4>
			<p class="text-xs text-muted-foreground">
				{filter === 'unread'
					? 'You\'re all caught up!'
					: 'Notifications will appear here when you have updates.'}
			</p>
		</div>
	{:else}
		<div class="overflow-y-auto max-h-[400px] space-y-2">
			{#each notifications() as notification (notification.id)}
				<NotificationItem
					{notification}
					{compact}
					showActions={filter !== 'archived'}
				/>
			{/each}
		</div>
	{/if}
</div>