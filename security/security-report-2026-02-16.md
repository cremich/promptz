# Security Report — Promptz.dev

**Date:** 2026-02-16  
**Repository:** cremich/promptz  
**Tech Stack:** Next.js 16.1.1, React 19.2.3, TypeScript 5, Tailwind CSS 4  
**Application Type:** Static content platform (no backend/database)  
**Deployment:** AWS Amplify

---

## Executive Summary

**Overall Security Posture: Low Risk**

Promptz.dev is a statically-generated content platform with no backend, no database, no authentication, and no user-submitted data at runtime. The attack surface is inherently small. However, several areas warrant attention — particularly around XSS via `dangerouslySetInnerHTML`, missing security headers, and supply chain trust boundaries with git submodules.

| Severity | Count |
|----------|-------|
| High     | 1     |
| Medium   | 3     |
| Low      | 4     |
| Info     | 3     |

---

## Detailed Findings

### HIGH-1: Cross-Site Scripting (XSS) via `dangerouslySetInnerHTML` in Search Results

- **Severity:** High
- **Category:** CWE-79 (XSS), OWASP A03:2025 Injection
- **Location:** `components/search/search-results.tsx:49-52`, `lib/search.ts:22-40`

**Description:**  
The `highlightMatches()` function constructs an HTML string by slicing the original title text and wrapping matched portions in `<mark>` tags. This HTML string is then rendered via `dangerouslySetInnerHTML` in `search-results.tsx`. The title text originates from content in git submodules (community-contributed), which is indexed at build time into `search-index.json` without HTML entity encoding.

If a content title contains HTML/script characters (e.g., `<img onerror=alert(1)>` or `<script>` tags), these would be rendered as live HTML in the browser.

**Impact:**  
A malicious contributor could craft a content title in a submodule that executes arbitrary JavaScript in visitors' browsers — stealing cookies (if any), redirecting users, or defacing the page.

**Recommendation:**  
Escape HTML entities in the title text before inserting `<mark>` tags:

```typescript
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function highlightMatches(text: string, matches?: readonly FuseResultMatch[]): string {
  const escaped = escapeHtml(text)
  if (!matches || matches.length === 0) return escaped
  // ... rest of logic using escaped text
}
```

Alternatively, refactor to return React elements instead of an HTML string, eliminating `dangerouslySetInnerHTML` entirely.

---

### MED-1: Missing Security Headers

- **Severity:** Medium
- **Category:** CWE-1021 (Improper Restriction of Rendered UI Layers), OWASP A05:2025 Security Misconfiguration
- **Location:** `next.config.ts` (missing `headers()` config), no `middleware.ts` present

**Description:**  
The application does not configure any HTTP security headers. There is no `headers()` function in `next.config.ts` and no `middleware.ts` file. The following headers are absent:

- `Content-Security-Policy` (CSP)
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Strict-Transport-Security` (HSTS)

**Impact:**  
Without CSP, the XSS finding (HIGH-1) becomes more exploitable. Without `X-Frame-Options`, the site is vulnerable to clickjacking. Missing `X-Content-Type-Options` allows MIME-type sniffing attacks.

**Recommendation:**  
Add a `headers()` function to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.posthog.com; frame-ancestors 'none';"
        },
      ],
    },
  ]
},
```

Note: The CSP above is a starting point. Refine `script-src` to use nonces instead of `'unsafe-inline'` for stronger protection.

---

### MED-2: Untrusted Content from Git Submodules (Supply Chain)

- **Severity:** Medium
- **Category:** CWE-829 (Inclusion of Functionality from Untrusted Control Sphere), OWASP A08:2025 Software and Data Integrity Failures
- **Location:** `.gitmodules`, `scripts/generate-library-data.ts`, `scripts/metadata-extractor.ts`

**Description:**  
The application ingests content from 5 git submodules, including community-contributed repositories (`promptz`, `kiro-best-practices`). Content from these submodules — YAML frontmatter, markdown bodies, JSON configs — is parsed at build time and served to users. There is no content sanitization layer between submodule content and the generated JSON data files.

The `gray-matter` library parses YAML frontmatter, which historically has had prototype pollution vulnerabilities. While the current version (4.0.3) is not known to be vulnerable, the trust boundary is worth noting.

**Impact:**  
A malicious contributor to any submodule could inject content that exploits parsing vulnerabilities or includes malicious content rendered to users (see HIGH-1).

**Recommendation:**
1. Add a content sanitization step in `scripts/generate-library-data.ts` that strips HTML tags from titles, descriptions, and other text fields
2. Pin submodule commits and review changes before updating
3. Consider adding a CI check that validates submodule content against an allowlist of safe characters in key fields (title, author, description)

---

### MED-3: Search Query Tracking Without Rate Limiting

- **Severity:** Medium
- **Category:** CWE-799 (Improper Control of Interaction Frequency), OWASP A05:2025 Security Misconfiguration
- **Location:** `lib/analytics.ts`, `components/search/useSearchModal.ts:130-131`

**Description:**  
Every search query of 3+ characters is sent to PostHog via `analytics.trackSearch()`. While there's a 300ms debounce, there's no rate limiting on the client side. A script could rapidly fire search events, potentially exhausting PostHog free tier limits or generating excessive analytics data.

**Impact:**  
Analytics quota exhaustion, noisy data, minor cost implications. Low direct security impact but could be used for denial-of-service against the analytics budget.

