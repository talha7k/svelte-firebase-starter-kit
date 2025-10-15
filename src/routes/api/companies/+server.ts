import { json, error } from "@sveltejs/kit";
import * as v from "valibot";

// TODO: Set up Firebase Admin SDK for server-side operations
// For now, this is a placeholder that assumes client-side validation

const createCompanySchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Company name is required"),
    v.maxLength(100, "Company name too long"),
  ),
  description: v.optional(
    v.pipe(v.string(), v.maxLength(500, "Description too long")),
  ),
});

const querySchema = v.object({
  search: v.optional(v.pipe(v.string(), v.maxLength(100))),
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(50))),
});

export async function POST({ request }: { request: Request }) {
  try {
    // TODO: Implement proper server-side authentication with Firebase Admin
    // For now, assume the request is authenticated on the client side

    let body;
    try {
      body = await request.json();
    } catch {
      throw error(400, "Invalid JSON in request body");
    }

    // Validate request body
    const result = v.safeParse(createCompanySchema, body);
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

    const { name, description } = result.output;

    // Validate business rules
    if (name.trim().length === 0) {
      throw error(400, "Company name cannot be empty");
    }

    // TODO: Generate unique company ID and store in Firestore using Firebase Admin
    const companyId = crypto.randomUUID();

    // TODO: Create company document in Firestore
    console.log("Would create company:", {
      id: companyId,
      name: name.trim(),
      description: description?.trim() || "",
      // ... other fields
    });

    // TODO: Update user profile with companyId and mark onboarding as complete

    return json(
      {
        success: true,
        companyId,
        message:
          "Company creation endpoint - implementation pending Firebase Admin setup",
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Company creation error:", err);

    if (err.status) {
      throw err;
    }

    throw error(500, "Internal server error");
  }
}

export async function GET({ url }: { url: URL }) {
  try {
    // Parse and validate query parameters
    const queryParams = {
      search: url.searchParams.get("search") || undefined,
      limit: url.searchParams.get("limit")
        ? parseInt(url.searchParams.get("limit")!)
        : undefined,
    };

    const queryResult = v.safeParse(querySchema, queryParams);
    if (!queryResult.success) {
      throw error(400, "Invalid query parameters");
    }

    const { search, limit = 20 } = queryResult.output;

    // TODO: Implement company discovery with Firebase Admin
    // Return list of companies that allow public joining or have valid invites

    return json({
      companies: [],
      total: 0,
      message:
        "Company discovery endpoint - implementation pending Firebase Admin setup",
    });
  } catch (err: any) {
    console.error("Company discovery error:", err);

    if (err.status) {
      throw err;
    }

    throw error(500, "Failed to fetch companies");
  }
}
