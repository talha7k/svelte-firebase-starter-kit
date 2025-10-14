import type { Timestamp } from "firebase/firestore";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "system"
  | "user"
  | "admin";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string;
  actionText?: string;
  data?: Record<string, any>;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt?: Timestamp;

  // Sender information (for user-to-user notifications)
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;

  // Notification types
  systemNotifications: boolean;
  userNotifications: boolean;
  adminNotifications: boolean;

  // Do not disturb
  doNotDisturb: boolean;
  dndStartTime?: string; // HH:MM format
  dndEndTime?: string; // HH:MM format
  dndDays?: number[]; // 0-6, Sunday = 0

  // Quiet hours
  quietHours: boolean;
  quietStartTime?: string;
  quietEndTime?: string;

  updatedAt: Timestamp;
}

export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  settings: Record<string, any>;
}

export interface NotificationSetting {
  id: string;
  category: string;
  title: string;
  description: string;
  email: boolean;
  desktop: boolean;
  mobile: boolean;
}
