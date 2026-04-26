# ⚠️ ADICIONAL: Instalar Dependências

## O Problema

Seu projeto estava **sem o arquivo `package.json`**, então o npm não conseguia rodar.

**Acabei de criar o arquivo para você! ✅**

---

## 🔧 Próximas 3 Linhas (2 minutos)

### No Terminal (PowerShell), execute:

```powershell
# Certifique-se que está na pasta correta
cd C:\Users\luizy\Documents\GitHub\CameChat

# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Abrir no navegador
# Ele mostrará: http://localhost:5173 (ou outra porta)
```

---

## ✅ O Que Acontecerá

### Durante npm install

```
Terminal vai mostrar:
added X packages
- firebase@10.8.0
- vite@5.0.0
- firebase-tools@13.5.0
```

Isso pode levar 1-2 minutos.

### Após npm run dev

```
Terminal vai mostrar:
✓ Vite v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🌐 Testar Localmente

1. **Abra o navegador**
   ```
   http://localhost:5173
   ```

2. **Abra o Console (F12)**
   - Procure por erros vermelhos
   - Nenhum erro? ✅ Tudo certo!

3. **Teste o Login**
   ```
   Email: teste@teste.com
   Senha: 123456
   ```

---

## 🎯 Se Algo Dar Errado

### Erro: "ENOENT: no such file or directory, open 'C:\...\package.json'"
**Solução:** Você já tem o arquivo agora! Basta rodar `npm install` novamente.

### Erro: "npm: The term 'npm' is not recognized"
**Solução:** 
Node.js não está instalado. Instale de: https://nodejs.org/

```powershell
# Verificar se Node está instalado:
node --version
npm --version
```

### Erro durante npm install (timeout)
**Solução:**
```powershell
npm install --legacy-peer-deps
```

### Aplicação carrega mas não funciona Firebase
**Solução:**
Volte ao [COMECE_AGORA.md](./COMECE_AGORA.md) Passo 3 e verifique se `.env.local` está correto:

```powershell
# Verificar arquivo
cat .env.local

# Deve ter:
# VITE_FIREBASE_API_KEY=AIzaSyD...
# (com sua chave real do Firebase, não vazio!)
```

---

## ⏱️ Timeline

```
Agora (você está aqui):
→ npm install (1-2 minutos)
→ npm run dev (imediato)

Resultado:
✅ Servidor rodando em localhost:5173
✅ Navegador abre
✅ Aplicação carregada

Próximo:
→ Voltar para COMECE_AGORA.md
→ Continuar do PASSO 4 (já feito!)
→ PASSO 5: Commit no GitHub
```

---

## ✅ Checklist

- [ ] Executei: `npm install`
- [ ] Executei: `npm run dev`
- [ ] Terminal mostra: `http://localhost:5173`
- [ ] Abri no navegador
- [ ] Abri console (F12)
- [ ] Nenhum erro vermelho
- [ ] Consegui fazer login

Se tudo checked: ✅ **Volte ao [COMECE_AGORA.md](./COMECE_AGORA.md) PASSO 5 (Commit)**

---

## 📞 Perguntas?

- **Sim, mas npm install tá travado** → Ctrl+C para parar, tente `npm install --legacy-peer-deps`
- **Sim, node não está instalado** → https://nodejs.org/ (baixe e instale)
- **Sim, outra coisa** → Consulte [GUIA_PASSO_A_PASSO.md#-troubleshooting](./GUIA_PASSO_A_PASSO.md#-troubleshooting)

---

Agora execute e volta aqui quando `npm run dev` estiver rodando! 🚀
