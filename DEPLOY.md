# Deploy — arielsspe.com no GoDaddy

Site é HTML estático. Não precisa de build, banco, Node, nada. Basta subir os arquivos.

GoDaddy vende três tipos de produto, e o caminho de deploy depende de qual você tem. Veja qual é o seu na conta:

- **Web Hosting / cPanel Hosting** → Caminho A. **Recomendado.** Suporta HTML estático puro.
- **WordPress Hosting** → Caminho A funciona (cPanel disponível), mas você precisa subir os arquivos para fora da pasta do WP.
- **Apenas o domínio** (sem hosting) → Caminho B. Apontar DNS para um host estático gratuito (Cloudflare Pages é o melhor).
- **Website Builder / Online Store** → Não dá. Esses são SaaS proprietários e não aceitam HTML custom. Cancelar e migrar para Caminho B.

---

## Caminho A — GoDaddy Web Hosting (cPanel)

### A.1. Login no cPanel

1. Entrar em https://account.godaddy.com → "My Products"
2. Localizar o plano de Web Hosting → clicar em **"Manage"**
3. Em "Settings", clicar em **"Admin (cPanel)"** ou similar — abre o cPanel em nova aba

### A.2. Subir os arquivos

**Opção rápida (File Manager web):**
1. No cPanel, ir em **Files → File Manager**
2. Navegar até `public_html/`
3. **Apagar tudo** que estiver lá (geralmente um `index.html` placeholder)
4. **Compactar a pasta do site** localmente: zipar tudo dentro de `Ariel SSPE Webpage/` (não a pasta em si — só o conteúdo). Importante: **não incluir** as pastas `_build/`, `_reference/`, e `assets/originals/`. Tudo o que entra:
   - `index.html`
   - `en.html`
   - `styles.css`
   - `script.js`
   - `favicon.svg`
   - `robots.txt`
   - `sitemap.xml`
   - `assets/logo-dark.png`
   - `assets/logo-light.png`
   - `assets/og.png`
   - `assets/regulators/` (vazia, pode ignorar)
5. No File Manager, clicar **"Upload"** e enviar o ZIP
6. Selecionar o ZIP, clicar **"Extract"**
7. Apagar o ZIP depois de extrair

