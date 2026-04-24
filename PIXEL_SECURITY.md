# Facebook Pixel Security Hardening

## What was changed
- Removed noscript tracking pixel (was exposing Pixel ID in plain HTML)
- Wrapped pixel init in consent-gated function

## What you must do in Meta Business Manager
1. Go to Events Manager → your Pixel → Settings
2. Enable "Aggregated Event Measurement"
3. Verify your domain: Business Settings → Brand Safety → Domains → Add oneworx.in
4. Under Pixel Settings → "Allowed Domains" → add only: oneworx.in
5. Set up Server-Side Conversions API (optional but recommended):
   - Events Manager → Add New Data Source → Conversions API
   - Use a cloud function or your form handler backend to send events server-side
   - This eliminates the client-side pixel entirely (most secure option)

## Rate limiting fake events
- In Events Manager → your Pixel → Diagnostics — monitor for unusual event spikes
- Enable "Automatic Advanced Matching" only if needed; it sends more user data to Meta
