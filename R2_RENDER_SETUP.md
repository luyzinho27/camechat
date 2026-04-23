# Persistencia de midia no Render com Cloudflare R2

Objetivo:

- impedir que arquivos enviados sumam depois de reinicio/redeploy do Render
- manter URLs de midia persistentes
- usar o suporte que ja existe em `server.js`

## O que ja esta pronto no codigo

O backend ja troca automaticamente de disco local para bucket externo quando estas variaveis existem:

- `R2_ACCOUNT_ID`
- `R2_ENDPOINT`
- `R2_REGION`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`

Referencia:

- `server.js`
- `.env.render.example`

## Passo 1: criar o bucket no Cloudflare R2

Fontes oficiais:

- Cloudflare R2 S3: https://developers.cloudflare.com/r2/get-started/s3/
- Cloudflare R2 tokens: https://developers.cloudflare.com/r2/api/s3/tokens/
- Cloudflare R2 public buckets: https://developers.cloudflare.com/r2/data-access/public-buckets/

Faca assim:

1. Entre no painel da Cloudflare.
2. Abra `Storage & databases > R2`.
3. Crie um bucket, por exemplo: `camechat-media`.
4. Abra `Manage API tokens`.
5. Crie um token com permissao `Object Read & Write`.
6. Restrinja esse token ao bucket `camechat-media`.
7. Copie e guarde:
   - `Access Key ID`
   - `Secret Access Key`
8. Copie tambem o endpoint S3:
   - `https://SEU_ACCOUNT_ID.r2.cloudflarestorage.com`

## Passo 2: expor o bucket publicamente

Voce precisa de uma URL publica para servir as midias salvas.

Opcao recomendada:

1. No bucket, abra `Settings`.
2. Em `Custom Domains`, clique em `Add`.
3. Conecte um dominio ou subdominio, por exemplo:
   - `media.seudominio.com`
4. Aguarde o status ficar `Active`.

Depois disso, use:

- `R2_PUBLIC_BASE_URL=https://media.seudominio.com`

Opcao de desenvolvimento:

- habilitar `r2.dev`

Se usar isso, o valor fica parecido com:

- `R2_PUBLIC_BASE_URL=https://pub-xxxxxxxxxxxxxxxx.r2.dev`

Para producao, prefira dominio proprio.

## Passo 3: configurar o Render

Fonte oficial:

- Render env vars: https://render.com/docs/configure-environment-variables

No Render:

1. Abra o servico web do backend.
2. Va em `Environment`.
3. Adicione estas variaveis:

```env
PORT=3000
R2_ACCOUNT_ID=SEU_ACCOUNT_ID
R2_ENDPOINT=https://SEU_ACCOUNT_ID.r2.cloudflarestorage.com
R2_REGION=auto
R2_ACCESS_KEY_ID=SUA_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY=SUA_SECRET_ACCESS_KEY
R2_BUCKET=camechat-media
R2_PUBLIC_BASE_URL=https://media.seudominio.com
```

Se quiser, voce pode copiar os valores de `.env.render.example`.

## Passo 4: redeploy do backend

1. No Render, clique em `Manual Deploy`.
2. Escolha `Deploy latest commit`.

## Passo 5: verificar se entrou em modo persistente

Abra no navegador:

- `https://SEU_BACKEND.onrender.com/api/health`

O resultado correto deve ser:

```json
{
  "ok": true,
  "storageMode": "object-storage"
}
```

Se aparecer `local-disk`, alguma variavel esta faltando ou incorreta.

## Passo 6: testar upload real

1. Envie uma imagem pelo CameChat.
2. Verifique se a URL retornada do upload nao comeca com:
   - `/images/uploads/...`
3. O esperado e uma URL publica do bucket:
   - `https://media.seudominio.com/uploads/...`

## Importante

Sem bucket externo, o Render pode perder os arquivos do diretório local `images/uploads` apos restart, troca de instancia ou redeploy.

Por isso a mensagem:

- `Arquivo de mídia indisponível. Peça para o contato reenviar.`

## O que eu ja deixei pronto no projeto

- backend preparado para R2 em `server.js`
- template de variaveis em `.env.render.example`
- cache local de midia no app para reduzir perda no mesmo dispositivo
- salvamento local separado em:
  - `CameChat/Media/...`
  - `CameChat/Media/Enviados/...`
