import { json, error } from "@sveltejs/kit";
import { updatePasswordSchema } from "$lib/schemas/user/update-password";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import * as v from "valibot";

export async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw error(401, "User not authenticated");
    }

    const data = await request.json();

    // Validate input
    const result = v.safeParse(updatePasswordSchema, data);
    if (!result.success) {
      throw error(400, "Validation failed");
    }

    const { currentPassword, newPassword } = result.output;

    // Reauthenticate user with current password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return json({ success: true, message: "Password updated successfully" });
  } catch (err: any) {
    console.error("Password update error:", err);

    if (err.status) {
      throw err;
    }

    if (err.code === "auth/wrong-password") {
      throw error(400, "Current password is incorrect");
    }

    if (err.code === "auth/weak-password") {
      throw error(400, "New password is too weak");
    }

    if (err.code === "auth/requires-recent-login") {
      throw error(401, "Please sign in again to update your password");
    }

    throw error(500, "Failed to update password");
  }
}
