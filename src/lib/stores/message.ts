import { writable, derived } from "svelte/store";
import type {
  Conversation,
  Message,
  ConversationParticipant,
} from "$lib/types/message";

type MessagingStore = {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  participants: Record<string, ConversationParticipant[]>; // conversationId -> participants
  loading: boolean;
  error: string | null;
  typingUsers: Record<string, string[]>; // conversationId -> typing user names
};

const initialState: MessagingStore = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  participants: {},
  loading: false,
  error: null,
  typingUsers: {},
};

export const messagingStore = writable<MessagingStore>(initialState);

// Derived stores
export const activeConversation = derived(
  messagingStore,
  ($store) =>
    $store.conversations.find((c) => c.id === $store.activeConversationId) ||
    null,
);

export const activeMessages = derived(messagingStore, ($store) => {
  const conversationId = $store.activeConversationId;
  return conversationId ? $store.messages[conversationId] || [] : [];
});

export const unreadMessageCount = derived(messagingStore, ($store) => {
  // In a real app, this would calculate unread messages across all conversations
  // For demo purposes, return a mock count
  return 3;
});

export const recentConversations = derived(messagingStore, ($store) =>
  $store.conversations
    .filter((c) => c.isActive)
    .sort((a, b) => {
      const aTime = a.lastMessage?.createdAt.seconds || 0;
      const bTime = b.lastMessage?.createdAt.seconds || 0;
      return bTime - aTime;
    })
    .slice(0, 10),
);

// Actions
export const messagingActions = {
  // Initialize messaging for a user
  async initialize(userId: string) {
    messagingStore.update((state) => ({
      ...state,
      loading: true,
      error: null,
    }));

    try {
      // In a real app, this would set up Firestore listeners
      // For demo purposes, we'll use mock data
      const mockConversations: Conversation[] = [
        {
          id: "conv1",
          type: "direct",
          participants: [userId, "user2"],
          isActive: true,
          createdBy: userId,
          createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          lastMessage: {
            id: "msg1",
            senderId: "user2",
            senderName: "Jane Doe",
            content: "Hey, how are you doing?",
            type: "text",
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          },
          settings: {
            allowInvites: true,
            isPublic: false,
          },
        },
        {
          id: "conv2",
          type: "group",
          name: "Project Team",
          description: "Main project discussion",
          participants: [userId, "user2", "user3"],
          admins: [userId],
          isActive: true,
          createdBy: userId,
          createdAt: {
            seconds: (Date.now() - 86400000) / 1000,
            nanoseconds: 0,
          } as any,
          updatedAt: {
            seconds: (Date.now() - 86400000) / 1000,
            nanoseconds: 0,
          } as any,
          lastMessage: {
            id: "msg2",
            senderId: "user3",
            senderName: "Bob Smith",
            content: "The new feature is ready for review",
            type: "text",
            createdAt: {
              seconds: (Date.now() - 3600000) / 1000,
              nanoseconds: 0,
            } as any,
          },
          settings: {
            allowInvites: true,
            isPublic: false,
          },
        },
      ];

      const mockMessages: Record<string, Message[]> = {
        conv1: [
          {
            id: "msg1",
            conversationId: "conv1",
            senderId: "user2",
            senderName: "Jane Doe",
            type: "text",
            content: "Hey, how are you doing?",
            isEdited: false,
            isDeleted: false,
            readBy: [userId],
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
            updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          },
        ],
        conv2: [
          {
            id: "msg2",
            conversationId: "conv2",
            senderId: "user3",
            senderName: "Bob Smith",
            type: "text",
            content: "The new feature is ready for review",
            isEdited: false,
            isDeleted: false,
            readBy: [userId],
            createdAt: {
              seconds: (Date.now() - 3600000) / 1000,
              nanoseconds: 0,
            } as any,
            updatedAt: {
              seconds: (Date.now() - 3600000) / 1000,
              nanoseconds: 0,
            } as any,
          },
        ],
      };

      messagingStore.update((state) => ({
        ...state,
        conversations: mockConversations,
        messages: mockMessages,
        loading: false,
      }));
    } catch (error) {
      messagingStore.update((state) => ({
        ...state,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to load messages",
      }));
    }
  },

  // Set active conversation
  setActiveConversation(conversationId: string | null) {
    messagingStore.update((state) => ({
      ...state,
      activeConversationId: conversationId,
    }));
  },

  // Send a message
  async sendMessage(
    conversationId: string,
    content: string,
    type: Message["type"] = "text",
  ) {
    // In a real app, this would send to the backend
    // For demo purposes, add to local state
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: "current-user", // This would be the actual user ID
      senderName: "You",
      type,
      content,
      isEdited: false,
      isDeleted: false,
      readBy: [],
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    };

    messagingStore.update((state) => ({
      ...state,
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          newMessage,
        ],
      },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                id: newMessage.id,
                senderId: newMessage.senderId,
                senderName: newMessage.senderName,
                content: newMessage.content,
                type: newMessage.type,
                createdAt: newMessage.createdAt,
              },
              updatedAt: newMessage.createdAt,
            }
          : conv,
      ),
    }));
  },

  // Start typing indicator
  startTyping(conversationId: string, userName: string) {
    messagingStore.update((state) => ({
      ...state,
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: [
          ...(state.typingUsers[conversationId] || []),
          userName,
        ],
      },
    }));
  },

  // Stop typing indicator
  stopTyping(conversationId: string, userName: string) {
    messagingStore.update((state) => ({
      ...state,
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] || []).filter(
          (name) => name !== userName,
        ),
      },
    }));
  },

  // Mark conversation as read
  markConversationAsRead(conversationId: string) {
    messagingStore.update((state) => ({
      ...state,
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((msg) => ({
          ...msg,
          readBy: [...msg.readBy, "current-user"], // This would be the actual user ID
        })),
      },
    }));
  },

  // Create new conversation
  async createConversation(
    participants: string[],
    name?: string,
    type: Conversation["type"] = "direct",
  ) {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      type,
      name: type === "group" ? name : undefined,
      participants,
      isActive: true,
      createdBy: "current-user", // This would be the actual user ID
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      settings: {
        allowInvites: true,
        isPublic: false,
      },
    };

    messagingStore.update((state) => ({
      ...state,
      conversations: [newConversation, ...state.conversations],
      activeConversationId: newConversation.id,
      messages: {
        ...state.messages,
        [newConversation.id]: [],
      },
    }));

    return newConversation.id;
  },

  // Clear all data
  clear() {
    messagingStore.set(initialState);
  },
};
