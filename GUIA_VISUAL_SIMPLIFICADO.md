# 🎨 Guia Visual Simplificado - Passo a Passo

## 📍 Você está aqui

```
START
  ↓
┌─────────────────────────────────────────────┐
│ 🔴 PASSO 1: Revogar Chaves Antigas         │
│ Onde: Google Cloud Console                   │
│ Tempo: 3 minutos                             │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🟠 PASSO 2: Gerar Novas Chaves             │
│ Onde: Firebase Console                       │
│ Tempo: 2 minutos                             │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🟡 PASSO 3: Configurar .env.local           │
│ Onde: Seu Computador                         │
│ Tempo: 5 minutos                             │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🟢 PASSO 4: Testar Localmente               │
│ Onde: Terminal + Navegador                   │
│ Tempo: 3 minutos                             │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🔵 PASSO 5: Commit no GitHub                │
│ Onde: Terminal                               │
│ Tempo: 2 minutos                             │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🟣 PASSO 6: Deploy                          │
│ Onde: Firebase Hosting / Supabase            │
│ Tempo: 5 minutos                             │
└─────────────────────────────────────────────┘
  ↓
END ✅
```

---

## 🔴 PASSO 1: Revogar Chaves Antigas

### O Que Você Vai Fazer?
Desativar as chaves antigas para que ninguém possa usá-las.

### Passo a Passo Visual

#### 1. Abra seu navegador

```
                    Navegador
    ┌────────────────────────────────────┐
    │ URL: https://console.cloud.google  │
    └────────────────────────────────────┘
             ↓ Escreva isto
            ↙
```

#### 2. Login

```
┌─────────────────────────────────┐
│  Login com sua conta Google      │
│  seu-email@gmail.com  [Login]   │
└─────────────────────────────────┘
```

#### 3. Selecione Projeto

```
Tela do Google Cloud:

    [Projeto: ▼]  ← Clique aqui
         ↓
    ┌────────────────────────┐
    │ □ Meus Projetos        │
    │   └─ camechat-4fb88 ← │ Clique aqui
    │   └─ outro projeto     │
    └────────────────────────┘
```

#### 4. Procure Credentials

```
Menu Esquerdo:

   ┌──────────────────────┐
   │ ≡ (Menu)            │
   └──────────────────────┘
            ↓
   ┌──────────────────────┐
   │ APIs & Services      │ ← Click
   │   ↳ Credentials      │ ← Click aqui
   └──────────────────────┘
```

#### 5. Encontre as Chaves

```
Tela: Credentials

┌─────────────────────────────────────────────┐
│ API Keys                                    │
├─────────────────────────────────────────────┤
│ □ AIzaSyBO3nWHX...    [...] Delete ← Clique│
│ □ AIzaSyDGclwL...    [...] Delete ← Clique│
│ □ [Outra chave]      [...]                  │
└─────────────────────────────────────────────┘
```

#### 6. Deletar

```
Clique nos [...] e selecione: Delete

┌──────────────────────┐
│ Confirmar Delete?    │
│ □ Delete             │ ← Clique
└──────────────────────┘
```

#### 7. Repetir para a segunda

```
Faça a mesma coisa com:
AIzaSyDGclwL...
```

✅ **Pronto! Nenhuma chave antiga funciona mais.**

---

## 🟠 PASSO 2: Gerar Novas Chaves

### O Que Você Vai Fazer?
Criar uma chave nova e segura para usar no seu projeto.

### Passo a Passo Visual

#### 1. Abra Firebase Console

```
Navegador:
https://console.firebase.google.com
```

#### 2. Selecione Projeto

```
┌────────────────────────────┐
│  [camechat-4fb88]  ← Este  │
└────────────────────────────┘
```

#### 3. Vá para Settings

```
Menu Esquerdo:

┌──────────────────────────┐
│ 📌 Project Overview      │
│ 🏗️  Build                │
│   ├─ Authentication      │
│   ├─ Firestore           │
│   └─ Storage             │
│ ⚙️  Settings          ← │ Clique
│   └─ Project settings ← │ Clique
└──────────────────────────┘
```

#### 4. Vá para "Your apps" ou "Web"

```
Tela Settings:

┌──────────────────────────────────┐
│ ┌─────────────────────────────┐  │
│ │ Sua aplicação (SDK config)  │  │
│ │                             │  │
│ │ const firebaseConfig = {    │  │
│ │   apiKey: "AIza..." ← Isto! │  │
│ │   ...                       │  │
│ │ }                           │  │
│ └─────────────────────────────┘  │
└──────────────────────────────────┘
```

#### 5. Copie a Chave

```
apiKey: "AIzaSyD1a2b3c4d5e6f7g8h9i0j..."
        ↑                               ↑
    Começa                        Termine aqui

Selecione tudo e copie (Ctrl+C)
```

✅ **Pronto! Você tem a chave nova.**

---

## 🟡 PASSO 3: Configurar .env.local

### O Que Você Vai Fazer?
Colocar a chave número em um arquivo que o Git ignora.

