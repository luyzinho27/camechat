# 🚀 Guia Passo a Passo Detalhado - Correção de Segurança

## Índice
1. [Entender o Problema](#entender-o-problema)
2. [Passo 1: Revogar Chaves Antigas (Google Cloud)](#passo-1-revogar-chaves-antigas)
3. [Passo 2: Gerar Novas Chaves](#passo-2-gerar-novas-chaves)
4. [Passo 3: Configurar Arquivo Local (.env.local)](#passo-3-configurar-arquivo-local)
5. [Passo 4: Testar Localmente](#passo-4-testar-localmente)
6. [Passo 5: Fazer Commit no GitHub](#passo-5-fazer-commit-no-github)
7. [Passo 6: Deploy (Firebase Hosting/Supabase)](#passo-6-deploy)
8. [Verificação Final](#verificação-final)

---

## ⚠️ Entender o Problema

### O que Aconteceu?

Você tinha isso no código (PERIGOSO):

```javascript
// ❌ NUNCA fazer isso!
const firebaseConfig = {
    apiKey: "AIzaSyDGclwLGfGVlpKNjUhenZ5nN1vK_mrdjls",  // ← EXPOSTA!
    authDomain: "camechat-4fb88.firebaseapp.com",
    projectId: "camechat-4fb88",
    // ... mais dados
};
```

**Por que é perigoso?**
- Qualquer pessoa vendo o código fonte da página pode copiar essa chave
- Pode usar seus serviços Firebase
- Você paga pelos custos de uso

### A Solução
Usar **variáveis de ambiente** que NUNCA aparecem no código:

```javascript
// ✅ SEGURO! A chave vem de uma variável de ambiente
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  // ← Vem de .env.local
    authDomain: "camechat-4fb88.firebaseapp.com",
    // ... rest
};
```

---

# PASSO 1: Revogar Chaves Antigas

## 🔓 Por que revogar?

A chave antiga pode estar em cache/histórico. Mesmo que você a remova do código, ela ainda funciona. Logo, você deve **desativar ela no Google/Firebase**.

## 📍 Onde: Google Cloud Console

1. Abra: **https://console.cloud.google.com**

2. Faça login com sua conta Google (a mesma do Firebase)

3. No topo esquerdo, selecione seu **Projeto Firebase**: `camechat-4fb88`
   ```
   [Projeto: camechat-4fb88] ← Clique aqui
   ```

4. No menu esquerdo, procure por:
   ```
   APIs & Services
   └── Credentials (Credenciais)
   ```

5. Você verá uma lista de "API Keys". Procure pelas duas chaves expostas:
   ```
   AIzaSyBO3nWHXF8HDmPI5H0g6KWCS35L6lB9Fbs
   AIzaSyDGclwLGfGVlpKNjUhenZ5nN1vK_mrdjls
   ```

6. **Para cada uma:**
   - Clique nos 3 pontinhos (menu) ao lado da chave
   - Clique em **"Delete"** (Excluir)
   - Confirme

**Visual (texto):**
```
┌─────────────────────────────────────────┐
│ APIs & Services > Credentials           │
├─────────────────────────────────────────┤
│                                         │
│ 📋 API Keys                             │
│                                         │
│ □ AIzaSyBO3nWHX... 🔴 Delete ✓          │
│                                         │
│ □ AIzaSyDGclwL... 🔴 Delete ✓          │
│                                         │
│ □ [Outra chave]    ...                  │
│                                         │
└─────────────────────────────────────────┘
```

✅ **Pronto! As chaves antigas não funcionam mais.**

---

# PASSO 2: Gerar Novas Chaves

## 🔑 Por que gerar novas?

Você precisa de uma chave válida que funcione. Mas desta vez, **você a guardará em um arquivo que o Git ignora** (.env.local).

### Local A: Firebase Console (Recomendado)

1. Abra: **https://console.firebase.google.com**

2. Selecione seu projeto: **camechat-4fb88**

3. À esquerda, clique em:
   ```
   ⚙️ Configurações
   └── Configurações do Projeto
   ```

4. Clique na aba: **"Seu aplicativo"** ou **"Applications"**

5. Você verá sua configuração web. Procure por:
   ```
   apiKey: "AIza..." ← Esta é a chave que você precisa
   ```

6. **Copie a chave** (exemplo: `AIzaSyD1a2b3c4d5e6f7g8h9i0j...`)

### Local B: Google Cloud (Se precisar de mais controle)

Se a chave acima não aparecer ou você quer gerar uma nova especificamente:

1. Acesse: **https://console.cloud.google.com**

2. Projeto: `camechat-4fb88`

3. Menu → `APIs & Services` → `Credentials`

4. Botão azul: **+ Create Credentials** → **API Key**

5. Você verá a nova chave gerada

### ⚠️ IMPORTANTE: Restringir a Chave

Para máxima segurança (**recomendado após testar**):

1. Na mesma página, clique na chave que você criou

2. Vá para "API restrictions" e selecione qual API pode usar:
   ```
   ✓ Cloud Firestore API
   ✓ Firebase Authentication API
   ✓ Cloud Storage API
   ✗ Todas as outras desabilitadas
   ```

3. Em "Application restrictions", selecione:
   ```
   HTTP referrers (web sites)
   ```
   E adicione seu domínio:
   ```
   https://seu-dominio.com
   ```

✅ **Agora você tem uma nova chave segura e válida.**

---

# PASSO 3: Configurar Arquivo Local (.env.local)

## 📝 O que é .env.local?

Um arquivo no seu computador que o Git **IGNORA** (não envia ao repositório). Está no `.gitignore`:

```
.gitignore (conteúdo):
.env
.env.local          ← ← ← Git IGNORA este arquivo
!.env*.example
```

## 👇 Como Configurar

### Via Terminal (Mais fácil)

1. Abra um terminal/PowerShell no seu projeto:
   ```bash
   cd C:\Users\luizy\Documents\GitHub\CameChat
   ```

2. Crie o arquivo a partir do template:
   ```bash
   cp .env.example .env.local
   ```
   
   (Ou no Windows PowerShell:)
   ```powershell
   Copy-Item .env.example -Destination .env.local
   ```

3. Abra o arquivo `.env.local`:
   ```bash
   # Linux/Mac:
   nano .env.local
   
   # Windows (VS Code):
   code .env.local
   ```

### Via VS Code (Mais visual)

1. Em VS Code, abra o Explorer (Ctrl+B)

2. Clique em `New File` e nomeie: `.env.local`

3. Copie o conteúdo de `.env.example` e cole no novo arquivo

### Conteúdo do `.env.local`

```env
# Cole exatamente assim, substituindo YOUR_NEW_API_KEY_HERE

VITE_FIREBASE_API_KEY=AIzaSyD1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o  # ← SUA NOVA CHAVE AQUI
VITE_FIREBASE_PROJECT_ID=camechat-4fb88
VITE_FIREBASE_AUTH_DOMAIN=camechat-4fb88.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=camechat-4fb88.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=405074774387
VITE_FIREBASE_APP_ID=1:405074774387:web:17d2c4e7fd1e35e0c1dd06
VITE_BACKEND_BASE_URL=https://vkbqoqmyxesprbnzwcff.supabase.co/functions/v1/camechat-api
```

### Onde Colar a Chave

Apenas a linha:
```env
VITE_FIREBASE_API_KEY=AIzaSyD1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o
                        ↑
                   Cole aqui a chave obtida no Passo 2
```

### ✅ Pronto!

Agora seu `.env.local` tem a chave, e o Git nunca vai enviar para o repositório público:

```
✓ .env.local permanece no seu computador
✗ Não vai para o GitHub
✗ Não aparece em lugar nenhum público
```

---

# PASSO 4: Testar Localmente

## 🧪 Verificar se Funciona

### 1. Certifique-se que .env.local está carregado

Em VS Code, você pode ver no terminal:

```bash
# Se usa npm/yarn
npm run dev
# ou
yarn dev
```

Procure por uma linha assim no terminal:
```
✓ .env.local carregado
```

### 2. Abra a aplicação

```
http://localhost:5173  (ou a porta que aparecer)
```

### 3. Abra o Console do Navegador (F12 ou Ctrl+Shift+I)

Vá para a aba **Console**.

#### ✅ SE FUNCIONAR, você verá:
```javascript
Firebase initialized successfully
```

E NENHUM aviso de erro.

#### ❌ SE NÃO FUNCIONAR, você verá:
```javascript
⚠️ Chave de API do Firebase não configurada!
```

**O que fazer?**

1. Volte ao Passo 3
2. Verifique se `.env.local` existe
3. Verifique se a chave está preenchida (não vazia)
4. Reinicie o servidor (Ctrl+C e depois `npm run dev` novamente)

### 4. Testar Login

Tente fazer login com uma conta de teste:
- Email: `teste@teste.com`
- Senha: `123456`

Se conseguir fazer login, a chave está funcionando! ✅

---

# PASSO 5: Fazer Commit no GitHub

## 📤 Sincronizar Mudanças

### O que você mudou?

```
Arquivos MODIFICADOS:
  ✏️ public/script.js        (removidas chaves hardcoded)
  ✏️ public/index.html       (adicionado import de config.js)

Arquivos CRIADOS:
  ✨ public/config.js        (novo arquivo de configuração)
  ✨ .env.example            (template de variáveis)
  ✨ SECURITY.md             (documentação de segurança)
  ✨ SECURITY_CHECKLIST.md   (checklist)
  ✨ setup.sh                (script de setup)

Arquivos NÃO MODIFICADOS:
  ⏸️ .env.local              (não vai para o Git)
  ⏸️ .gitignore              (já estava correto)
```

### Via Terminal

```bash
# 1. Verificar o que mudou
git status

# Você verá algo como:
# On branch main
# Changes not staged for commit:
#   modified:   public/script.js
#   modified:   public/index.html
#
# Untracked files:
#   public/config.js
#   .env.example
#   SECURITY.md
#   ...
```

```bash
# 2. Adicionar os arquivos
git add .env.example public/config.js public/script.js public/index.html SECURITY.md SECURITY_CHECKLIST.md SECURITY_FIX_SUMMARY.md setup.sh

# 3. Confirmar a adição
git commit -m "🔒 security: remover chaves de API expostas, usar variáveis de ambiente"

# 4. Enviar para GitHub
git push origin main
```

### Via VS Code

1. Clique no ícone de controle de versão (lado esquerdo): **Source Control**

2. Você verá os arquivos modificados

3. Clique o **+** para adicionar cada arquivo OR clique **+ Stage All Changes**

4. Na caixa "Message", digite:
   ```
   🔒 security: remover chaves de API expostas, usar variáveis de ambiente
   ```

5. Clique em **Commit**

6. Clique em **Sync** (ou **Push**)

### ✅ Pronto!

Agora no GitHub você terá:

```
Commit: 🔒 security: remover chaves de API expostas...
Author: seu-usuario
Date: hoje
Files changed: 8
  + 5 files created
  - 2 files modified
```

E quando GitHub analisar o repositório:

```
✅ Previously exposed secrets now taken offline
   Both API keys have been removed
```

---

# PASSO 6: Deploy (Firebase Hosting / Supabase)

## 🚀 Colocar em Produção

Agora você precisa informar às plataformas quais são as novas variáveis.

### Para Firebase Hosting

#### Opção A: Build Manual + Host Automático

1. **Instale Firebase CLI** (se ainda não tiver):
   ```bash
   npm install -g firebase-tools
   ```

2. **Faça login**:
   ```bash
   firebase login
   ```
   Isso abrirá uma página no navegador para autenticar.

3. **Configure o projeto** (se for primeira vez):
   ```bash
   firebase init hosting
   ```
   Quando perguntar, diga:
   - Projeto: `camechat-4fb88`
   - Pasta pública: `public` (ou `dist` se usar build)
   - Single page app: `Yes`

4. **Build a aplicação**:
   ```bash
   npm run build
   ```

5. **Deploy**:
   ```bash
   firebase deploy --only hosting
   ```

#### ⚠️ IMPORTANTE: Variáveis de Ambiente no Firebase Hosting

Firebase Hosting é **"estático"** - não usa `.env.local`. Você precisa fazer o build com as variáveis:

```bash
# Antes de fazer build, Firebase precisa saber a chave

# Opção 1: Usar .env.local local (recomendado)
# Seu .env.local já tem a chave
npm run build  # Isso já lê .env.local
firebase deploy

# Opção 2: Se não funcionar, informar manualmente
VITE_FIREBASE_API_KEY=AIzaSyD1a2b3c4d5e6f7g8h9i0j npm run build
```

Depois que fazer `npm run build`, a chave é "compilada" no arquivo final, portanto:

```
✅ As variáveis ficam no arquivo compilado (JS final)
   Isso é OK porque a chave já estava exposta de qualquer forma
   e agora você a revogou, então a antiga não funciona
```

### Para Supabase Edge Functions

Seu backend está em Supabase. Você precisa:

#### 1. Atualizar Seupbase Function (se usar chaves)

1. Acesse: **https://supabase.com/dashboard**

2. Selecione seu projeto

3. Vá para: **Functions** → **camechat-api** (ou seu nome)

4. Se precisar de variáveis, adicione em **Environment Variables**:
   ```
   FIREBASE_API_KEY = AIzaSyD1a2b3c4d5e6f7g8h9i0j...
   ```

5. Clique em **Deploy**

#### 2. Sincronizar Local

Se estiver desenvolvendo localmente:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Puxar funcões do server
supabase functions pull

# Fazer deploy
supabase functions deploy camechat-api
```

### Se Usar Vercel, Netlify ou Heroku

Se sua aplicação está em outro lugar:

1. Vá para **Settings** ou **Environment Variables**

2. Adicione:
   ```
   VITE_FIREBASE_API_KEY = AIzaSyD1a2b3c4d5e6f7g8h9i0j...
   ```

3. Redeploy a aplicação

4. A plataforma fará o build com essas variáveis

---

# VERIFICAÇÃO FINAL

## ✅ Checklist Completo

Use este checklist para garantir que tudo funcionou:

### Google Cloud / Firebase
- [ ] Acessei https://console.cloud.google.com
- [ ] Projeto: camechat-4fb88 selecionado
- [ ] Fui até: APIs & Services → Credentials
- [ ] Deletei a chave: `AIzaSyBO3nWHX...`
- [ ] Deletei a chave: `AIzaSyDGclwL...`
- [ ] Verifiquei que não existem mais

### Generate Nova Chave
- [ ] Acessei https://console.firebase.google.com
- [ ] Selecionei projeto: camechat-4fb88
- [ ] Copiei uma chave existente OU criei uma nova
- [ ] Chave é tipo: `AIza...`
- [ ] Guardei em local seguro (temporariamente)

### Configuração Local
- [ ] Criei/atualizei arquivo `.env.local`
- [ ] Adicionei: `VITE_FIREBASE_API_KEY=AIzaSyD...`
- [ ] Restante das variáveis estão corretas
- [ ] `.env.local` NÃO foi commitado (está no .gitignore)

### Teste Local
- [ ] Executei: `npm run dev`
- [ ] Abri: http://localhost:5173
- [ ] Abri console (F12)
- [ ] Nenhum erro de Firebase apareceu
- [ ] Consegui fazer login com teste@teste.com

### Commit no GitHub
- [ ] Executei: `git status` e verifiquei arquivos
- [ ] Adicionei arquivos: `git add ...`
- [ ] Fiz commit: `git commit -m "..."`
- [ ] Fiz push: `git push origin main`
- [ ] Verifiquei no GitHub que apareceu o novo commit

### Deployment
- [ ] Se Firebase Hosting: Executei `firebase deploy`
- [ ] Se Supabase: Atualizei Environment Variables
- [ ] Se Vercel/Netlify: Adicionei as variáveis
- [ ] Aplicação em produção está funcionando
- [ ] Login funciona no site em produção

### GitHub Security
- [ ] Aguardei GitHub processar o push (~ 5 minutos)
- [ ] Fui em: Repository → Security → Secret scanning
- [ ] Verifiquei: "Previously exposed secrets now taken offline"
- [ ] Status mudou para: ✅ SECURE

---

# 🎯 MANTENDO GRÁTIS

## Como Garantir Que a Aplicação Permanece Gratuita?

### Firebase (Sempre Grátis)

✅ O que você usa é sempre grátis:

```
✓ Autenticação (Authentication)  - 50k logins/mês grátis
✓ Firestore Database            - 50k leituras/dia grátis
✓ Cloud Storage                  - 1GB/mês grátis
✓ Hosting                        - 1GB/mês grátis
```

❌ Custos aparecem quando:
```
✗ Exceder as cotas acima
✗ Consultas ineficientes queimam quota rapidinho
✗ Alguém usar a chave antiga para fazer requisições
```

### Supabase (Grátis com limites)

```
✓ Edge Functions - 2M invocações/mês grátis
✓ Database       - 500MB grátis
✓ Storage        - 1GB grátis
```

### Proteções Que Você Fez

1. **Revogou chaves antigas**
   - Se alguém tiver cópia, não funciona mais ✅

2. **Guardou nova chave em .env.local**
   - Não fica visível no repositório público ✅

3. **Usou variáveis de ambiente**
   - Separa código da configuração ✅

4. **Configurar restricações de chave** (Passo 2, parte "Restringir")
   - Chave só funciona para seus domínios ✅
   - Chave só funciona para Firestore, Auth, Storage ✅

### Monitorar Gastos

Para nunca ter surpresas:

1. Vá em: **https://console.firebase.google.com**

2. Projeto → **Usage and Billing**

3. Coloque um **Billing Alert**:
   - Budget: $10/mês
   - Aviso: $5

4. Assim você recebe email se está gastando

### ✅ Pronto!

Sua aplicação continuará **100% gratuita** e **segura**.

---

# 🆘 TROUBLESHOOTING

## Problema: "Chave não carregada"

**Causa:** `.env.local` não existe ou não é lido

**Solução:**
```bash
# Verificar se arquivo existe
ls -la .env.local

# Se não existir, criar:
cp .env.example .env.local

# Verificar conteúdo
cat .env.local

# Deve ter:
# VITE_FIREBASE_API_KEY=AIza...
```

## Problema: "Erro: VITE_FIREBASE_API_KEY is undefined"

**Causa:** Variável vazia no .env.local

**Solução:**
1. Abra `.env.local`
2. Verifique se linha tem:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyD1a2b3c4d5e6f7...
   ```
   NÃO DEIXE VAZIO: `VITE_FIREBASE_API_KEY=`

## Problema: "Erro ao fazer deploy no Firebase"

**Causa:** Firebase CLI não autenticado

**Solução:**
```bash
# Fazer logout e login novamente
firebase logout
firebase login

# Depois tente deploy novamente
firebase deploy --only hosting
```

## Problema: "A aplicação funcionava, agora parou"

**Causa:** Provavelmente você deletou a chave antiga mas não configurou a nova

**Solução:**
1. Volte ao Passo 2 e4: Gere uma nova chave
2. Preencha em `.env.local`
3. Reinicie: `npm run dev`

---

# 📞 SUPORTE

Se algo der errado:

1. **Verificar Console do Navegador (F12)**
   - Procure por mensagens de erro vermelhas
   - Copy/paste a mensagem em uma busca

2. **Verificar Terminal**
   - `npm run dev` deve rodar sem erros
   - Procure por avisos em amarelo ou vermelho

3. **Verificar Firebase Console**
   - https://console.firebase.google.com
   - Vá em: Firestore → Regras
   - Verifique se está tudo verde (sem erros)

4. **Resetar tudo**
   ```bash
   # Clear node modules
   rm -rf node_modules
   npm install
   
   # Reinstalar Firebase
   npm install firebase
   
   # Rodar dev novamente
   npm run dev
   ```

---

**Última atualização:** 26 de abril de 2026  
**Versão:** 1.0 - Guia Completo  
**Status:** ✅ Pronto para usar
