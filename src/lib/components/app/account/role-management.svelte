<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/types/user';

	let selectedUserId = $state('');
	let selectedRole = $state<'user' | 'admin' | 'moderator'>('user');
	let isLoading = $state(false);

	// Mock user list - in a real app, this would come from an API
	let users = $state<UserProfile[]>([
		{
			uid: 'user1',
			email: 'user@example.com',
			displayName: 'John Doe',
			photoURL: null,
			isActive: true,
			lastLoginAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
			createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
			updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
			emailNotifications: true,
			pushNotifications: true,
			theme: 'system',
			language: 'en',
			role: 'user',
			permissions: [],
			companyId: 'company1',
			onboardingCompleted: true,
			metadata: {
				accountStatus: 'active'
			}
		},
		{
			uid: 'user2',
			email: 'admin@example.com',
			displayName: 'Jane Admin',
			photoURL: null,
			isActive: true,
			lastLoginAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
			createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
			updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
			emailNotifications: true,
			pushNotifications: true,
			theme: 'system',
			language: 'en',
			role: 'admin',
			permissions: ['manage_users', 'manage_content'],
			companyId: 'company1',
			onboardingCompleted: true,
			metadata: {
				accountStatus: 'active'
			}
		}
	]);

	const currentUser = $derived($userProfile.data);

	// Only show this component to admin users
	const isAdmin = $derived(currentUser?.role === 'admin');

	async function updateUserRole() {
		if (!selectedUserId || !selectedRole) return;

		isLoading = true;
		try {
			const response = await fetch('/api/account/role', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: selectedUserId,
					role: selectedRole
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to update user role');
			}

			// Update local state
			const userIndex = users.findIndex(u => u.uid === selectedUserId);
			if (userIndex !== -1) {
				users[userIndex] = {
					...users[userIndex],
					role: selectedRole,
					permissions: result.permissions,
					updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any
				};
			}

			toast.success(`User role updated to ${selectedRole}`);
			selectedUserId = '';
			selectedRole = 'user';
		} catch (error: any) {
			console.error('Failed to update user role:', error);
			toast.error(error.message || 'Failed to update user role');
		} finally {
			isLoading = false;
		}
	}

	function getRoleColor(role: string): string {
		switch (role) {
			case 'admin': return 'text-red-600 bg-red-50';
			case 'moderator': return 'text-blue-600 bg-blue-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}
</script>

{#if isAdmin}
	<Card.Root>
		<Card.Header>
			<Card.Title>Role Management</Card.Title>
			<p class="text-sm text-muted-foreground">
				Manage user roles and permissions. Only administrators can access this section.
			</p>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="space-y-4">
				<div class="space-y-2">
					<Label>Select User</Label>
					<select bind:value={selectedUserId} class="w-full p-2 border rounded">
						<option value="">Choose a user to manage</option>
						{#each users.filter(u => u.uid !== currentUser?.uid) as user}
							<option value={user.uid}>
								{user.displayName || user.email} ({user.email})
							</option>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<Label>Select Role</Label>
					<select bind:value={selectedRole} class="w-full p-2 border rounded">
						<option value="user">User</option>
						<option value="moderator">Moderator</option>
						<option value="admin">Administrator</option>
					</select>
				</div>

				<div class="flex justify-end">
					<Button
						onclick={updateUserRole}
						disabled={isLoading || !selectedUserId}
					>
						{#if isLoading}
							Updating...
						{:else}
							Update Role
						{/if}
					</Button>
				</div>
			</div>

			<!-- User List -->
			<div class="space-y-2">
				<h4 class="text-sm font-medium">Current Users</h4>
				<div class="space-y-2">
					{#each users as user}
						<div class="flex items-center justify-between p-3 border rounded-lg">
							<div class="flex items-center space-x-3">
								<div>
									<p class="text-sm font-medium">{user.displayName || 'No name'}</p>
									<p class="text-xs text-muted-foreground">{user.email}</p>
								</div>
							</div>
							<div class="flex items-center space-x-2">
								<span class="px-2 py-1 text-xs rounded-full {getRoleColor(user.role)}">
									{user.role}
								</span>
								{#if user.uid === currentUser?.uid}
									<span class="text-xs text-muted-foreground">(You)</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</Card.Content>
	</Card.Root>
{/if}