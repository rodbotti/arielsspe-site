# arielsspe.com

Landing page institucional da **Ariel Seguradora de Propósito Específico**.

Site estático, bilíngue (PT-BR / EN), com tema claro e escuro.
Sem frameworks, sem build step.
Composto em **Fraunces** (display) e **Inter** (corpo).
Paleta restrita aos cinco tons de marca.

Para subir o site no GoDaddy ou em outro host: ver **[DEPLOY.md](DEPLOY.md)**.

---

## Estrutura

```
Ariel SSPE Webpage/
├── index.html              # PT-BR (página padrão)
├── en.html                 # English
├── styles.css              # Tokens, tema claro/escuro, layout, componentes
├── script.js               # Theme toggle, reveal, nav, form
├── favicon.svg             # Verde-escuro com "A" italic
├── robots.txt
├── sitemap.xml
├── DEPLOY.md               # Guia de publicação (GoDaddy + alternativas)
├── README.md               # Este arquivo
├── .gitignore
├── assets/
│   ├── logo-dark.png       # Sereia em verdes — 256×256, ~97 KB (tema escuro)
│   ├── logo-light.png      # Sereia P&B — 256×256, ~109 KB (tema claro)
│   ├── og.png              # Imagem 1200×630 para compartilhamento
│   ├── originals/          # Logos originais em alta — fonte para re-build
│   │   ├── logo-dark.png   # 6.3 MB (não publicar)
│   │   └── logo-light.png  # 1.8 MB (não publicar)
│   └── regulators/         # Reservado para logos SUSEP/CNSP/CVM/ANBIMA
├── _build/                 # Scripts Python para regerar assets
│   ├── optimize_logos.py
│   └── generate_og.py
└── _reference/             # Material de referência (paleta, etc.) — não publicar
```

`_build/`, `_reference/` e `assets/originals/` **não devem ser publicados**. O `.gitignore` já cuida disso.

---

## Sistema de tema (claro / escuro)

- **Default**: claro. Primeira visita sempre carrega no tema claro.
- **Override manual**: botão sol/lua no canto superior direito do nav, ao lado do toggle PT/EN.
- **Persistência**: a escolha explícita é guardada em `localStorage` sob a chave `ariel.theme` (valores: `dark` | `light`).
- **Sem flash**: um script inline no `<head>` aplica o tema antes do primeiro paint.
- **Logo**: troca automática `logo-dark.png` ↔ `logo-light.png` por CSS (sem JS).
- **Diagrama LRS**: stroke/fill via classes `.d-ring`, `.d-line`, `.d-arrow`, etc. — re-tinge sozinho ao trocar de tema.

---

## Paleta de marca (única autorizada)

| Token CSS         | Valor    | Uso                                         |
|-------------------|----------|---------------------------------------------|
| `--accent`        | `#009997` (dark) / `#00797D` (light) | Acento principal, hover, eyebrows |
| `--accent-mid`    | `#00797D` / `#00565F` | Linhas do diagrama, hover do botão primário |
| `--accent-deep`   | `#00565F` | Fundo da seção "Por que LRS" (estrutural), bordas, anel do diagrama |
| `--gray-warm`     | `#98989A` | Cinzas de hierarquia neutra |
| `--gray-light`    | `#D1D2D4` | Itálicos no display, tonalidade clara |

Não usar outro hex. Ajustes futuros: mexer em `:root` / `[data-theme="light"]` em `styles.css`.

---

## Pendências antes do go-live

### 1. Dados legais (rodapé)
Procurar `[a preencher]` / `[to be filled]` em `index.html` e `en.html` e substituir:
- **CNPJ**
- **Endereço**

### 2. LinkedIn da Ariel SSPE
Hoje o link aponta para o placeholder `https://www.linkedin.com/company/ariel-sspe/`. Quando criar a página oficial, fazer find-and-replace nos dois HTMLs (3 ocorrências cada: chip do nav, link do footer).

### 3. Bios do time
Bios da Aline e do Eduardo redigidas a partir do PDF da Project Poseidon — **revisar com eles** em `index.html` (seção `.team`) e replicar tradução em `en.html`. Bio do Rodrigo veio direto do PDF.

### 4. Backend do formulário
Hoje usa **mailto:** (abre cliente de e-mail do visitante). Funciona, mas:

#### Opção A — Formspree
1. Criar conta em https://formspree.io
2. Criar form, copiar endpoint
3. Antes do `<script src="script.js"></script>`, em ambas as páginas:
   ```html
   <script>window.ARIEL_FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";</script>
   ```

#### Opção B — Cloudflare Workers / próprio
Setar `window.ARIEL_FORM_ENDPOINT` para sua URL.

### 5. Disclaimer / política de privacidade
Textos de aviso legal e links "Política de Privacidade", "Termos de Uso", "LGPD" são placeholders. Submeter ao jurídico.

### 6. E-mail
Configurar `contato@arielsspe.com` no provedor (GoDaddy Email Essentials, Google Workspace, ou Cloudflare Email Routing). Detalhes em `DEPLOY.md`.

### 7. OG image (opcional)
A `assets/og.png` é gerada por `_build/generate_og.py` e está pronta para uso. Para regerar com texto diferente: editar o script e rodar:
```powershell
py _build/generate_og.py
```

---

## Rodando localmente

```powershell
# Python 3
py -m http.server 5500
```

Acessar: http://localhost:5500

---

## Decisões de design

- **Tipografia.** Fraunces (display, variable, eixos `opsz` e `SOFT` usados de propósito). Inter para corpo, UI e formulários.
- **Cor estrutural.** Verde-escuro `#00565F` é fundo da seção "Por que LRS, agora" — quebra a monotonia, marca a hierarquia editorial.
- **Tema.** Dark e light com a mesma força de marca. Verde-escuro é fundo dos pilares em ambos os modos — arquitetura consistente.
- **Movimento.** Apenas `fade-up` em scroll. Respeita `prefers-reduced-motion`.
- **Diagrama.** SVG inline desenhado à mão, com classes para re-tingir por tema.
- **Naming.** Wordmark = "Ariel". Compacto = "Ariel SSPE". Legal = "Ariel Seguradora de Propósito Específico S.A."

---

## Performance

- **HTML + CSS + JS**: ~50 KB combinados.
- **Logos**: 97 KB (dark) + 109 KB (light) — otimizadas a partir de originais de 6 MB / 1.8 MB.
- **OG image**: 286 KB (carrega só quando alguém compartilha).
- **Fontes (Google)**: ~150 KB.
- **Total inicial**: ~250 KB. Lighthouse alvo: 95+/100/100/100.

---

Composto em Fraunces e Inter. Sem dependências, sem build, sem stack.
