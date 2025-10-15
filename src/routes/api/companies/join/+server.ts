import { json, error } from "@sveltejs/kit";
import * as v from "valibot";

const joinCompanySchema = v.object({
  inviteCode: v.pipe(
    v.string(),
    v.minLength(1, "Invite code is required"),
    v.regex(/^[A-Z0-9]{8}$/, "Invalid invite code format"),
  ),
});

export async function POST({ request }: { request: Request }) {
  try {
    // TODO: Implement proper server-side authentication with Firebase Admin

    let body;
    try {
      body = await request.json();
    } catch {
      throw error(400, "Invalid JSON in request body");
    }

    // Validate request body
    const result = v.safeParse(joinCompanySchema, body);
    if (!result.success) {
      const validationErrors = result.issues.map((issue) => ({
        field: issue.path?.[0]?.key || "unknown",
        message: issue.message,
      }));
      throw error(
        400,
        `Validation failed: ${validationErrors.map((e) => e.message).join(", ")}`,
      );
    }

    const { inviteCode } = result.output;

    // TODO: Validate invite code exists and is valid
    // TODO: Check if user is already a member of a company
    // TODO: Check if company allows new members
    // TODO: Add user to company members list
    // TODO: Update user profile with companyId and mark onboarding as complete

    console.log("Would join company with invite code:", inviteCode);

    return json(
      {
        success: true,
        message: "Successfully joined company",
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Company join error:", err);

    if (err.status) {
      throw err;
    }

    throw error(500, "Failed to join company");
  }
}
