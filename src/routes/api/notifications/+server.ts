import { json, error } from "@sveltejs/kit";
import * as v from "valibot";

const createNotificationSchema = v.object({
  userId: v.pipe(v.string(), v.nonEmpty("User ID is required")),
  type: v.picklist(
    ["info", "success", "warning", "error", "system", "user", "admin"],
    "Invalid notification type",
  ),
  title: v.pipe(v.string(), v.nonEmpty("Title is required")),
  message: v.pipe(v.string(), v.nonEmpty("Message is required")),
  priority: v.picklist(["low", "medium", "high", "urgent"], "Invalid priority"),
  actionUrl: v.optional(v.string()),
  actionText: v.optional(v.string()),
  data: v.optional(v.record(v.string(), v.any())),
});

const updateNotificationSchema = v.object({
  isRead: v.optional(v.boolean()),
  isArchived: v.optional(v.boolean()),
});

export async function GET({ url }: { url: URL }) {
  try {
    const userId = url.searchParams.get("userId");
    const type = url.searchParams.get("type"); // 'all', 'unread', 'archived'
    const limit = parseInt(url.searchParams.get("limit") || "50");

    if (!userId) {
      throw error(400, "User ID is required");
    }

    // In a real app, this would query the database
    // For demo purposes, return mock data
    const mockNotifications = [
      {
        id: "1",
        userId,
        type: "system",
        title: "Welcome!",
        message: "Welcome to the application.",
        priority: "low",
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        userId,
        type: "info",
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
        priority: "medium",
        isRead: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    let filteredNotifications = mockNotifications;

    if (type === "unread") {
      filteredNotifications = mockNotifications.filter(
        (n) => !n.isRead && !n.isArchived,
      );
    } else if (type === "archived") {
      filteredNotifications = mockNotifications.filter((n) => n.isArchived);
    }

    // Sort by creation date (newest first)
    filteredNotifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Apply limit
    filteredNotifications = filteredNotifications.slice(0, limit);

    return json({
      notifications: filteredNotifications,
      total: filteredNotifications.length,
    });
  } catch (err: any) {
    console.error("Get notifications error:", err);

    if (err.status) {
      throw err;
    }

    throw error(500, "Failed to fetch notifications");
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.json();

    // Validate input
    const result = v.safeParse(createNotificationSchema, data);
    if (!result.success) {
      throw error(400, "Validation failed");
    }

    const notificationData = result.output;

    // In a real app, this would save to the database
    // For demo purposes, just return success with the notification data
    const notification = {
      id: Date.now().toString(),
      ...notificationData,
      isRead: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return json({
      success: true,
      notification,
    });
  } catch (err: any) {
    console.error("Create notification error:", err);

    if (err.status) {
      throw err;
    }

    throw error(500, "Failed to create notification");
  }
}
