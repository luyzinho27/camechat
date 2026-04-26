#!/bin/bash
# Script de configuração inicial do CameChat
# Use: chmod +x setup.sh && ./setup.sh

set -e

echo "🔒 Configuração de Segurança do CameChat"
echo "========================================"
echo ""

# Verificar se .env.local já existe
if [ -f ".env.local" ]; then
    echo "✅ Arquivo .env.local já existe"
else
    echo "📋 Criando .env.local a partir do template..."
    cp .env.example .env.local
    echo "✅ .env.local criado!"
    echo ""
    echo "⚠️  PRÓXIMOS PASSOS:"
    echo "1. Abra o arquivo .env.local"
    echo "2. Obtenha uma nova chave de API do Firebase em:"
    echo "   https://console.firebase.google.com → Configurações → Chaves de API"
    echo "3. Substitua YOUR_NEW_API_KEY_HERE pela sua chave"
    echo ""
fi

# Verificar .gitignore
if grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo "✅ .env já está no .gitignore"
else
    echo "📝 Adicionando .env ao .gitignore..."
    echo ".env" >> .gitignore
    echo ".env.local" >> .gitignore
    echo "✅ Adicionado!"
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "Agora você pode:"
echo "- Preencher as variáveis em .env.local"
echo "- Fazer commit das mudanças:"
echo "  git add ."
echo "  git commit -m '🔒 fix: configuração segura de chaves de API'"
echo "  git push origin main"
