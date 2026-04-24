# PDF Metadata Audit

## PDFs found in project

| File | Publicly accessible |
|---|---|
| `assets/docs/oneworx-brochure.pdf` | Yes — `/assets/docs/oneworx-brochure.pdf` |

*(Copies under `.claude/worktrees/` are internal git worktrees, not served.)*

---

## Metadata present BEFORE stripping

### `assets/docs/oneworx-brochure.pdf`

**DocInfo fields:**

| Field | Value | Risk |
|---|---|---|
| `/CreationDate` | `D:20260408154325+05'30'` | Exact creation timestamp + timezone (reveals IST/India) |
| `/ModDate` | `D:20260408154331+05'30'` | Modification timestamp |
| `/Creator` | `Adobe InDesign 21.3 (Macintosh)` | Software name, version, and OS type |
| `/Producer` | `Adobe PDF Library 18.0` | Library version — useful for targeting known vulnerabilities |
| `/Trapped` | `False` | Internal print flag |

**XMP metadata stream also contained:**

- `xmp:CreatorTool` — Adobe InDesign 21.3 (Macintosh)
- `xmpMM:InstanceID` — `uuid:69441375-4ba5-ed47-a471-37614e63cfc7`
- `xmpMM:OriginalDocumentID` — `xmp.did:32419fe8-68dd-4651-80ad-a33c32f9249c`
- `xmpMM:DocumentID` — `xmp.id:de3886da-512e-4904-b6d0-f665cff48807`
- `xmpMM:DerivedFrom` — full edit history chain with instance and document UUIDs
- `xmpMM:History` — conversion event log (InDesign → PDF, with timestamp)
- Full creation/modification timestamps with timezone offset

**Why this matters:** The internal document UUIDs, software version, OS type, and timezone
can be used in social engineering ("we noticed you use InDesign on a Mac…") or to correlate
this file with other documents from the same machine.

---

## Metadata AFTER stripping

| Check | Result |
|---|---|
| DocInfo keys remaining | **None** |
| XMP `/Metadata` stream | **Removed** |
| Page count preserved | **19 pages — intact** |
| PDF version | 1.5 (pikepdf re-serialisation — no content change) |

---

## How to strip metadata from new PDFs before publishing

**If exiftool is installed (recommended — install via `brew install exiftool`):**
```bash
exiftool -all= -overwrite_original assets/docs/yourfile.pdf
```

**If using Python/pikepdf:**
```bash
pip3 install pikepdf
python3 - <<'EOF'
import pikepdf, os, sys
pdf_path = sys.argv[1]
clean_path = pdf_path + ".clean"
with pikepdf.open(pdf_path) as pdf:
    for key in list(pdf.docinfo.keys()):
        del pdf.docinfo[key]
    if '/Metadata' in pdf.Root:
        del pdf.Root['/Metadata']
    pdf.save(clean_path)
os.replace(clean_path, pdf_path)
print("Cleaned:", pdf_path)
EOF assets/docs/yourfile.pdf
```

**Recommendation:** Install exiftool once (`brew install exiftool`) and add this to your
pre-commit checklist:
```
exiftool -all= -overwrite_original assets/docs/*.pdf
```
