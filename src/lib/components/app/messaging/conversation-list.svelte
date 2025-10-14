<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { recentConversations, messagingActions } from '$lib/stores/message';
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { Conversation } from '$lib/types/message';

	interface Props {
		activeConversationId?: string | null;
		onConversationSelect?: (conversationId: string) => void;
	}

	let { activeConversationId = null, onConversationSelect }: Props = $props();

	function getConversationDisplayName(conversation: Conversation): string {
		if (conversation.type === 'direct') {
			// In a real app, this would get the other participant's name
			return conversation.participants.find(p => p !== 'current-user') || 'Unknown User';
		}
		return conversation.name || 'Unnamed Group';
	}

	function getConversationAvatar(conversation: Conversation): string {
		if (conversation.type === 'direct') {
			// In a real app, this would get the other participant's avatar
			return conversation.avatar || '👤';
		}
		return conversation.avatar || '👥';
	}

	function hasUnreadMessages(conversation: Conversation): boolean {
		// In a real app, this would check if there are unread messages
		// For demo purposes, return false
		return false;
	}

	function getLastMessageTime(conversation: Conversation): string {
		if (!conversation.lastMessage) return '';
		return formatDate(conversation.lastMessage.createdAt.toDate());
	}

	function selectConversation(conversationId: string) {
		messagingActions.setActiveConversation(conversationId);
		onConversationSelect?.(conversationId);
	}
</script>

<div class="w-full h-full flex flex-col">
	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-b">
		<h2 class="text-lg font-semibold">Messages</h2>
		<Button variant="outline" size="sm">
			<Icon icon="lucide:plus" class="h-4 w-4 mr-1" />
			New
		</Button>
	</div>

	<!-- Conversation List -->
	<div class="flex-1 overflow-y-auto">
		<div class="space-y-1 p-2">
			{#each $recentConversations as conversation (conversation.id)}
				{@const isActive = conversation.id === activeConversationId}
				{@const displayName = getConversationDisplayName(conversation)}
				{@const avatar = getConversationAvatar(conversation)}
				{@const hasUnread = hasUnreadMessages(conversation)}
				{@const lastMessageTime = getLastMessageTime(conversation)}

				<Button
					variant={isActive ? 'secondary' : 'ghost'}
					class="w-full justify-start h-auto p-3 {isActive ? 'bg-accent' : ''}"
					onclick={() => selectConversation(conversation.id)}
				>
					<div class="flex items-center space-x-3 w-full">
						<!-- Avatar -->
						<div class="flex-shrink-0">
							{#if conversation.avatar}
								<img
									src={conversation.avatar}
									alt={displayName}
									class="w-10 h-10 rounded-full object-cover"
								/>
							{:else}
								<div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
									{avatar}
								</div>
							{/if}
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between">
								<h3 class="text-sm font-medium truncate {hasUnread ? 'font-semibold' : ''}">
									{displayName}
								</h3>
								{#if lastMessageTime}
									<span class="text-xs text-muted-foreground">
										{lastMessageTime}
									</span>
								{/if}
							</div>

							{#if conversation.lastMessage}
								<div class="flex items-center justify-between mt-1">
									<p class="text-xs text-muted-foreground truncate flex-1">
										{#if conversation.lastMessage.senderId === 'current-user'}
											You:
										{/if}
										{conversation.lastMessage.content}
									</p>
									{#if hasUnread}
										<Badge variant="destructive" class="ml-2 h-2 w-2 p-0" />
									{/if}
								</div>
							{:else}
								<p class="text-xs text-muted-foreground">No messages yet</p>
							{/if}
						</div>
					</div>
				</Button>
			{/each}

			{#if $recentConversations.length === 0}
				<div class="flex flex-col items-center justify-center py-8 text-center">
					<Icon icon="lucide:message-square" class="h-12 w-12 text-muted-foreground mb-4" />
					<h4 class="text-sm font-medium text-muted-foreground mb-2">
						No conversations yet
					</h4>
					<p class="text-xs text-muted-foreground">
						Start a conversation to begin messaging.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>