# DECISIONS.md

The why behind every meaningful choice in this project. Append, don't rewrite. When a decision is later overridden, leave the old entry and add a new one marked **Superseded** so the audit trail is intact.

For quick orientation, see `CLAUDE.md`. For deeper context (sources, regulatory references), see `~/.claude/projects/C--Users-RodrigoBotti/memory/`. This file is the long-form rationale archive that survives chat sessions.

---

## 1. Genesis

**The brief.** A landing page for Ariel SSPE that does not feel made by AI. Editorial in tone, restrained in color, technically credible to investors and cedents reading it. Bilingual PT-BR / EN. To go live in about a week from the kick-off (May 2026).

**Authority.** Rodrigo (co-founder, investor, ONE Partners partner) is the editorial and brand authority. Aline (CEO-elect) and Eduardo (CFO-elect) are co-founders. ONE Partners is strategic partner and investor (banking arm of the firm, not the multi-family office side — distinction matters).

**Audience.** Two layered constituencies:
- **Investors** — sophisticated capital seeking an uncorrelated asset class
- **Cedentes** — Brazilian risk owners: seguradoras, resseguradoras, mútuas, cooperativas, fundos de pensão, planos de saúde

---

## 2. Brand identity

### 2.1 Naming hierarchy
- **Wordmark** (marketing): `Ariel`
- **Compact form** (nav, breadcrumbs): `Ariel SSPE`
- **Legal form** (footer, disclosures): `Ariel Sociedade Seguradora de Propósito Específico S.A.`

**Why.** Top financial brands layer their identity by context (BlackRock, Bridgewater, etc.). One name across all surfaces flattens the brand; the legal form everywhere is heavy and formal. Layering keeps it light where it should be light and formal where law requires it.

### 2.2 SSPE means "Sociedade Seguradora de Propósito Específico"

The leading "S" is for **Sociedade** (Company). Earlier drafts dropped it and rendered the expansion as "Seguradora de Propósito Específico" (which is SPE, not SSPE). Corrected on 2026-05-11 across the site, README, CSS comment, and memory.

**Lesson.** Never assume an acronym expansion. Ask, or verify against the legal name.

### 2.3 Color palette is restricted to brand
- `#00565F` (dark green)
- `#00797D` (medium green)
- `#009997` (light green)
- `#98989A` (gray)
- `#D1D2D4` (light gray)

Plus near-black `#06080A` / warm off-white `#F5F4F0` for theme grounds, and a single warm-ink for body. **No other hex values allowed in code.** An early draft used `#00B5A8` as an "accent" outside the palette; Rodrigo caught it and we ripped it out.

### 2.4 No gold accent
Tried, rejected. **Why.** In a teal-on-near-black palette, gold reads as the cliché "luxury finance" move (think: every wealth-management firm in São Paulo). It cheapens the design more than it elevates it. Editorial seriousness comes from restraint, not opulence.

### 2.5 Typography: Fraunces + Inter
- **Display**: Fraunces (variable, Google Fonts; `opsz` 144 and `SOFT` 30-80 axes used purposefully on headlines and italic sub-treatments)
- **Body / UI**: Inter (variable, Google Fonts)

