import * as Sentry from "@sentry/nextjs"

import {
  getSentryDsn,
  getSentryEnvironment,
  getSentryRelease,
  isSentryEnabled,
  sentryTracesSampleRate,
} from "@/lib/sentry"

Sentry.init({
  dsn: getSentryDsn(),
  enabled: isSentryEnabled(),
  environment: getSentryEnvironment(),
  release: getSentryRelease(),
  tracesSampleRate: sentryTracesSampleRate,
})
