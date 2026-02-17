// instrumentation-client.js
import posthog from 'posthog-js'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
if (posthogKey) {
  posthog.init(posthogKey, {
    cookieless_mode: 'always',
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-11-30'
  })
}
            