### Passo a Passo Visual

#### 1. Abra VS Code

```
VS Code:
C:\Users\luizy\Documents\GitHub\CameChat
```

#### 2. Crie o Arquivo .env.local

```
Explorer (esquerda):
┌────────────────────────────────┐
│ 📁 CameChat                    │
│   ├─ 📁 android               │
│   ├─ 📁 public                │
│   ├─ 📄 .env.example          │
│   └─ ➕ New File...           │ Clique aqui
└────────────────────────────────┘

Nomeie: .env.local
```

#### 3. Copie do Template

```
Abra: .env.example

┌─────────────────────────────────┐
│ VITE_FIREBASE_API_KEY=          │
│ VITE_FIREBASE_PROJECT_ID=...   │
│ ... (todo o conteúdo)           │
└─────────────────────────────────┘

Copie TUDO (Ctrl+A, Ctrl+C)
```

#### 4. Cole em .env.local

```
Abra: .env.local

Cola (Ctrl+V):

┌─────────────────────────────────┐
│ VITE_FIREBASE_API_KEY=          │
│ VITE_FIREBASE_PROJECT_ID=...   │
│ ... (todo o conteúdo)           │
└─────────────────────────────────┘
```

#### 5. Edite a Chave

```
Procure por:
VITE_FIREBASE_API_KEY=

Mude para:
VITE_FIREBASE_API_KEY=AIzaSyD1a2b3c4d5e6f7g8h9i0j
                      ↑ Cole aqui a chave do Passo 2
```

#### 6. Salve

```
Ctrl+S (ou File → Save)
```

✅ **Pronto! Arquivo configurado.**

```
Verificação:
┌─────────────────────────────┐
│ .env.local contém:          │
│ ✓ VITE_FIREBASE_API_KEY=... │
│ ✓ Resto das variáveis      │
│ ✓ Arquivo salvo            │
│ ✓ Não vai ao Git (OK!)     │
└─────────────────────────────┘
```

---

## 🟢 PASSO 4: Testar Localmente

### O Que Você Vai Fazer?
Verificar se tudo funciona no seu computador.

### Passo a Passo Visual

#### 1. Abra Terminal

```
VS Code:

┌────────────────────────────┐
│ Terminal (barra inferior)  │
│ └─ +                       │ Clique
└────────────────────────────┘
```

#### 2. Execute o Servidor

```
Terminal:

$ npm run dev

Resultado esperado:
✓ Servidor iniciado
✓ Local: http://localhost:5173
✓ Network: http://192.168.x.x:5173
```

#### 3. Abra no Navegador

```
Clique em: http://localhost:5173

Ou manualmente:
https://localhost:5173
```

#### 4. Abra Console (F12)

```
Navegador:

                    [F12]
                      ↓
      ┌──────────────────────────┐
      │ Console  │ Elements │...  │
      ├──────────────────────────┤
      │ Procure por erros        │
      │ Deve estar vazio/limpo   │
      └──────────────────────────┘
```

#### 5. Verifique Sucesso

```
SUCESSO:
✓ Nenhuma mensagem vermelha
✓ Nenhum erro
✓ Página carrega normalmente

FALHA:
✗ Mensagem: "Chave não configurada"
✗ Erro do Firebase
→ Volte ao Passo 3 e verifique .env.local
```

#### 6. Teste Login

```
Tela de Login:

Email:    teste@teste.com
Senha:    123456

[Entrar]

Se conseguir entrar → ✅ Tudo funciona!
Se der erro → Verificar console (F12)
```

✅ **Pronto! Testado e funcionando.**

---

## 🔵 PASSO 5: Commit no GitHub

### O Que Você Vai Fazer?
Enviar suas mudanças para GitHub.

### Passo a Passo Visual

#### 1. No VS Code, Abra Source Control

```
Esquerda:
┌──────────────────┐
│ 📁 Explorer      │
│ 🔍 Search       │
│ 🌳 SCM          │ ← Clique
│ ▶️  Run         │
│ 🧪 Testing      │
└──────────────────┘
```

#### 2. Veja Mudanças

```
Source Control:

┌────────────────────────────────┐
│ Changes                        │
├────────────────────────────────┤
│ M public/script.js             │
│ M public/index.html            │
│ ? public/config.js             │
│ ? .env.example                 │
│ ? SECURITY.md                  │
│ ... (mais arquivos)            │
└────────────────────────────────┘

M = Modificado
? = Novo
```

#### 3. Stage All Changes

```
Clique no botão:

        [+] Stage All Changes
            ↓
todos ficam "staged"
```

#### 4. Digite Mensagem

```
Message Box:

┌─────────────────────────────────┐
│ 🔒 security: remover chaves de  │
│    API expostas, usar variáveis │
│    de ambiente                  │
└─────────────────────────────────┘
```

#### 5. Commit

```
Botão: [Commit]

    ↓

Sucesso:
✓ X files changed
✓ Commit criado
```

#### 6. Push

```
Botão: [Sync] ou [Push]

    ↓

Resultado:
✓ Push to origin/main
✓ GitHub atualizado
```

