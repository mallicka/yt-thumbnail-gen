/**
 * When running inside Docker Compose dev, swap to the internal Postgres URL
 * so `.env` can keep a localhost URL for native development.
 */
export function applyDatabaseUrlFromEnvironment(): void {
  if (
    process.env.IS_IN_DOCKER_COMPOSE === "true" &&
    process.env.DOCKER_COMPOSE_DATABASE_URL
  ) {
    process.env.DATABASE_URL = process.env.DOCKER_COMPOSE_DATABASE_URL;
  }
}

export function getDatabaseUrl(): string {
  applyDatabaseUrlFromEnvironment();

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  return url;
}
