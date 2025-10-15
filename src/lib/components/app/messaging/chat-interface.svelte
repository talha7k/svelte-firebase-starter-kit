<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { activeConversation, activeMessages, messagingActions } from '$lib/stores/message';
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { Message } from '$lib/types/message';

	interface Props {
		conversationId?: string | null;
	}

	let { conversationId = null }: Props = $props();

	let messageInput = $state('');
	let isTyping = $state(false);

	// Auto-scroll to bottom when new messages arrive
	let messagesContainer = $state<HTMLElement>();

	$effect(() => {
		if (messagesContainer && $activeMessages.length > 0) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});

	async function sendMessage() {
		if (!messageInput.trim() || !$activeConversation) return;

		const content = messageInput.trim();
		messageInput = '';

		await messagingActions.sendMessage($activeConversation.id, content);
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function startTyping() {
		if (!isTyping && $activeConversation) {
			isTyping = true;
			messagingActions.startTyping($activeConversation.id, 'You');

			// Stop typing after 3 seconds of inactivity
			setTimeout(() => {
				stopTyping();
			}, 3000);
		}
	}

	function stopTyping() {
		if (isTyping && $activeConversation) {
			isTyping = false;
			messagingActions.stopTyping($activeConversation.id, 'You');
		}
	}

	function getMessageTime(message: Message): string {
		return formatDate(message.createdAt.toDate(), { timeStyle: 'short' });
	}

	function isMessageFromCurrentUser(message: Message): boolean {
		return message.senderId === 'current-user';
	}
</script>

{#if $activeConversation}
	<div class="flex flex-col h-full">
		<!-- Chat Header -->
		<div class="flex items-center justify-between p-4 border-b">
			<div class="flex items-center space-x-3">
				{#if $activeConversation.avatar}
					<img
						src={$activeConversation.avatar}
						alt={$activeConversation.name || 'Conversation'}
						class="w-8 h-8 rounded-full object-cover"
					/>
				{:else}
					<div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
						{$activeConversation.type === 'direct' ? '👤' : '👥'}
					</div>
				{/if}
				<div>
					<h3 class="font-medium">
						{$activeConversation.name ||
							$activeConversation.participants.find(p => p !== 'current-user') ||
							'Unknown'}
					</h3>
					{#if $activeConversation.type === 'group'}
						<p class="text-xs text-muted-foreground">
							{$activeConversation.participants.length} members
						</p>
					{/if}
				</div>
			</div>

			<Button variant="ghost" size="sm">
				<Icon icon="lucide:more-vertical" class="h-4 w-4" />
			</Button>
		</div>

		<!-- Messages -->
		<div
			bind:this={messagesContainer}
			class="flex-1 overflow-y-auto p-4 space-y-4"
		>
			{#each $activeMessages as message (message.id)}
				<div class="flex {isMessageFromCurrentUser(message) ? 'justify-end' : 'justify-start'}">
					<div class="flex items-start space-x-2 max-w-[70%]">
						{#if !isMessageFromCurrentUser(message)}
							{#if message.senderAvatar}
								<img
									src={message.senderAvatar}
									alt={message.senderName}
									class="w-8 h-8 rounded-full object-cover flex-shrink-0"
								/>
							{:else}
								<div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
									{message.senderName.charAt(0).toUpperCase()}
								</div>
							{/if}
						{/if}

						<div class="space-y-1">
							{#if !isMessageFromCurrentUser(message)}
								<div class="flex items-center space-x-2">
									<span class="text-sm font-medium">{message.senderName}</span>
									<span class="text-xs text-muted-foreground">{getMessageTime(message)}</span>
								</div>
							{/if}

							<div class="rounded-lg px-3 py-2 {isMessageFromCurrentUser(message)
								? 'bg-primary text-primary-foreground ml-auto'
								: 'bg-muted'}">
								{#if message.type === 'text'}
									<p class="text-sm">{message.content}</p>
								{:else if message.type === 'image' && message.metadata?.imageUrl}
									<img
										src={message.metadata.imageUrl}
										alt=""
										class="rounded max-w-full h-auto"
									/>
								{:else if message.type === 'file' && message.metadata?.fileName}
									<div class="flex items-center space-x-2">
										<Icon icon="lucide:file" class="h-4 w-4" />
										<span class="text-sm">{message.metadata.fileName}</span>
									</div>
								{/if}
							</div>

							{#if isMessageFromCurrentUser(message)}
								<div class="text-xs text-muted-foreground text-right">
									{getMessageTime(message)}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}

			{#if $activeMessages.length === 0}
				<div class="flex flex-col items-center justify-center py-8 text-center">
					<Icon icon="lucide:message-circle" class="h-12 w-12 text-muted-foreground mb-4" />
					<h4 class="text-sm font-medium text-muted-foreground mb-2">
						No messages yet
					</h4>
					<p class="text-xs text-muted-foreground">
						Start the conversation by sending a message.
					</p>
				</div>
			{/if}
		</div>

		<!-- Message Input -->
		<div class="border-t p-4">
			<div class="flex items-end space-x-2">
				<div class="flex-1">
					<Input
						placeholder="Type a message..."
						bind:value={messageInput}
						oninput={startTyping}
						onkeydown={handleKeyPress}
						disabled={!$activeConversation}
					/>
				</div>

				<Button
					onclick={sendMessage}
					disabled={!messageInput.trim() || !$activeConversation}
					size="sm"
				>
					<Icon icon="lucide:send" class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col items-center justify-center h-full text-center">
		<Icon icon="lucide:message-square" class="h-16 w-16 text-muted-foreground mb-4" />
		<h3 class="text-lg font-medium text-muted-foreground mb-2">
			Select a conversation
		</h3>
		<p class="text-sm text-muted-foreground">
			Choose a conversation from the list to start messaging.
		</p>
	</div>
{/if}