**Recommendation:**  
Add a simple client-side rate limiter (e.g., max 10 search events per minute) in the analytics module. PostHog's `cookieless_mode: 'always'` is already a good privacy practice.

---

### LOW-1: PostHog Initialization with Empty String Fallback

- **Severity:** Low
- **Category:** CWE-209 (Generation of Error Message Containing Sensitive Information)
- **Location:** `instrumentation-client.ts:4`

**Description:**  
PostHog is initialized with `process.env.NEXT_PUBLIC_POSTHOG_KEY || ""`. If the environment variable is missing, PostHog initializes with an empty API key, which may cause silent errors or unexpected behavior rather than failing explicitly.

**Impact:**  
No direct security impact, but could mask configuration issues in development/staging environments.

**Recommendation:**  
Guard the initialization:

```typescript
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
if (posthogKey) {
  posthog.init(posthogKey, { ... })
}
```

---

### LOW-2: Git Author Email Exposure in Generated Data

- **Severity:** Low
- **Category:** CWE-200 (Exposure of Sensitive Information)
- **Location:** `scripts/git-extractor.ts:8`, `lib/types/content.ts:5`

**Description:**  
The `GitInfo` type includes `authorEmail` extracted from git history. This email address is included in the generated JSON data files and potentially served to the client, exposing contributor email addresses.

**Impact:**  
Email harvesting for spam or social engineering. Contributors may not expect their git commit emails to be publicly displayed.

**Recommendation:**  
Review whether `authorEmail` is actually rendered in the UI. If not needed client-side, strip it during the build step. If needed, consider hashing or omitting it from the client-facing JSON.

---

### LOW-3: Error Messages May Leak Internal Paths

- **Severity:** Low
- **Category:** CWE-209 (Information Exposure Through Error Messages)
- **Location:** `scripts/library-file-parser.ts:16`, `scripts/git-extractor.ts:67`, `scripts/metadata-extractor.ts:42`

**Description:**  
Build-time scripts use `console.warn()` with file paths when operations fail. While these only appear in build logs (not served to users), if build logs are publicly accessible (e.g., in CI/CD), they could reveal internal directory structure.

**Impact:**  
Information disclosure of server file paths. Minimal risk since this is a static site.

**Recommendation:**  
Ensure Amplify build logs are not publicly accessible. Consider sanitizing file paths in log output to show only relative paths (which the code already mostly does).

---

### LOW-4: No Subresource Integrity (SRI) for External Scripts

- **Severity:** Low
- **Category:** CWE-353 (Missing Support for Integrity Check), OWASP A08:2025 Software and Data Integrity Failures
- **Location:** `app/layout.tsx`

**Description:**  
The application loads Google Fonts via `next/font/google`. While Next.js handles this securely by self-hosting font files, if any external scripts or CDN resources are added in the future, there's no SRI enforcement pattern established.

**Impact:**  
Currently minimal. Future risk if external resources are added without integrity checks.

**Recommendation:**  
Document a policy that any external resource must include SRI hashes. Consider adding this to the CSP when implemented.

---

### INFO-1: No `robots.txt` Restrictions on Sensitive Paths

- **Severity:** Info
- **Location:** No `public/robots.txt` found (relies on metadata `robots` config)

**Description:**  
The `metadata` in `layout.tsx` sets `robots: { index: true, follow: true }` globally. There's no `robots.txt` to restrict crawling of any paths. The sitemap at `app/sitemap.ts` exposes all content routes.

**Impact:**  
No sensitive data is exposed since this is a public content site. This is informational only.

---

### INFO-2: Dependencies Are Current — No Known Vulnerabilities

- **Severity:** Info
- **Location:** `package.json`

**Description:**  
`npm audit` reports zero vulnerabilities across all 1,030 dependencies. Some packages have minor version updates available (`@next/mdx`, `posthog-js`, `react`), but none are security-related.

**Impact:**  
Positive finding. The dependency tree is clean.

**Recommendation:**  
Continue running `npm audit` in CI. Consider using Dependabot or Renovate for automated dependency updates.

---

### INFO-3: `.env` Files Properly Gitignored

- **Severity:** Info
- **Location:** `.gitignore`

**Description:**  
The `.gitignore` includes `.env*`, preventing accidental commit of environment files. The only environment variables used are `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`, which are public-facing analytics keys (not secrets).

**Impact:**  
Positive finding. No secrets at risk.

---

## Security Checklist

- [x] No hardcoded secrets or credentials
- [x] All dependencies up-to-date and verified (`npm audit` clean)
- [ ] Input validation on all user inputs (search query not sanitized before HTML rendering)
- [x] Proper authentication and authorization (N/A — no auth required for public content site)
- [x] Secure cryptographic practices (N/A — no crypto operations)
- [x] Logging and monitoring in place (PostHog analytics, build-time logging)
- [x] Error handling doesn't expose sensitive info to end users
- [ ] Supply chain security measures implemented (submodule content not sanitized)
- [x] Infrastructure properly configured (Amplify deployment, `.env` gitignored)
- [ ] Security headers configured (none present)

---

## Priority Remediation Plan

1. **Immediate (HIGH-1):** Sanitize HTML in `highlightMatches()` or refactor to use React elements instead of `dangerouslySetInnerHTML`
2. **Short-term (MED-1):** Add security headers via `next.config.ts` `headers()` function
3. **Short-term (MED-2):** Add content sanitization in the build pipeline for submodule content
4. **Low priority:** Address remaining Low/Info findings as part of regular maintenance
