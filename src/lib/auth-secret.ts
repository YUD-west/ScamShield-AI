/** Single AUTH_SECRET for NextAuth + middleware (must match .env) */
export const AUTH_SECRET =
  process.env.AUTH_SECRET ?? "scamshield-dev-secret-min-32-characters-long";
