// instrumentation-client.js
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    cookieless_mode: 'always', 
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-11-30'
});
            