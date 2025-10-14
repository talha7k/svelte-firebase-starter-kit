import { writable, derived } from "svelte/store";
import type {
  Notification,
  NotificationSettings,
} from "$lib/types/notification";

type NotificationStore = {
  notifications: Notification[];
  settings: NotificationSettings | null;
  loading: boolean;
  error: string | null;
  unreadCount: number;
};

const initialState: NotificationStore = {
  notifications: [],
  settings: null,
  loading: false,
  error: null,
  unreadCount: 0,
};

export const notificationStore = writable<NotificationStore>(initialState);

// Derived stores
export const unreadNotifications = derived(notificationStore, ($store) =>
  $store.notifications.filter((n) => !n.isRead),
);

export const unreadCount = derived(
  notificationStore,
  ($store) => $store.notifications.filter((n) => !n.isRead).length,
);

export const recentNotifications = derived(notificationStore, ($store) =>
  $store.notifications
    .filter((n) => !n.isArchived)
    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
    .slice(0, 10),
);

// Actions
export const notificationActions = {
  // Initialize notifications for a user
  async initialize(userId: string) {
    notificationStore.update((state) => ({
      ...state,
      loading: true,
      error: null,
    }));

    try {
      // In a real app, this would set up Firestore listeners
      // For demo purposes, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          userId,
          type: "system",
          title: "Welcome!",
          message:
            "Welcome to the application. Your account has been set up successfully.",
          priority: "low",
          isRead: false,
          isArchived: false,
          createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        },
        {
          id: "2",
          userId,
          type: "info",
          title: "Profile Update",
          message: "Your profile information has been updated.",
          priority: "medium",
          isRead: true,
          isArchived: false,
          createdAt: {
            seconds: (Date.now() - 86400000) / 1000,
            nanoseconds: 0,
          } as any,
          updatedAt: {
            seconds: (Date.now() - 86400000) / 1000,
            nanoseconds: 0,
          } as any,
        },
      ];

      const mockSettings: NotificationSettings = {
        userId,
        emailNotifications: true,
        pushNotifications: true,
        inAppNotifications: true,
        systemNotifications: true,
        userNotifications: true,
        adminNotifications: false,
        doNotDisturb: false,
        quietHours: false,
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      };

      notificationStore.update((state) => ({
        ...state,
        notifications: mockNotifications,
        settings: mockSettings,
        loading: false,
        unreadCount: mockNotifications.filter((n) => !n.isRead).length,
      }));
    } catch (error) {
      notificationStore.update((state) => ({
        ...state,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load notifications",
      }));
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    notificationStore.update((state) => ({
      ...state,
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      ),
    }));
  },

  // Mark all notifications as read
  async markAllAsRead() {
    notificationStore.update((state) => ({
      ...state,
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  // Archive notification
  async archive(notificationId: string) {
    notificationStore.update((state) => ({
      ...state,
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isArchived: true } : n,
      ),
    }));
  },

  // Delete notification
  async delete(notificationId: string) {
    notificationStore.update((state) => ({
      ...state,
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    }));
  },

  // Add new notification
  async add(
    notification: Omit<Notification, "id" | "createdAt" | "updatedAt">,
  ) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    };

    notificationStore.update((state) => ({
      ...state,
      notifications: [newNotification, ...state.notifications],
    }));
  },

  // Update notification settings
  async updateSettings(settings: Partial<NotificationSettings>) {
    notificationStore.update((state) => ({
      ...state,
      settings: state.settings ? { ...state.settings, ...settings } : null,
    }));
  },

  // Clear all notifications
  clear() {
    notificationStore.set(initialState);
  },
};
