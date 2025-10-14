<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { updatePasswordSchema, type UpdatePasswordData } from '$lib/schemas/user/update-password';
	import { toast } from 'svelte-sonner';
	import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
	import * as v from 'valibot';

	let formData = $state<UpdatePasswordData>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	let errors = $state<Record<string, string>>({});
	let isLoading = $state(false);

	function validateForm(): boolean {
		errors = {};

		const result = v.safeParse(updatePasswordSchema, formData);
		if (!result.success) {
			for (const issue of result.issues) {
				const key = issue.path?.[0]?.key as string;
				if (key) {
					errors[key] = issue.message;
				}
			}
		}

		// Check if new password and confirm password match
		if (formData.newPassword !== formData.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match.';
		}

		return Object.keys(errors).length === 0;
	}

	async function handlePasswordUpdate() {
		if (!validateForm()) return;

		isLoading = true;

		try {
			const response = await fetch('/api/account/password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to update password');
			}

			// Clear form
			formData = {
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			};

			toast.success('Password updated successfully');
		} catch (error: any) {
			console.error('Password update error:', error);

			if (error.message?.includes('Current password is incorrect')) {
				errors.currentPassword = 'Current password is incorrect.';
			} else if (error.message?.includes('too weak')) {
				errors.newPassword = 'Password is too weak.';
			} else if (error.message?.includes('sign in again')) {
				errors.currentPassword = 'Please sign in again to update your password.';
			} else {
				toast.error(error.message || 'Failed to update password. Please try again.');
			}
		} finally {
			isLoading = false;
		}
	}

	function hasFormData(): boolean {
		return formData.currentPassword.length > 0 ||
			   formData.newPassword.length > 0 ||
			   formData.confirmPassword.length > 0;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Change Password</Card.Title>
		<p class="text-sm text-muted-foreground">
			Update your password to keep your account secure.
		</p>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="space-y-2">
			<Label for="current-password">Current Password</Label>
			<Input
				id="current-password"
				type="password"
				placeholder="Enter current password"
				bind:value={formData.currentPassword}
				class={errors.currentPassword ? 'border-destructive' : ''}
				disabled={isLoading}
			/>
			{#if errors.currentPassword}
				<p class="text-sm text-destructive">{errors.currentPassword}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<Label for="new-password">New Password</Label>
			<Input
				id="new-password"
				type="password"
				placeholder="Enter new password"
				bind:value={formData.newPassword}
				class={errors.newPassword ? 'border-destructive' : ''}
				disabled={isLoading}
			/>
			{#if errors.newPassword}
				<p class="text-sm text-destructive">{errors.newPassword}</p>
			{:else}
				<p class="text-sm text-muted-foreground">
					Password must be at least 8 characters with uppercase, lowercase, and numbers.
				</p>
			{/if}
		</div>

		<div class="space-y-2">
			<Label for="confirm-password">Confirm New Password</Label>
			<Input
				id="confirm-password"
				type="password"
				placeholder="Confirm new password"
				bind:value={formData.confirmPassword}
				class={errors.confirmPassword ? 'border-destructive' : ''}
				disabled={isLoading}
			/>
			{#if errors.confirmPassword}
				<p class="text-sm text-destructive">{errors.confirmPassword}</p>
			{/if}
		</div>

		<div class="flex justify-end">
			<Button
				onclick={handlePasswordUpdate}
				disabled={isLoading || !hasFormData()}
			>
				{#if isLoading}
					Updating...
				{:else}
					Update Password
				{/if}
			</Button>
		</div>
	</Card.Content>
</Card.Root>