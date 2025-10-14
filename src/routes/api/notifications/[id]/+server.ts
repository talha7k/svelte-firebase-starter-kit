import { json, error } from "@sveltejs/kit";
import * as v from "valibot";

const updateNotificationSchema = v.object({
  isRead: v.optional(v.boolean()),
  isArchived: v.optional(v.boolean()),
});

export async function PATCH({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) {
  try {
    const { id } = params;
    const data = await request.json();

    // Validate input
    const result = v.safeParse(updateNotificationSchema, data);
    if (!result.success) {
      throw error(400, "Validation failed");
    }

    const updates = result.output;

    // In a real app, this would update the database
    // For demo purposes, just return success
    const updatedNotification = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return json({
      success: true,
      notification: updatedNotification,
    });
  } catch (err: any) {
    console.error("Update notification error:", err);

    if (err.status) {
      throw err;
    }

    throw error(500, "Failed to update notification");
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // In a real app, this would delete from the database
    // For demo purposes, just return success

    return json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (err: any) {
    console.error("Delete notification error:", err);
    throw error(500, "Failed to delete notification");
  }
}
