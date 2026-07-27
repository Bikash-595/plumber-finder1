export type AppRole =
  | "public"
  | "customer"
  | "company"
  | "freelancer"
  | "admin";

export type AppShellConfig = {
  name: string;
  role: AppRole;
  homePath: string;
  apiScope: string;
};

export const appShells: Record<AppRole, AppShellConfig> = {
  public: {
    name: "Public Website",
    role: "public",
    homePath: "/",
    apiScope: "public",
  },
  customer: {
    name: "User Dashboard",
    role: "customer",
    homePath: "/dashboard",
    apiScope: "customer",
  },
  company: {
    name: "Plumber Listing Company",
    role: "company",
    homePath: "/company",
    apiScope: "company",
  },
  freelancer: {
    name: "Freelancer Plumber",
    role: "freelancer",
    homePath: "/freelancer",
    apiScope: "freelancer",
  },
  admin: {
    name: "Admin Console",
    role: "admin",
    homePath: "/admin",
    apiScope: "admin",
  },
};
