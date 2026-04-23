# CameChat sem Render usando Supabase + Firebase

Este e o caminho mais realista para colocar o CameChat online de novo sem depender do backend Node no Render.

## O que esta migracao faz

- remove a necessidade do `server.js` estar hospedado no Render
- move uploads e notificacoes push para `Supabase Edge Functions`
- continua usando `Firebase Auth`, `Firestore` e `FCM`, porque o frontend atual depende fortemente disso

## O que ela nao faz

- nao troca `Firebase Auth` por `Supabase Auth`
- nao troca `Firestore` por `Supabase Postgres`
- nao coloca o frontend inteiro para rodar "so no Supabase"

Esse ultimo ponto importa porque, segundo a documentacao oficial do Supabase:

- arquivos HTML no Storage sao servidos como `text/plain`
- `Edge Functions` so servem HTML corretamente com `custom domains`
- `custom domains` sao um add-on pago em projetos pagos

Ou seja: para manter custo zero, use o Supabase no backend e um host estatico gratis no frontend.

## Host recomendado para o frontend

Como o projeto ja usa Firebase, o caminho mais simples e hospedar `index.html`, `script.js`, `style.css` e `images/` no `Firebase Hosting`.

## Limites oficiais que afetam o CameChat

- Supabase Free Storage Size: `1 GB`
- Supabase Free bandwidth total: `10 GB` (`5 GB` cached + `5 GB` uncached)
- Supabase Free Edge Function invocations: `500000`
- Supabase Free max file size configuravel no Storage: `50 MB`

Por isso este projeto foi ajustado para `50 MB` como limite maximo de anexo.

## Arquivos adicionados nesta migracao

- `supabase/config.toml`
- `supabase/functions/camechat-api/index.ts`

## Passo 1: criar o projeto no Supabase

1. Crie ou reutilize um projeto no Supabase.
2. Em `Storage`, crie um bucket publico chamado `camechat-media`.
3. Em `Edge Functions`, mantenha os secrets padrao do projeto.

## Passo 2: configurar secrets adicionais

No dashboard do Supabase, adicione estes secrets:

```env
CAMECHAT_STORAGE_BUCKET=camechat-media
CAMECHAT_STORAGE_PUBLIC_BASE_URL=https://SEU_PROJECT_REF.supabase.co/storage/v1/object/public/camechat-media
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account", ...}
```

Se preferir, voce pode usar Base64:

```env
FIREBASE_SERVICE_ACCOUNT_JSON_BASE64=SEU_JSON_EM_BASE64
```

Use o mesmo service account do Firebase que o `server.js` antigo usava para enviar notificacoes FCM.

## Passo 3: deploy da Edge Function

Voce pode fazer isso pelo Dashboard ou pela CLI do Supabase.

Exemplo pela CLI:

```bash
supabase functions deploy camechat-api --no-verify-jwt
```

Base URL da funcao depois do deploy:

```text
https://SEU_PROJECT_REF.supabase.co/functions/v1/camechat-api
```

## Passo 4: apontar o frontend web

No `index.html`, ajuste `window.CAMECHAT_BACKEND_URL` para a URL da funcao:

```js
window.CAMECHAT_BACKEND_URL = 'https://SEU_PROJECT_REF.supabase.co/functions/v1/camechat-api';
```

Depois publique os arquivos estaticos em um host gratis, por exemplo `Firebase Hosting`.

## Passo 5: apontar o app Android

Agora existem duas URLs no `android/app/build.gradle`:

- `START_URL`: URL publica do frontend web
- `BACKEND_URL`: URL base da Edge Function do Supabase

Exemplo:

```gradle
buildConfigField "String", "START_URL", "\"https://SEU_FRONTEND.web.app\""
buildConfigField "String", "BACKEND_URL", "\"https://SEU_PROJECT_REF.supabase.co/functions/v1/camechat-api\""
```

Depois gere o APK novamente.

## Passo 6: validar

Teste o healthcheck:

```text
https://SEU_PROJECT_REF.supabase.co/functions/v1/camechat-api/api/health
```

Resposta esperada:

```json
{
  "ok": true,
  "provider": "supabase-edge-functions",
  "storageMode": "object-storage"
}
```

Depois valide:

1. upload de foto de perfil
2. upload de imagem/documento no chat
3. push de nova mensagem no Android
4. push de chamada no Android
5. compartilhamento nativo de arquivo no Android

## O que pode ser apagado no Render

Depois que tudo acima estiver validado em producao:

- voce pode apagar o web service do Render que hospeda o `server.js`
- se nao houver `Postgres`, `Key Value` ou `Persistent Disk` ligados a ele, nao ha mais nada obrigatorio para manter no Render

Antes de apagar:

1. copie as env vars importantes do Render
2. confirme que o frontend web ja esta publicado fora do Render
3. confirme que as midias novas estao indo para o bucket `camechat-media`
4. mantenha o servico antigo por algumas horas ou um dia como rollback, se puder

## O que NAO apagar sem conferir antes

- bucket antigo no Cloudflare R2, se ainda existir midia la
- service account do Firebase
- dominio antigo, se ele ainda estiver sendo usado pelo app Android ou pelo frontend
