<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { notificationActions } from '$lib/stores/notification';
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { Notification } from '$lib/types/notification';

	interface Props {
		notification: Notification;
		showActions?: boolean;
		compact?: boolean;
	}

	let { notification, showActions = true, compact = false }: Props = $props();

	function getNotificationIcon(type: string): string {
		switch (type) {
			case 'success': return 'lucide:check-circle';
			case 'warning': return 'lucide:alert-triangle';
			case 'error': return 'lucide:alert-circle';
			case 'info': return 'lucide:info';
			case 'system': return 'lucide:settings';
			case 'user': return 'lucide:user';
			case 'admin': return 'lucide:shield';
			default: return 'lucide:bell';
		}
	}

	function getNotificationColor(type: string): string {
		switch (type) {
			case 'success': return 'text-green-600';
			case 'warning': return 'text-yellow-600';
			case 'error': return 'text-red-600';
			case 'info': return 'text-blue-600';
			case 'system': return 'text-purple-600';
			case 'user': return 'text-indigo-600';
			case 'admin': return 'text-orange-600';
			default: return 'text-gray-600';
		}
	}

	function getPriorityColor(priority: string): "default" | "destructive" | "outline" | "secondary" {
		switch (priority) {
			case 'urgent': return 'destructive';
			case 'high': return 'destructive';
			case 'medium': return 'secondary';
			case 'low': return 'outline';
			default: return 'outline';
		}
	}

	async function markAsRead() {
		await notificationActions.markAsRead(notification.id);
	}

	async function archive() {
		await notificationActions.archive(notification.id);
	}

	async function deleteNotification() {
		await notificationActions.delete(notification.id);
	}

	function handleAction() {
		if (notification.actionUrl) {
			window.location.href = notification.actionUrl;
		}
		markAsRead();
	}
</script>

<Card class={`transition-all duration-200 ${!notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''} ${compact ? 'p-2' : ''}`}>
	<CardContent class={`p-4 ${compact ? 'p-3' : ''}`}>
		<div class="flex items-start space-x-3">
			<!-- Notification Icon -->
			<div class={`flex-shrink-0 ${getNotificationColor(notification.type)}`}>
				<Icon icon={getNotificationIcon(notification.type)} class="h-5 w-5" />
			</div>

			<!-- Content -->
			<div class="flex-1 min-w-0">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center space-x-2 mb-1">
							<h4 class={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
								{notification.title}
							</h4>
							{#if notification.priority !== 'low'}
								<Badge variant={getPriorityColor(notification.priority)} class="text-xs">
									{notification.priority}
								</Badge>
							{/if}
							{#if !notification.isRead}
								<div class="w-2 h-2 bg-primary rounded-full"></div>
							{/if}
						</div>

						<p class={`text-sm text-muted-foreground ${compact ? 'line-clamp-2' : ''}`}>
							{notification.message}
						</p>

						{#if notification.senderName}
							<p class="text-xs text-muted-foreground mt-1">
								From: {notification.senderName}
							</p>
						{/if}

						<p class="text-xs text-muted-foreground mt-2">
							{formatDate(notification.createdAt.toDate())}
						</p>
					</div>

					<!-- Actions -->
					{#if showActions}
						<div class="flex items-center space-x-1 ml-2">
							{#if notification.actionUrl && notification.actionText}
								<Button
									variant="outline"
									size="sm"
									onclick={handleAction}
									class="text-xs"
								>
									{notification.actionText}
								</Button>
							{/if}

							{#if !notification.isRead}
								<Button
									variant="ghost"
									size="sm"
									onclick={markAsRead}
									class="h-8 w-8 p-0"
									title="Mark as read"
								>
									<Icon icon="lucide:check" class="h-4 w-4" />
								</Button>
							{/if}

							<Button
								variant="ghost"
								size="sm"
								onclick={archive}
								class="h-8 w-8 p-0"
								title="Archive"
							>
								<Icon icon="lucide:archive" class="h-4 w-4" />
							</Button>

							<Button
								variant="ghost"
								size="sm"
								onclick={deleteNotification}
								class="h-8 w-8 p-0 text-destructive hover:text-destructive"
								title="Delete"
							>
								<Icon icon="lucide:trash-2" class="h-4 w-4" />
							</Button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</CardContent>
</Card>