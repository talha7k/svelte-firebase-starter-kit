<script lang="ts">
	import { NotificationList } from '$lib/components/app/notifications';
	import DoNotDisturbSection from '$lib/components/app/notifications/do-not-disturb-section.svelte';
	import NotificationChannel from '$lib/components/app/notifications/notification-channel.svelte';
	import NotificationSection from '$lib/components/app/notifications/notification-section.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { notificationActions } from '$lib/stores/notification';
	import { toast } from 'svelte-sonner';
	import Icon from '@iconify/svelte';

	const generalSettings = [
		{
			id: 'mentions',
			category: 'general',
			title: 'Mentions',
			description: 'Receive a notification if a teammate mentions you in a note.',
			email: true,
			desktop: false,
			mobile: false
		},
		{
			id: 'service-updates',
			category: 'general',
			title: 'Service provider updates',
			description: 'Receive a notification when there are changes to the list of service providers',
			email: true,
			desktop: false,
			mobile: false
		}
	];

	const taskSettings = [
		{
			id: 'task-assignments',
			category: 'tasks',
			title: 'Task Assignments',
			description: "Notify me when I'm assigned a task",
			email: true,
			desktop: true,
			mobile: true
		},
		{
			id: 'task-completed',
			category: 'tasks',
			title: 'Tasks completed',
			description: 'Only for tasks youve created or assigned',
			email: true,
			desktop: true,
			mobile: true
		}
	];

	let scheduleEnabled = $state(false);
	let startTime = $state('17:00');
	let endTime = $state('09:00');
	let selectedDays = $state<string[]>([]);

	function saveSettings() {
		// In a real app, this would save to the backend
		toast.success('Notification settings saved');
	}

	function testNotification() {
		notificationActions.add({
			userId: 'current-user', // This would be the actual user ID
			type: 'info',
			title: 'Test Notification',
			message: 'This is a test notification to verify your settings.',
			priority: 'low',
			isRead: false,
			isArchived: false
		});
		toast.success('Test notification sent');
	}
</script>

<div class="container mx-auto py-8 space-y-8">
	<div class="space-y-2">
		<h1 class="text-3xl font-bold">Notifications</h1>
		<p class="text-muted-foreground">
			Manage your notification preferences and view your recent notifications.
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Recent Notifications -->
		<div class="lg:col-span-2">
			<Card>
				<CardHeader>
					<CardTitle>Recent Notifications</CardTitle>
				</CardHeader>
				<CardContent>
					<NotificationList showHeader={false} />
				</CardContent>
			</Card>
		</div>

		<!-- Notification Settings -->
		<div class="space-y-6">
			<NotificationChannel />

			<NotificationSection title="General" settings={generalSettings} />

			<NotificationSection title="Tasks" settings={taskSettings} />

			<Card>
				<CardHeader>
					<CardTitle>Do Not Disturb</CardTitle>
				</CardHeader>
				<CardContent>
					<DoNotDisturbSection bind:scheduleEnabled bind:startTime bind:endTime bind:selectedDays />
				</CardContent>
			</Card>

			<!-- Actions -->
			<div class="flex flex-col gap-2">
				<Button on:click={saveSettings} class="w-full">
					<Icon icon="lucide:save" class="h-4 w-4 mr-2" />
					Save Settings
				</Button>

				<Button variant="outline" on:click={testNotification} class="w-full">
					<Icon icon="lucide:bell" class="h-4 w-4 mr-2" />
					Test Notification
				</Button>
			</div>
		</div>
	</div>
</div>
