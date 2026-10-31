const FALLBACK_SENTRY_DSN =
  "https://f0a527671d350f4d1ed1d68b1b5c88cb@o4510091891769344.ingest.de.sentry.io/4512351983108176"

export function getSentryDsn(): string {
  return (
    process.env.NEXT_PUBLIC_SENTRY_DSN ??
    process.env.SENTRY_DSN ??
    FALLBACK_SENTRY_DSN
  )
}

/** Report to Sentry only on Vercel production, or local `next start` after a prod build. */
export function isSentryEnabled(): boolean {
  const vercelEnv = process.env.VERCEL_ENV
  if (vercelEnv) {
    return vercelEnv === "production"
  }
  return process.env.NODE_ENV === "production"
}

export function getSentryEnvironment(): string {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development"
}

export function getSentryRelease(): string | undefined {
  return process.env.VERCEL_GIT_COMMIT_SHA
}

export const sentryTracesSampleRate = 0.2
