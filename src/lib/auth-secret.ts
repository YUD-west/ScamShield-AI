/** Single AUTH_SECRET for NextAuth + middleware (MUST BE SET IN PRODUCTION) */
export const AUTH_SECRET = (() => {
  const secret = process.env.AUTH_SECRET;

  // Strict validation in production
  if (process.env.NODE_ENV === "production") {
    if (!secret) {
      throw new Error(
        "❌ AUTH_SECRET environment variable is required in production. " +
        "Generate with: openssl rand -base64 32"
      );
    }
    if (secret.length < 32) {
      throw new Error(
        `❌ AUTH_SECRET must be at least 32 characters long (got ${secret.length})`
      );
    }
    if (secret === "scamshield-dev-secret-min-32-characters-long") {
      throw new Error(
        "❌ AUTH_SECRET is using the development default! This is a security risk. " +
        "Generate a new random secret with: openssl rand -base64 32"
      );
    }
  }

  // Allow dev default only in development
  return (
    secret ?? (
      process.env.NODE_ENV === "development"
        ? "scamshield-dev-secret-min-32-characters-long"
        : undefined
    )
  ) as string;
})();