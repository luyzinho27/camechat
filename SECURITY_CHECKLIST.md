# ✅ Checklist de Ações de Segurança

## 🔴 CRÍTICO - Fazer Agora

- [ ] **1. Revogar Chaves Antigas**
  - URL: https://console.cloud.google.com
  - Caminho: APIs & Services → Credentials
  - Ação: Delete as duas chaves expostas
  - Chaves a deletar:
    - `AIzaSyBO3nWHXF8HDmPI5H0g6KWCS35L6lB9Fbs`
    - `AIzaSyDGclwLGfGVlpKNjUhenZ5nN1vK_mrdjls`

- [ ] **2. Gerar Novas Chaves**
  - URL: https://console.firebase.google.com
  - Projeto: `camechat-4fb88`
  - Caminho: Configurações → Application
  - Copiar: Web API Key

- [ ] **3. Atualizar Arquivo Local**
  - Editar: `.env.local`
  - Campo: `VITE_FIREBASE_API_KEY`
  - Colar: Sua nova chave

- [ ] **4. Testar Localmente**
  - Abrir: http://localhost:5173 (ou sua porta)
  - Verificar no console: Sem aviso "Chave de API não configurada"

- [ ] **5. Fazer Commit e Push**
  ```bash
  git add .env.example public/config.js public/script.js public/index.html SECURITY.md
  git commit -m "🔒 security: remover chaves de API expostas"
  git push origin main
  ```

- [ ] **6. Verificar no GitHub**
  - Ir para: Seu repositório → Security → Secret scanning
  - Confirmar que as chaves foram removidas

---

## 🟡 IMPORTANTE - Próximas 24h

- [ ] **Atualizar CI/CD**
  - Se usa GitHub Actions, GitLab CI, etc.
  - Adicionar variáveis de ambiente lá

- [ ] **Notificar Equipe**
  - Compartilhe o SECURITY.md
  - Instrua sobre `.env.local`

- [ ] **Revisar Histórico**
  - Verificar se há outras chaves expostas
  - Revisar commits anteriores

---

## 🟢 MANUTENÇÃO - Esta Semana

- [ ] **Implementar Pre-commit Hook**
  ```bash
  # Para evitar commits com secrets no futuro
  npm install --save-dev husky
  npm run prepare # Configurar husky
  ```

- [ ] **Configurar Rotation de Chaves**
  - A cada 90 dias, gerar novas chaves
  - Atualizar `.env.local`

- [ ] **Documentar para Novos Devs**
  - Compartilha guia SECURITY.md
  - Crie issue/wiki interno

---

## 📋 Arquivos Alterados

```
✅ Criados:
  - .env.example (novo)
  - .env.local (novo, no .gitignore)
  - public/config.js (novo)
  - SECURITY.md (novo)
  - setup.sh (novo)
  - SECURITY_FIX_SUMMARY.md (novo)

✏️ Modificados:
  - public/script.js (removidas chaves hardcoded)
  - public/index.html (adicionado import de config.js)

⏸️ Sem alterações (já estava lá):
  - .gitignore (já tinha .env)
```

---

## 🔍 Validação

Após fazer push, você verá no GitHub:

```
✅ Secret scanning found that credentials were removed
   - 2 previously exposed secrets now taken offline
   - Repository status: SECURE
```

---

## 📚 Referências Rápidas

| Tarefa | Link |
|--------|------|
| Revogar Chaves | https://console.cloud.google.com/apis/credentials |
| Gerar Novas | https://console.firebase.google.com/u/0/project/camechat-4fb88/settings/general |
| GitHub Secrets | https://github.com/seu-user/CameChat/settings/secrets |
| Guia Completo | Ver: SECURITY.md |

---

## 🆘 Ajuda

Se algo der errado:

1. **Chave não carrega?**
   - Verificar se `.env.local` existe
   - Verificar console do navegador por erros
   - Testar se `config.js` foi incluído no HTML

2. **Firebase retorna erro de autenticação?**
   - Chave expirou?
   - Precisa gerar nova no console: https://console.firebase.google.com

3. **Não consegue committar?**
   - Verificar se `.env.local` está no `.gitignore`
   - Remover arquivo rastreado: `git rm --cached .env.local`

---

**Atualizado:** 26 de abril de 2026  
**Prioridade:** 🔴 CRÍTICA  
**Tempo estimado:** 15-30 minutos
