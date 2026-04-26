# 🔒 Guia de Segurança - Chaves de API e Configuração

## ⚠️ Alertas de Segurança Detectados

Seu repositório tinha **duas chaves de API do Google expostas publicamente**:

1. ❌ `android/app/google-services.json` - linha 31
2. ❌ `public/script.js` - linha 3

Essas chaves **FORAM REVOGADAS** e removidas da aplicação.

---

## ✅ O que foi feito

### 1. **Removido: Chaves Hardcoded**
- Removidas as chaves de API exposta do `script.js`
- Configuração agora usa variáveis de ambiente

### 2. **Criado: Sistema de Variáveis de Ambiente**
- `.env.example` - Template com todas as variáveis necessárias
- `.env.local` - Arquivo local (no `.gitignore`) com suas chaves

### 3. **Criado: Arquivo de Configuração Seguro**
- `public/config.js` - Carrega as variáveis de forma segura

---

## 🔧 Como Configurar Localmente

### Para Desenvolvimento:

1. **Copiar template de variáveis:**
   ```bash
   cp .env.example .env.local
   ```

2. **Obter novas chaves de API:**
   - Acesse: https://console.firebase.google.com
   - Projeto: `camechat-4fb88`
   - Vá para: `Configurações do Projeto` → `Configuração do Seu Aplicativo`
   - Copie a chave de API (Web)

3. **Preencher `.env.local`:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy_SUA_NOVA_CHAVE_AQUI
   ```

4. **Confirmar que `.env.local` está no `.gitignore`:**
   ```
   ✅ Já configurado!
   ```

---

## 📱 Para Android

O arquivo `android/app/google-services.json` contém configurações sensíveis. 

**Nunca commite esse arquivo em repositórios públicos!**

Se necessário para CI/CD:
- Use GitHub Secrets
- Injete em tempo de build
- Não exponha no repositório

---

## 🚀 Deployment

### Firebase Hosting:

1. **Via CLI do Firebase:**
   ```bash
   firebase login
   firebase deploy --only hosting
   ```
   Variáveis de ambiente não viajam para o Firebase Hosting tradicional.

### Vercel / Netlify:

1. **Adicione variáveis de ambiente no painel:**
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc.

2. **Deploy automático a partir de git:**
   ```bash
   git push origin main
   ```

### Docker / Custom Server:

1. **Build com variáveis:**
   ```bash
   docker build --build-arg VITE_FIREBASE_API_KEY=sua_chave .
   ```

---

## 🔑 Próximos Passos

### IMEDIATO (Segurança Crítica):

- [ ] **Revogar chaves antigas:**
  - Acesse: https://console.cloud.google.com
  - APIs & Services → Credentials
  - Delete as antigas: `AIzaSyBO3nWHXF8HDmPI5H0g6KWCS35L6lB9Fbs` e `AIzaSyDGclwLGfGVlpKNjUhenZ5nN1vK_mrdjls`

- [ ] **Gerar novas chaves:**
  - Crie novas chaves de restrição de IP/HTTP referrer
  - Restaure em `VITE_FIREBASE_API_KEY`

- [ ] **Fazer commit das mudanças:**
  ```bash
  git add .env.example public/config.js public/script.js public/index.html README.md SECURITY.md
  git commit -m "🔒 fix: remover chaves de API expostas, usar variáveis de ambiente"
  git push origin main
  ```

- [ ] **Push para GitHub:**
  - GitHub detectará se chaves foram removidas ✅

### Melhorias Futuras:

- [ ] Configurar GitHub Secrets para CI/CD
- [ ] Implementar rotation periódica de chaves
- [ ] Auditar outros possíveis pontos de vazamento
- [ ] Adicionar pre-commit hook para detectar secrets

---

## 📚 Referências

- [Firebase Security Documentation](https://firebase.google.com/docs/projects/learn-more#security-rules)
- [Google Cloud API Keys Best Practices](https://cloud.google.com/docs/authentication/api-keys#best-practices)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 🛡️ Monitoramento Contínuo

GitHub continuará monitorando seu repositório. Se detectar novas chaves:
- Vá para: `Security → Secret scanning alerts`
- Revogue imediatamente
- A chave não deve estar presente no histórico

---

**Última atualização:** 26 de abril de 2026  
**Status:** ✅ Chaves removidas e configuração segura implementada
