/** Dev-only accounts when DATABASE_URL is not set (NODE_ENV=development). */
export const DEV_ACCOUNTS = [
  {
    id: "dev-demo-user",
    email: "demo@scamshield.ai",
    password: "Demo1234!",
    name: "Demo User",
    role: "user",
  },
  {
    id: "dev-admin-user",
    email: "admin@scamshield.ai",
    password: "Admin1234!",
    name: "Admin User",
    role: "admin",
  },
] as const;

export function findDevAccount(email: string, password: string) {
  if (process.env.NODE_ENV === "production") return null;
  return DEV_ACCOUNTS.find((a) => a.email === email && a.password === password) ?? null;
}
