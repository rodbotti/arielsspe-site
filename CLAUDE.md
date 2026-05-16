# CLAUDE.md

Working notes for AI agents (or new collaborators) picking up the Ariel SSPE website.

## What this is

A bilingual (PT-BR / EN) static landing page for **Ariel Sociedade Seguradora de Propósito Específico S.A.** — a Brazilian SSPE that will structure and issue Letras de Risco de Seguro (LRS), the onshore Brazilian equivalent of Insurance-Linked Securities.

- Live: https://arielsspe.com
- Repo: https://github.com/rodbotti/arielsspe-site
- Hosted on GitHub Pages, auto-deploys on `git push`
- Form backend: Formspree endpoint configured via `window.ARIEL_FORM_ENDPOINT` in inline `<script>` of both HTMLs

## Stack

Pure static. No framework, no build step, no package manager.

- `index.html` — Portuguese, default page
- `en.html` — English page
- `styles.css` — single stylesheet, both languages
- `script.js` — theme toggle, scroll reveal, form submission, anchor smoothing
- `assets/` — logos (light + dark variants), `originals/` with high-res sources
- `_build/optimize_logos.py` — Pillow script, re-run if logos change (target ≤ 256×256 PNG, ~100 KB each)
- `favicon.svg`, `robots.txt`, `sitemap.xml`, `CNAME`

## Deploy workflow

```
git add <files>
git commit -m "..."
git push
```

Pages auto-deploys in ~30–60 seconds. No CI step, no manual approval. The `CNAME` file in repo root tells Pages to serve from `arielsspe.com`. DNS lives at GoDaddy:
- Apex `@` → 4 A records pointing to GitHub Pages IPs (`185.199.108-111.153`)
- `www` → CNAME to `rodbotti.github.io`

## Bilingual editing rules

`index.html` and `en.html` are kept in parallel. **When changing copy in one language, mirror in the other unless explicitly told otherwise.**

Established exceptions (do not "fix"):

- **Cedente enumeration** asymmetry:
  - PT lists 6 entities: "seguradoras, resseguradoras, mútuas, cooperativas, fundos de pensão, e planos de saúde"
  - EN lists 4 entities: "insurers, reinsurers, pension funds, and health plans"
- **SSPE translation**: EN uses "Special-Purpose Insurer" (do not "improve" to "Special-Purpose Insurance Company")
- **Legal corporate name** stays in Portuguese on both pages: "Ariel Sociedade Seguradora de Propósito Específico S.A."

## Naming hierarchy (use in correct context)

- **Brand wordmark** (marketing, hero, eyebrow): `Ariel`
- **Compact form** (nav, breadcrumbs): `Ariel SSPE`
- **Legal name** (footer, contracts): `Ariel Sociedade Seguradora de Propósito Específico S.A.`

⚠️ **SSPE = "Sociedade Seguradora de Propósito Específico"** — the leading "S" stands for "Sociedade" (Company). Earlier drafts dropped it and had to be corrected. Do not drop it again.

## Color palette (only these five — do not invent)

- Dark green: `#00565F`
- Medium green: `#00797D`
- Light green: `#009997`
- Gray: `#98989A`
- Light gray: `#D1D2D4`

Background and text colors derive from these plus near-black / off-white for theme contrast. No gold, no other accents (gold was tried and explicitly rejected — it reads as "luxury finance" cliché). Tokens live at `:root` and `[data-theme="light"]` in `styles.css`.

## Typography

- **Display**: Fraunces (variable; `opsz` and `SOFT` axes used purposefully — `opsz 144` + soft italics for display, `opsz 36-60` for headings)
- **Body / UI**: Inter
- Both from Google Fonts (free). Paid foundries (Klim, Grilli, Displaay) explicitly ruled out.

## Theme system

- **Default**: light (set by inline `<script>` in `<head>` before paint to avoid FOUC)
- **Toggle**: sun/moon button in nav, next to PT/EN switch
- **Persistence**: `localStorage` key `ariel.theme` (values: `dark` | `light`)
- **OS `prefers-color-scheme`**: deliberately ignored
- **Logo swap per theme**: `assets/logo-light.png` (B&W mermaid, on light) vs `assets/logo-dark.png` (green mermaid, on dark) — pure CSS via the `--logo-dark-display` / `--logo-light-display` tokens

## Regulatory status (current as of 2026-05)