✅ **Pronto! No GitHub.**

---

## 🟣 PASSO 6: Deploy

### O Que Você Vai Fazer?
Colocar a aplicação em produção.

### Para Firebase Hosting

#### Opção A (Mais Fácil - Recomendado)

```
Terminal (novo):

$ npm run build

Resultado:
✓ dist/ criado com tudo compilado

$ firebase login

Resultado:
✓ Browser abre, você faz login

$ firebase deploy --only hosting

Resultado:
✓ Upload feito
✓ URL: https://seu-site.firebaseapp.com
✓ Aplicação em PRODUÇÃO
```

#### Opção B (Se tiver GitHub Actions)

```
Arquivo: .github/workflows/deploy.yml

Configure com variáveis de ambiente:

- name: Build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
  run: npm run build

- name: Deploy
  run: firebase deploy
```

### Para Supabase

```
Se seu backend está em Supabase:

1. Dashboard: https://supabase.com
2. Project → Settings → Environment Variables
3. Adicione:
   FIREBASE_API_KEY=AIzaSyD...

4. Redeploy funções
```

✅ **Pronto! Em produção.**

---

## ✅ TUDO PRONTO!

```
┌─────────────────────────────────────┐
│ ✅ Status Final                     │
├─────────────────────────────────────┤
│ ✓ Chaves antigas revogadas         │
│ ✓ Chave nova gerada                │
│ ✓ .env.local configurado           │
│ ✓ Testado localmente               │
│ ✓ Commitado no GitHub              │
│ ✓ Deployado em produção            │
│                                    │
│ 🎉 Segurança: 100%                 │
│ 🎉 Aplicação: Funcionando!         │
│ 🎉 Custos: Ainda Grátis!          │
└─────────────────────────────────────┘
```

---

## 🆘 Algo Deu Errado?

### Erro: "Chave não configurada"

```
┌─────────────────────────────┐
│ Passo de Diagnóstico        │
├─────────────────────────────┤
│ 1. Arquivo .env.local       │
│    └─ Existe?               │
│    └─ Preenchido?           │
│                             │
│ 2. Reinicie npm             │
│    npm run dev              │
│                             │
│ 3. Verificar console (F12)  │
│    Qual é a mensagem?       │
│                             │
│ 4. Voltar ao Passo 3        │
└─────────────────────────────┘
```

### Erro: "Login não funciona"

```
┌─────────────────────────────┐
│ Passo de Diagnóstico        │
├─────────────────────────────┤
│ 1. Chave foi revogada?      │
│    Deletou corretamente?    │
│                             │
│ 2. Google Cloud Console     │
│    Ainda tem as antigas?    │
│                             │
│ 3. Gerou chave nova?        │
│    No Firebase Console?     │
│                             │
│ 4. Cole corretamente em     │
│    .env.local               │
│                             │
│ 5. Reinicie npm             │
└─────────────────────────────┘
```

### Erro: "Git push falha"

```
Terminal:

$ git status

Verifique:
✓ .env.local está em .gitignore?
✓ Outros arquivos modificados ok?

Se .env.local apareceu:
$ git reset .env.local
$ git push origin main
```

---

## 📋 Checklist Final

Marque conforme completar:

```
PASSO 1:
□ Abri Google Cloud Console
□ Deletei AIzaSyBO3nWHX...
□ Deletei AIzaSyDGclwL...
□ Confirmei que não existem mais

PASSO 2:
□ Abri Firebase Console
□ Copiei chave nova: AIzaSyD...
□ Guardei em local seguro

PASSO 3:
□ Criei .env.local
□ Copiei de .env.example
□ Colei chave em VITE_FIREBASE_API_KEY
□ Salvei o arquivo

PASSO 4:
□ Rodei npm run dev
□ Abri http://localhost:5173
□ Abri console (F12)
□ Nenhum erro apareceu
□ Consegui fazer login

PASSO 5:
□ Abri Source Control (VS Code)
□ Fiz Stage All Changes
□ Escrevi mensagem de commit
□ Cliquei Commit
□ Cliquei Push/Sync

PASSO 6:
□ Rodei npm run build
□ Rodei firebase deploy
│ OU
│ Configurei GitHub Actions
│ Fiz novo push
│ Deploy automático rodou

FINAL:
□ Aplicação em produção funciona
□ Login funciona em produção
□ GitHub mostra "secrets removed"
□ Todos os documentos lidos
□ TUDO PERFEITO! 🎉
```

---

## Dúvidas?

Consulte:
- 📄 [GUIA_PASSO_A_PASSO.md](./GUIA_PASSO_A_PASSO.md) - Completo
- 📄 [DETALHES_TECNICOS.md](./DETALHES_TECNICOS.md) - Técnico
- 📄 [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) - Checklist

---

**Tempo Total:** ~20-30 minutos  
**Dificuldade:** Fácil  
**Risco:** ZERO (você pode desfazer qualquer coisa)  
**Resultado:** ✅ 100% Seguro

Boa sorte! 🚀
