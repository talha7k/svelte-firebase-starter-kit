import type { Timestamp } from "firebase/firestore";

export type MessageType = "text" | "image" | "file" | "system";

export type ConversationType = "direct" | "group";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
  };
  isEdited: boolean;
  editedAt?: Timestamp;
  isDeleted: boolean;
  deletedAt?: Timestamp;

  // Read status
  readBy: string[]; // Array of user IDs who have read this message

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // For group conversations
  description?: string; // For group conversations
  avatar?: string; // For group conversations

  // Participants
  participants: string[]; // Array of user IDs
  admins?: string[]; // For group conversations

  // Last message
  lastMessage?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    type: MessageType;
    createdAt: Timestamp;
  };

  // Metadata
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Settings
  settings: {
    allowInvites: boolean; // For group conversations
    isPublic: boolean; // For group conversations
  };
}

export interface ConversationParticipant {
  conversationId: string;
  userId: string;
  joinedAt: Timestamp;
  lastReadAt: Timestamp;
  isMuted: boolean;
  isArchived: boolean;
  role: "member" | "admin" | "owner"; // For group conversations
}

export interface MessageReaction {
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Timestamp;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  timestamp: Timestamp;
}