**Opção via FTP (mais robusta para mudanças repetidas):**
1. No cPanel → **Files → FTP Accounts** → criar credenciais ou usar a master
2. Conectar via [FileZilla](https://filezilla-project.org) com:
   - Host: `ftp.arielsspe.com` (ou o que o cPanel mostrar)
   - User / Senha: do cPanel
   - Porta: 21 (FTP) ou 22 (SFTP, se disponível)
3. No painel remoto, ir em `/public_html/`
4. Arrastar e soltar os arquivos do projeto (excluindo `_build/`, `_reference/`, `assets/originals/`)

### A.3. Configurar HTTPS

GoDaddy oferece SSL grátis em alguns planos, ou cobra à parte. Verificar:
1. cPanel → **Security → SSL/TLS Status**
2. Se houver certificado: ótimo, ativar redirecionamento HTTP→HTTPS
3. Se não: ativar **Let's Encrypt** se disponível, ou comprar SSL mínimo da GoDaddy

Após HTTPS funcionando, forçar redirect:
1. cPanel → **Domains → Domains** → encontrar arielsspe.com → ativar **"Force HTTPS Redirect"**

### A.4. Apontar o domínio

Se o domínio já está dentro da mesma conta GoDaddy do hosting, normalmente já vem apontado. Se não:
1. Em **Domain Manager** → DNS Management
2. Apontar o registro **A** do `@` para o IP do servidor (cPanel mostra em "Server Information")
3. Apontar o **CNAME** do `www` para `arielsspe.com`
4. Esperar propagação (até 24h, geralmente menos de 1h)

### A.5. Validar

Abrir em navegador limpo (modo anônimo):
- https://arielsspe.com → deve abrir o site PT
- https://arielsspe.com/en.html → versão EN
- https://www.arielsspe.com → deve redirecionar para sem-www
- Testar tema claro/escuro, toggle de idioma, formulário (deve abrir o cliente de e-mail)
- Compartilhar o link no LinkedIn ou WhatsApp e ver se a `og.png` aparece

---

## Caminho B — Apenas domínio na GoDaddy + Cloudflare Pages

Se você tem só o domínio, o melhor é apontar para **Cloudflare Pages**: gratuito, mais rápido que o hosting da GoDaddy, com HTTPS automático e CDN global. Setup leva 10 minutos.

### B.1. Subir o código para o GitHub

1. Criar repo privado em https://github.com/new (nome: `arielsspe-site`)
2. No PowerShell, dentro da pasta do projeto:

```powershell
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/SEU-USER/arielsspe-site.git
git push -u origin main
```

> Nota: criar `.gitignore` antes do `git add` com:
> ```
> _build/
> _reference/
> assets/originals/
> ```
> Esses arquivos não precisam ir para o repo público.

### B.2. Conectar ao Cloudflare Pages

1. Ir em https://pages.cloudflare.com → criar conta (gratuita)
2. **"Create a project"** → conectar ao GitHub → selecionar `arielsspe-site`
3. Configuração de build:
   - Framework preset: **None**
   - Build command: (deixar vazio)
   - Build output directory: `/`
4. **"Save and Deploy"** — em ~30s o site está no ar em `arielsspe-site.pages.dev`

### B.3. Apontar o domínio da GoDaddy para Cloudflare

**Opção mais simples — transferir nameservers:**
1. No Cloudflare → **Websites → Add site** → digitar `arielsspe.com`
2. Cloudflare vai escanear DNS atual e dar dois nameservers (algo como `nina.ns.cloudflare.com`)
3. Em **GoDaddy → Domains → arielsspe.com → DNS → Nameservers**, trocar para os do Cloudflare
4. Esperar propagação (2-24h)
5. No Cloudflare Pages → **Custom Domains** → adicionar `arielsspe.com` e `www.arielsspe.com`

**Opção menos invasiva — manter DNS na GoDaddy:**
1. Pegar o endereço de produção do Cloudflare Pages (ex: `arielsspe-site.pages.dev`)
2. Em GoDaddy DNS, criar:
   - Registro **CNAME**: `@` → `arielsspe-site.pages.dev`
   - Registro **CNAME**: `www` → `arielsspe-site.pages.dev`
3. No Cloudflare Pages → Custom Domains → adicionar, validar

### B.4. Updates futuros

Cada `git push` para o branch `main` redeploya automaticamente. Editar arquivo localmente, commitar, fazer push, em 30s está no ar.

---

## E-mail no GoDaddy

Você mencionou que vai configurar o `contato@arielsspe.com` no GoDaddy. Caminho normal:

1. **GoDaddy → My Products → Email & Office** → "Add a Mailbox" para `arielsspe.com`
2. Escolher plano (geralmente Email Essentials cobre)
3. Criar a caixa `contato@arielsspe.com`
4. GoDaddy vai pedir para criar registros **MX** no DNS — se você está em DNS do Cloudflare (Caminho B), tem que adicionar lá, não no GoDaddy
5. Esperar propagação, testar enviando um email de outro endereço

> Quando o email estiver vivo, **testar o formulário do site**: ele dispara um `mailto:contato@arielsspe.com`. Se quiser receber direto sem depender do cliente do visitante, ver "Backend do formulário" no `README.md`.

---

## Antes do go-live (checklist)

- [ ] CNPJ e endereço preenchidos no rodapé (procurar `[a preencher]` em `index.html` e `en.html`)
- [ ] URL real do LinkedIn da Ariel SSPE (search/replace `linkedin.com/company/ariel-sspe/`)
- [ ] Bios da Aline e Eduardo aprovadas
- [ ] Disclaimer e política de privacidade revisados pelo jurídico
- [ ] HTTPS funcionando
- [ ] OG image testada via https://www.opengraph.xyz/url/https%3A%2F%2Farielsspe.com
- [ ] Formulário testado (envio chega no e-mail certo)
- [ ] Mobile testado (iPhone Safari + Android Chrome)

---

## Re-build de assets (se precisar)

Os scripts em `_build/` regeneram logos e og.png a partir dos originais em `assets/originals/`:

```powershell
py _build/optimize_logos.py    # logos -> 256x256, ~100 KB cada
py _build/generate_og.py        # og.png -> 1200x630
```
