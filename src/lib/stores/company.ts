import { writable } from "svelte/store";
import type { Company } from "$lib/types/company";

type CompanyStore = {
  data: Company | undefined;
  loading: boolean;
  error: any;
  update: (data: Partial<Company>) => Promise<void>;
  load: (companyId: string) => Promise<void>;
  create: (
    companyData: Omit<Company, "id" | "createdAt" | "updatedAt">,
  ) => Promise<string>;
};

export const company = writable<CompanyStore>({
  data: undefined,
  loading: false,
  error: null,
  update: async () => {},
  load: async () => {},
  create: async () => "",
});
