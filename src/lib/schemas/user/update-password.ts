import * as v from "valibot";

export const updatePasswordSchema = v.object({
  currentPassword: v.pipe(
    v.string(),
    v.nonEmpty("Current password is required."),
  ),
  newPassword: v.pipe(
    v.string(),
    v.nonEmpty("New password is required."),
    v.minLength(8, "Password must be at least 8 characters long."),
    v.regex(/[A-Z]/, "Password must contain at least one uppercase letter."),
    v.regex(/[a-z]/, "Password must contain at least one lowercase letter."),
    v.regex(/[0-9]/, "Password must contain at least one number."),
  ),
  confirmPassword: v.pipe(
    v.string(),
    v.nonEmpty("Please confirm your new password."),
  ),
});

export type UpdatePasswordData = v.InferInput<typeof updatePasswordSchema>;
