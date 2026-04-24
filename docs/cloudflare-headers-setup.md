# Cloudflare Security Headers Setup

Use this as a fallback if the `_headers` file doesn't serve headers correctly (e.g. if the CDN layer strips them).

## How to Add Headers via Cloudflare Transform Rules

1. Log in to the Cloudflare dashboard → select the `oneworx.in` zone
2. Go to **Rules → Transform Rules**
3. Click **Modify Response Header**
4. Click **Create Rule**
5. Set **Rule name**: `Security Headers`
6. Under **When incoming requests match**: choose `All incoming requests` (or set a URI path match of `/*`)
7. Under **Then**: choose **Add** for each header below

### Headers to Add

| Header Name | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' https://connect.facebook.net https://www.facebook.net; img-src 'self' data: https://www.facebook.com https://*.fbcdn.net; frame-src 'none'; frame-ancestors 'none'; media-src 'self'; font-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://www.facebook.com; object-src 'none'; base-uri 'self'; form-action 'self' https://formspree.io https://api.web3forms.com https://submit-form.com;` |

8. Click **Save** and **Deploy**

> Note: If a header already exists in the response, use **Set** instead of **Add** to override it.

## Verifying Headers Are Working

Run this command after deployment:

```bash
curl -I https://oneworx.in
```

You should see all six headers in the response. Example expected output:

```
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
permissions-policy: geolocation=(), camera=(), microphone=(), payment=()
content-security-policy: default-src 'self'; ...
```

You can also use [securityheaders.com](https://securityheaders.com/?q=oneworx.in) for a visual report.

## Primary vs Fallback

- **Primary**: The `_headers` file in the project root is picked up automatically by the static hosting platform (Netlify / DigitalOcean App Platform).
- **Fallback**: If headers are being stripped or not applied (verify with `curl -I`), add them as Cloudflare Transform Rules above — Cloudflare injects them at the CDN edge regardless of the origin server response.
