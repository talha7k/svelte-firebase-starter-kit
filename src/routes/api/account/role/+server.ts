import { json, error } from "@sveltejs/kit";
import * as v from "valibot";

const updateRoleSchema = v.object({
  userId: v.pipe(v.string(), v.nonEmpty("User ID is required")),
  role: v.picklist(["user", "admin", "moderator"], "Invalid role"),
});

export async function POST({ request }: { request: Request }) {
  try {
    // In a real app, you'd authenticate the user here
    // For demo purposes, we'll assume the user is authenticated and is an admin

    const data = await request.json();

    // Validate input
    const result = v.safeParse(updateRoleSchema, data);
    if (!result.success) {
      throw error(400, "Validation failed");
    }

    const { userId, role } = result.output;

    // Set permissions based on role
    const permissions =
      role === "admin"
        ? ["manage_users", "manage_content", "manage_system"]
        : role === "moderator"
          ? ["manage_content", "moderate_users"]
          : [];

    // In a real app, you'd update the database here
    // For demo purposes, we'll just return success

    return json({
      success: true,
      message: "User role updated successfully",
      userId,
      role,
      permissions,
    });
  } catch (err: any) {
    console.error("Role update error:", err);

    if (err.status) {
      throw err;
    }

    throw error(500, "Failed to update user role");
  }
}

export async function GET() {
  try {
    // In a real app, you'd authenticate the user and check permissions here
    // For demo purposes, return mock data

    const users = [
      {
        uid: "user1",
        email: "user@example.com",
        displayName: "John Doe",
        role: "user",
        permissions: [],
      },
      {
        uid: "user2",
        email: "admin@example.com",
        displayName: "Jane Admin",
        role: "admin",
        permissions: ["manage_users", "manage_content", "manage_system"],
      },
    ];

    return json({ users });
  } catch (err: any) {
    console.error("Get users error:", err);
    throw error(500, "Failed to fetch users");
  }
}
