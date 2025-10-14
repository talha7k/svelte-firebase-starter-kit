<script lang="ts">
	import { ConversationList, ChatInterface } from '$lib/components/app/messaging';
	import { messagingStore, messagingActions } from '$lib/stores/message';

	let selectedConversationId = $state<string | null>(null);

	function handleConversationSelect(conversationId: string) {
		selectedConversationId = conversationId;
	}
</script>

<div class="container mx-auto py-8 h-[calc(100vh-8rem)]">
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
		<!-- Conversation List -->
		<div class="lg:col-span-1 border rounded-lg overflow-hidden">
			<ConversationList
				activeConversationId={selectedConversationId}
				onConversationSelect={handleConversationSelect}
			/>
		</div>

		<!-- Chat Interface -->
		<div class="lg:col-span-3 border rounded-lg overflow-hidden">
			<ChatInterface conversationId={selectedConversationId} />
		</div>
	</div>
</div>