Ariel has **provisional SUSEP approval** (granted December 2025) but does NOT yet have full operating authorization — that's in the homologation phase at SUSEP. The copy is calibrated to that reality:

- Hero subhead uses future tense: "estruturará e emitirá" / "will structure and issue"
- `.operates` section's "Estrutura" item names the homologation phase explicitly
- Footer disclaimer ends with "Autorização para operar em fase de homologação..." / "Operating authorization is in the final approval phase..."
- Aline Meza's bio ends with "Eleição sujeita a homologação perante a SUSEP" — her CEO appointment is pending SUSEP ratification
- Team cards show Aline and Eduardo as only "Co-fundadora/Co-fundador" — the CEO and CFO titles are withheld until homologation completes

**When full operating authorization is granted**, the site needs a sweep to:
1. Switch hero subhead from future to present tense (4 strings: PT meta, PT hero, EN meta, EN hero)
2. Remove the homologation line from the "Estrutura" item
3. Update the footer disclaimer
4. Restore "CEO" and "CFO" to Aline and Eduardo's role subtitles
5. Remove "Eleição sujeita a homologação..." from Aline's bio

## Form (contact section)

The contact form posts to **Formspree**: endpoint `https://formspree.io/f/mjgljqok`, set via `window.ARIEL_FORM_ENDPOINT` in an inline `<script>` of both HTMLs.

- Required: name, email, message
- Optional: organization, CVM 160 declaration (always-visible checkbox)
- Fallback (if endpoint is empty): opens `mailto:contato@arielsspe.com` with form contents pre-filled. Kept as defense-in-depth.

## Diagram (LRS flow)

The LRS flow diagram in `.diagram` is **inline SVG hand-drawn for this site**, not exported from a tool. Strokes and fills bind to CSS custom properties (`--accent-deep`, `--accent-mid`, `--accent`, etc.) via class selectors (`.d-ring`, `.d-line`, `.d-arrow`, `.d-station`, `.d-italic`, `.d-label`, `.d-rect`, `.d-dashed`). It re-tints automatically when the theme changes. If you redraw, preserve those classes.

## Open items (high-confidence as of 2026-05)

- **Real LinkedIn URL** for the company — `linkedin.com/company/ariel-sspe/` is placeholder, page may not yet exist; appears 4× in `index.html` and 4× in `en.html`
- **Bios for Aline and Eduardo** drafted from the Project Poseidon PDF — pending their sign-off
- **Privacy Policy / Terms of Use / LGPD** pages — currently `#` placeholders in footer
- **Email `contato@arielsspe.com`** mailbox is live (Microsoft 365). Formspree submissions route there. SPF and DKIM are both correctly configured (fixed on 2026-05-16): SPF includes `spf.protection.outlook.com`, DKIM selector1 has an active key in DNS, DMARC stays at `p=quarantine`. Outbound mail from this address authenticates correctly at Gmail and other strict receivers. GoDaddy quirk noted: their DNS validator rejects CNAMEs whose target ends in the `.microsoft` TLD; workaround is to add a trailing dot to the value.
- **Real CNPJ + address** — placeholders were removed from the footer pending real values
- **Full SUSEP operating authorization** (the homologation in progress)

## Working style with Rodrigo (user / co-founder / investor)

- **Bias to progress.** When asked an open-ended question, recommend a path with one or two sentences of rationale. Offer alternatives only when the trade-off is real.
- **Run things yourself.** He's tech-comfortable but not a developer. Do not hand him terminal commands — run them via the Bash tool yourself and report results.
- **Quality over speed.** His benchmark is "no one can tell the work was done by IA." Don't ship templated, generic, or boxed-and-arrowed work.
- **Terse signals.** "ok", "pode remover", "vai de primeira", "perfeito", "aprovado" all mean: execute / done / move on.
- **"Faça como achar melhor"** is genuine delegation of taste. Don't ask follow-up questions when he says it.
- **Bilingual**: he writes mostly in PT, expects responses in PT unless he switches to EN.

---

For deeper context (full bios, regulatory references, sources of facts), see the global memory files at:

```
~/.claude/projects/C--Users-RodrigoBotti/memory/
```

Entry point: `MEMORY.md`. Key files: `project_ariel_sspe.md` (project context), `feedback_design_principles.md` (settled design choices), `reference_project_poseidon_pdf.md` (canonical source for ILS market facts).
