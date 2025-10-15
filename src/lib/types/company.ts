import type { Timestamp } from "@firebase/firestore";

export type CompanyRole = "admin" | "member";

export interface CompanyMember {
  uid: string;
  role: CompanyRole;
  joinedAt: Timestamp;
}

export interface Company {
  id: string; // Firestore document ID
  name: string;
  ownerUid: string;

  // Membership management
  members: CompanyMember[];

  // Company settings
  inviteCode?: string; // Optional invite code for joining
  allowPublicJoining: boolean; // Whether new users can join without invite

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Additional metadata
  description?: string;
  website?: string;
  industry?: string;
}