**Why.** Paid foundries (Klim's *Tiempos* / *Söhne*, Grilli's *GT Sectra*, Displaay's *Reckless*) explicitly ruled out by Rodrigo. Of the free options, Fraunces offers the editorial Didone-warmth-and-character that the brief asked for, and Inter is the right neutral partner. Avoided Playfair (overused) and Cormorant (too narrow for display).

### 2.6 Logo: mermaid illustration
Two variants supplied:
- `assets/logo-dark.png` — green-tinted mermaid on black ground (used in dark theme)
- `assets/logo-light.png` — black-and-white pencil mermaid on light ground (used in light theme)

Each variant designed for its own ground. Originals at multi-MB resolution were downsampled to ~256×256 (~100 KB each) for production use; originals are preserved in `assets/originals/`. The big logo was originally in the hero; later removed at Rodrigo's request because the design wasn't yet locked, leaving only the small mark in the nav.

---

## 3. Technical architecture

### 3.1 Static site, no framework, no build step
HTML + CSS + vanilla JS. Two HTML files for PT and EN. Single shared `styles.css` and `script.js`.

**Why.** A bilingual one-pager doesn't justify a framework. Static HTML is faster, simpler to host, more durable, and the editing flow is `edit → git push` without npm install, build, or deploy step. A future developer (or AI agent) opening this folder doesn't need to install anything to make a change.

### 3.2 Two HTML files (not JS i18n)
`index.html` is the PT page; `en.html` is EN. Toggle is a simple link, not a JS-driven content swap.

**Why.** SEO (search engines see two complete pages), no JS dependency for content, easier maintenance. The trade-off is that PT and EN edits must be made in parallel — documented in CLAUDE.md.

### 3.3 Hosting: GitHub Pages + GoDaddy DNS
Repo at `github.com/rodbotti/arielsspe-site`, public. Deployed automatically on `git push` to `main`. Domain `arielsspe.com` registered at GoDaddy; DNS lives at GoDaddy too. CNAME file in repo root tells Pages to serve from custom domain.

**Why.** Free, simple, reliable for a marketing site. No CI/CD complexity. Custom domain + HTTPS automatic. GoDaddy was already the domain registrar — no point migrating just to host elsewhere.

**Gotcha.** GoDaddy had a `WebsiteBuilder Site` A record at `@` that conflicted with the GitHub Pages IPs. Had to be deleted manually. See section 8.1.

### 3.4 Form backend: Formspree
Endpoint `https://formspree.io/f/mjgljqok` set via `window.ARIEL_FORM_ENDPOINT` in an inline `<script>` on both HTML pages. If the endpoint variable is unset, code falls back to `mailto:contato@arielsspe.com`.

**Why.** Formspree is the lowest-friction option for a static site (no server needed, no Lambda, no Cloudflare Workers). Free tier covers ~50 submissions/month which is more than this site will see. The mailto fallback exists as defense-in-depth (if Formspree is down or misconfigured, the form still works).

### 3.5 Diagram: hand-drawn inline SVG
The LRS flow diagram in the "O que é uma LRS" section is inline SVG written by hand, not exported from a tool. Strokes and fills bind to CSS custom properties so it re-tints with the theme.

**Why.** A diagram exported from PowerPoint, Lucid, or Figma is one of the strongest AI/template tells. A custom, restrained, typographic SVG (three stations, hairlines, italic labels) signals "designed for this site" the way nothing else does.

---

## 4. Copy and content

### 4.1 "Investidor" in marketing; "investidor profissional" only in regulated text
Marketing copy (hero, audience cards, contact section) uses `investidor`. Compliance text (CVM 160 declaration in form, footer disclaimer, "Distribuição" item in `operates`) uses `investidor profissional`.

**Why.** "Investidor profissional" is a CVM 160 term of art with specific regulatory meaning. Using it everywhere makes the marketing read as legalistic. Using only "investidor" everywhere would remove the necessary compliance language. Layering preserves both readability and legal compliance.

### 4.2 Cedente terminology
- Umbrella (when compact): `cedentes`
- Descriptive (when listing): see 4.2.1

#### 4.2.1 PT/EN asymmetry in the descriptive list
- **PT (6 entities)**: `seguradoras, resseguradoras, mútuas, cooperativas, fundos de pensão, e planos de saúde`
- **EN (4 entities)**: `insurers, reinsurers, pension funds, and health plans`

**Why.** Rodrigo expanded the PT list to include mútuas and cooperativas (entities specific to the Brazilian context). EN was kept at the original 4 because mutual and cooperative insurance structures don't map cleanly to international vocabulary — listing them in EN would create more confusion than clarity. **Do not "sync" EN to PT.**

### 4.3 Future tense for Ariel's actions
Hero subhead and meta description use future tense: `estruturará e emitirá` / `will structure and issue`, `Captaremos` / `will channel`, `alocaremos` / `deploy`.

**Why.** Ariel has provisional SUSEP approval but operating authorization is still in homologation as of May 2026 — strictly speaking, Ariel cannot yet issue LRS. Present tense would be misleading. When SUSEP grants the operating authorization, do the sweep documented in CLAUDE.md section "When full operating authorization is granted."

### 4.4 Spell out acronyms on first mention
Examples: "Associação Nacional das Resseguradoras Locais (AN-Re)", "Associate in Reinsurance (ARe)", "Insurance Linked Securities (ILS)", "Letras de Risco de Seguro (LRS)". In the body's first appearance only.

**Why.** Editorial standard. Rodrigo flagged this specifically on team bios — keeps the page accessible to readers who don't yet know the vocabulary.

### 4.5 "Special-Purpose Insurer" is the agreed EN rendering of SSPE
Briefly switched to "Special-Purpose Insurance Company" during the Sociedade correction; reverted on Rodrigo's instruction. **Do not change again.**

**Why.** Shorter, more established as English insurance vocabulary. Bermuda's SPI is a separate concept but the linguistic overlap is acceptable.

### 4.6 Lists end with a period; sentence fragments don't get added at the end
The contact section enumeration ends with a closing sentence ("Respondemos em até dois dias úteis"). Earlier draft truncated to a list-as-tagline; restored after Rodrigo asked for the trailing "e outros interessados em estruturar uma operação" to come back.

**Lesson.** When the user gives you a list as a replacement for a sentence, ask before dropping the sentence-completing parts around it.

---

## 5. Theme system

### 5.1 Light is the default; OS preference is ignored
Inline `<script>` in `<head>` sets `data-theme="light"` before paint unless the user has explicitly chosen otherwise (stored in `localStorage` under `ariel.theme`). The `prefers-color-scheme` media query is not consulted.

**Why.** Most developers run their OS in dark mode, and seeing the site default to dark felt "tech startup", not "institutional Brazilian SSPE". Light is more conventional for editorial finance brands. Saved user preference still wins so anyone who clicks the moon keeps dark.

### 5.2 Sun/moon toggle in nav next to PT/EN
Pill chip, same shape and size as the language chip. Icons swap with opacity + rotation transition.

### 5.3 Logo swap per theme (CSS only, no JS)
Both `logo-dark.png` and `logo-light.png` are rendered in the DOM; CSS variables `--logo-dark-display` and `--logo-light-display` toggle their visibility based on `[data-theme]`. No JS swapping the `src`.

**Why.** Avoids a flash when changing theme. The downloaded weight is small (~200 KB total) so loading both isn't an issue.

### 5.4 Pillars section ("Por que LRS, agora") has a green-ground in both themes
The middle of the page uses `--accent-deep` (`#00565F`) as a structural background, with white text. This holds in both light and dark themes.

**Why.** Color as architecture, not decoration. The green ground anchors the page editorially, gives a visual hinge between the hero/intro context above and the operational detail below.

---

## 6. Regulatory language calibration (May 2026)

Ariel has provisional SUSEP approval (December 2025) but does NOT yet have operating authorization. The site is calibrated to that reality in five places:

1. **Hero subhead** — future tense (4.3)
2. **`operates` section, "Estrutura" item** — names the homologation phase explicitly: "Autorização para operar em fase de homologação perante a referida autarquia"
3. **Footer disclaimer** — closes with the homologation note
4. **Aline Meza's bio** — closes with "Eleição sujeita a homologação perante a SUSEP" (the CEO appointment itself requires SUSEP ratification)
5. **Team cards** — Aline and Eduardo are labeled only "Co-fundadora"/"Co-fundador", not "CEO" / "CFO". Rodrigo and ONE Partners keep their subtitles.

**When SUSEP grants the operating authorization**, sweep all five places back to the operational present tense. CLAUDE.md has the exact checklist.

---

## 7. Email infrastructure (May 2026)

### 7.1 Mailbox at Microsoft 365
`contato@arielsspe.com` runs on Microsoft 365 (tenant ID `NETORGFT20708932`). MX record points to `arielsspe-com.mail.protection.outlook.com`. Outlook client.

### 7.2 SPF: replaced GoDaddy default with Microsoft 365
- **Before**: `v=spf1 include:secureserver.net -all` (GoDaddy-era, from before M365)
- **After**: `v=spf1 include:spf.protection.outlook.com -all`

**Why this mattered.** Without this, outbound mail from `contato@arielsspe.com` would fail SPF at strict receivers (Gmail especially) and the replies would land in their spam folders. SPF alone is sufficient for DMARC alignment when DKIM isn't yet in place.

### 7.3 DKIM enabled via M365 Defender
Two CNAMEs published at GoDaddy (`selector1._domainkey` and `selector2._domainkey`) pointing to `selector{1,2}-arielsspe-com._domainkey.NETORGFT20708932.r-v1.dkim.mail.microsoft.`. M365 Defender → DKIM → toggle Enabled. Status: Valid. selector1 actively signs; selector2 is the rotation backup (empty until next rotation, ~6 months).

### 7.4 DMARC kept at `p=quarantine`
Pre-existing record. Not relaxed. With both SPF and DKIM aligned, mail passes cleanly.

### 7.5 Verified end-to-end on 2026-05-16
Test email from `contato@arielsspe.com` to `botti.rodrigo@gmail.com` arrived in Inbox (not Spam). Gmail "Show Original" reported `spf=pass`, `dkim=pass` with `s=selector1`, `dmarc=pass`. Authentication is production-ready.

---

## 8. Gotchas worth remembering

### 8.1 GoDaddy's "WebsiteBuilder Site" A record blocks GitHub Pages
When you set up GitHub Pages with `arielsspe.com` as the custom domain and add the four `185.199.108-111.153` A records, GoDaddy DNS may already have a fifth A record at `@` with data labeled "WebsiteBuilder Site". This is a magic GoDaddy record that competes with the GitHub IPs and causes intermittent failures. **Delete it manually.**

### 8.2 GoDaddy's DNS validator rejects CNAMEs ending in `.microsoft`
The M365 DKIM CNAMEs target `....dkim.mail.microsoft` (Microsoft owns this TLD since 2017). GoDaddy's UI validator returns "Invalid data" because their hardcoded TLD list is outdated. **Workaround**: add a trailing dot to the value to force absolute FQDN form (`....microsoft.`). The validator passes and the record stores correctly.

### 8.3 M365 internal DNS cache lags 15-30 minutes
After publishing the DKIM CNAMEs, the M365 Defender "Enable DKIM" toggle will fail with "CNAME record does not exist" for up to 30 minutes even though public DNS resolvers (Google, Cloudflare) see the records immediately. Wait and retry; don't assume the records are wrong.

### 8.4 Microsoft 365 Junk filter catches Formspree submissions
When `contato@arielsspe.com` first started receiving Formspree notifications, M365 sent them to Junk because the "From: noreply@formspree.io" / "Reply-To: [lead's email]" mismatch looks like phishing. Mark as trusted on first arrival.

### 8.5 Formspree verification email vs submission notifications
Don't assume that verifying a recipient address in Formspree means notifications will arrive cleanly. The verification email comes from a different sender pattern than the submission notifications; only the submission notifications get filtered.

### 8.6 GitHub Pages cert provisioning needs a kick if DNS was wrong at first try
If you save the custom domain in GitHub Pages settings before DNS is correct, the Let's Encrypt cert provisioning may stall on a generic `*.github.io` wildcard. Fix is to remove the custom domain, wait 30 sec, re-add it. This re-triggers the cert request.

---

## 9. Things explicitly rejected (do not re-propose without new evidence)

- **Gold accent** (see 2.4)
- **Paid type foundries** — Klim, Grilli, Displaay (see 2.5)
- **OS prefers-color-scheme as default theme** (see 5.1)
- **"Special-Purpose Insurance Company" as EN rendering of SSPE** (see 4.5)
- **Big mermaid logo in hero** — removed because the logo file isn't yet definitive
- **Standalone "Apoio Institucional / ONE Partners" section** — replaced by ONE Partners as a team card
- **"Perfil" select in contact form** — removed for simplicity; CVM 160 checkbox is now always visible
- **Regulator pill strip** (SUSEP/CNSP/CVM/ANBIMA at the bottom) — removed; legal references remain in disclaimer text

---

## 10. Documentation layers

Three layers, each with its own role. Keep them in sync but don't duplicate.

| File | Purpose | Audience |
|------|---------|----------|
| **`CLAUDE.md`** | Quick-start briefing — conventions, file map, what to do, what not to do | Any agent or developer opening the folder cold |
| **`DECISIONS.md`** *(this file)* | Long-form rationale archive — why we made every meaningful choice | Future Rodrigo, future agents asking "why is X this way" |
| **`~/.claude/projects/.../memory/`** | Cross-session memory for Claude Code | The AI agent across multiple sessions |

When something meaningful changes (a settled choice gets reversed, a new gotcha is discovered, a new convention is introduced), update **both** this file and the relevant memory file. CLAUDE.md only needs updating if the day-one orientation changes.

---

*Last update: 2026-05-16. Append new decisions below this line; do not rewrite earlier entries.*

---

## 11. Team grew to 5 — ONE Partners now full-width on its own row (2026-05-16)

**Decision.** Added **Laércio Vicente** to the team grid, between Eduardo and Rodrigo. Subtitle: "Co-fundador · Executivo" / "Co-founder · Executive". His statutory-director role at Andrina SSPE (where he participated in Brazil's first LRS issuance) is the lead credential. Bio ends with "Eleição sujeita a homologação perante a SUSEP" — same pattern as Aline's. The result is a 5-card team layout:

- Row 1: Aline (left) · Eduardo (right)
- Row 2: Laércio (left) · Rodrigo (right)
- Row 3: ONE Partners — **spanning both columns, centered, max-width 56ch, text-align center**

**Why ONE Partners spans full width instead of staying as a 1-column orphan card.** Letting it land naturally on row-3-left would leave a visible empty right column — looks half-built. Full-width centered treatment makes the placement feel intentional and reinforces ONE Partners' different status (institutional partner, not executive co-founder). The italic wordmark name already separates it visually; the full-width row separates it structurally.

**Caveat (later resolved).** Laércio's LinkedIn URL was initially a guessed slug; confirmed by Rodrigo as `linkedin.com/in/laercio-vicente-73ba3432` and updated on both pages the same day.

---

## 12. Aline and Eduardo subtitles aligned to "· Executivo/a" (2026-05-16)

**Decision.** Aline's subtitle changes from `Co-fundadora` to `Co-fundadora · Executiva`; Eduardo's from `Co-fundador` to `Co-fundador · Executivo`. EN mirrors: both become `Co-founder · Executive`. This matches Laércio's pattern and gives the executive trio visual symmetry.

**Why this isn't a regression of the "no CEO/CFO" decision.** The earlier decision (section 6, item 5) stripped specific officer titles because the CEO/CFO appointments are pending SUSEP homologation. **"Executivo/Executive" is a general descriptor, not a regulated officer title** — it doesn't claim any specific role that requires SUSEP ratification. It does, however, separate the three operational co-founders (Aline, Eduardo, Laércio) from Rodrigo (`· Investidor`), which is the editorially correct signal.

**Status.** Active. When SUSEP homologates the elections, the specific titles (CEO, CFO, and whatever Laércio's becomes) can replace `Executivo/a` as part of the sweep already documented in section 6.
