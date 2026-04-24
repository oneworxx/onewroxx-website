# DNS Changes Required — oneworx.in

## What Are CAA Records?

**Certification Authority Authorization (CAA)** is a DNS record type (RFC 6844) that lets you declare which Certificate Authorities (CAs) are allowed to issue SSL/TLS certificates for your domain.

Without a CAA record, **any** CA in the world can issue a certificate for `oneworx.in` — including rogue or mis-issuing CAs. CAA records are a cheap, high-value defence: browsers and CAs check them before issuance, and most major CAs are contractually required (by the CA/Browser Forum) to honour them.

### The `iodef` Tag

The `iodef` tag tells a CA where to send a violation report if something requests a certificate that your CAA policy does not permit. Setting it to `mailto:accounts@oneworx.in` means you get an email alert whenever an unauthorised CA attempts to issue for your domain — useful early-warning for certificate mis-issuance or a hijack attempt.

---

## Step 1 — Identify Your Current Certificate Issuer

Before adding CAA records, confirm which CA is currently issuing your certificate so you don't accidentally lock yourself out of renewals.

1. Visit **https://oneworx.in** in Chrome or Firefox
2. Click the **padlock icon** in the address bar → **Certificate** (or "Connection is secure" → "Certificate is valid")
3. Look at **Issued By / Organization** — common values:
   - `Let's Encrypt` (used by DigitalOcean App Platform and Cloudflare free/pro)
   - `Cloudflare Inc ECC CA-3` or `Google Trust Services` (used by Cloudflare)
   - `DigiCert` (used by Cloudflare Business/Enterprise)

> **Likely answer for this site:** DigitalOcean App Platform provisions Let's Encrypt certs automatically. If Cloudflare is in front (as a proxy), Cloudflare issues its own edge certificate (from Cloudflare PKI / Google Trust Services) while Let's Encrypt handles the origin cert.

---

## Step 2 — Add CAA Records in DigitalOcean DNS

Go to: **DigitalOcean Control Panel → Networking → Domains → oneworx.in → Add Record**

Add each of the following four records:

### Record 1 — Allow Let's Encrypt to issue certificates
| Field | Value |
|---|---|
| **Type** | CAA |
| **Hostname** | `@` |
| **Flag** | `0` |
| **Tag** | `issue` |
| **Value** | `letsencrypt.org` |

### Record 2 — Allow DigiCert to issue certificates
| Field | Value |
|---|---|
| **Type** | CAA |
| **Hostname** | `@` |
| **Flag** | `0` |
| **Tag** | `issue` |
| **Value** | `digicert.com` |

### Record 3 — Allow Let's Encrypt to issue wildcard certificates
| Field | Value |
|---|---|
| **Type** | CAA |
| **Hostname** | `@` |
| **Flag** | `0` |
| **Tag** | `issuewild` |
| **Value** | `letsencrypt.org` |

### Record 4 — Receive violation alerts by email
| Field | Value |
|---|---|
| **Type** | CAA |
| **Hostname** | `@` |
| **Flag** | `0` |
| **Tag** | `iodef` |
| **Value** | `mailto:accounts@oneworx.in` |

---

## Cloudflare Fallback Records

> **If Cloudflare is proxying your traffic (orange cloud enabled)**, Cloudflare issues its own edge certificate independently of DigitalOcean. You should also add these two CAs:

| Tag | Value | Reason |
|---|---|---|
| `issue` | `comodoca.com` | Sectigo/Comodo — used by some Cloudflare plans |
| `issue` | `pki.goog` | Google Trust Services — used by Cloudflare for edge certs |

Add these as additional CAA records with `Flag: 0` and `Hostname: @` using the same process above.

---

## Step 3 — Verify the Records Propagated

Run either of these commands after saving (propagation usually takes 5–30 minutes):

```bash
# Using dig
dig CAA oneworx.in

# Using nslookup
nslookup -type=CAA oneworx.in
```

Expected output once records are live:
```
oneworx.in.  3600  IN  CAA  0 issue "letsencrypt.org"
oneworx.in.  3600  IN  CAA  0 issue "digicert.com"
oneworx.in.  3600  IN  CAA  0 issuewild "letsencrypt.org"
oneworx.in.  3600  IN  CAA  0 iodef "mailto:accounts@oneworx.in"
```

You can also verify at: **https://www.sslshopper.com/ssl-checker.html** or **https://caatest.co.uk**

---

## Important Warnings

- **Do not add CAA records before confirming your CA.** If you set `issue "letsencrypt.org"` only and your cert is actually issued by DigiCert, your next renewal will fail and the site will go down.
- **`issuewild` is separate from `issue`.** A wildcard cert (`*.oneworx.in`) requires an explicit `issuewild` entry even if `issue` already allows the same CA.
- **CAA records apply to the domain, not subdomains individually** — unless you add CAA records on the subdomain itself. Records at `@` cover `oneworx.in` and any subdomain that doesn't have its own CAA record.
