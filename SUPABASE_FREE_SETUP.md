# CameChat com armazenamento gratis via Supabase Free

> Este guia mantem o backend Node hospedado no Render e troca apenas o armazenamento.
> 
> Se voce quer remover o Render do backend, use `SUPABASE_EDGE_FREE_SETUP.md`.

Esta e a opcao mais pragmatica para custo zero no estado atual do projeto.

## O que voce ganha

- custo zero enquanto permanecer dentro das cotas do plano Free
- armazenamento persistente de midia
- suporte a arquivos arbitrarios em bucket publico
- backend atual do CameChat reaproveitado, porque ele ja fala com storage S3-compativel

## Limites oficiais relevantes

- Storage Size no plano Free: `1 GB`
- Egress no plano Free: `5 GB`
- No Free Plan, nao ha cobranca; ao exceder, o uso adicional fica restrito conforme a politica da plataforma

Consulte:

- `https://supabase.com/docs/guides/platform/billing-on-supabase`
- `https://supabase.com/docs/guides/platform/spend-cap`

## Passo 1: criar conta e projeto

1. Acesse `https://supabase.com/`
2. Clique em `Start your project`
3. Crie a conta
4. Crie um projeto novo
5. Guarde:
   - `Project Ref`
   - `Project URL`
   - `Region`

## Passo 2: criar o bucket

Documentacao oficial:

- `https://supabase.com/docs/guides/storage/buckets/creating-buckets`

No dashboard:

1. Va em `Storage`
2. Clique em `New bucket`
3. Nome:
   - `camechat-media`
4. Marque como `Public`
5. Salve

## Passo 3: gerar as credenciais S3

Referencia oficial:

- `https://supabase.com/docs/guides/self-hosting/copy-from-platform-s3`

No dashboard:

1. Va em `Storage > S3 Configuration > Access keys`
2. Gere uma nova chave
3. Copie:
   - `Access Key ID`
   - `Secret Access Key`
4. Copie tambem:
   - endpoint S3: `https://<project-ref>.supabase.co/storage/v1/s3`
   - region do projeto

Para arquivos grandes, a propria documentacao menciona tambem o hostname direto:

- `https://<project-ref>.storage.supabase.co/storage/v1/s3`

Se quiser, teste primeiro com o endpoint padrao.

## Passo 4: URL publica do bucket

Referencia oficial:

- `https://supabase.com/docs/reference/javascript/storage-from-getpublicurl`

Como o bucket e publico, a base publica fica:

```env
https://SEU_PROJECT_REF.supabase.co/storage/v1/object/public/camechat-media
```

## Passo 5: preencher no Render

Use o arquivo:

- `.env.render.supabase.example`

Valores:

```env
PORT=3000
R2_ACCOUNT_ID=SEU_PROJECT_REF
R2_ENDPOINT=https://SEU_PROJECT_REF.supabase.co/storage/v1/s3
R2_REGION=SUA_REGION
R2_ACCESS_KEY_ID=SUA_SUPABASE_S3_ACCESS_KEY
R2_SECRET_ACCESS_KEY=SUA_SUPABASE_S3_SECRET_KEY
R2_BUCKET=camechat-media
R2_PUBLIC_BASE_URL=https://SEU_PROJECT_REF.supabase.co/storage/v1/object/public/camechat-media
```

Observacao:

- os nomes das variaveis continuam `R2_*` por compatibilidade com o backend atual
- elas funcionam aqui porque o endpoint do Supabase tambem e S3-compativel

## Passo 6: deploy

1. No Render, abra o servico do backend
2. Va em `Environment`
3. Adicione as variaveis acima
4. Salve
5. Rode `Manual Deploy > Deploy latest commit`

## Passo 7: verificar

Abra:

```text
https://SEU_BACKEND.onrender.com/api/health
```

O esperado:

```json
{
  "ok": true,
  "storageMode": "object-storage"
}
```

Se aparecer `local-disk`, alguma variavel esta faltando ou esta errada.

## Observacao importante

Nao existe solucao realmente ilimitada e eterna com zero custo. Esta opcao funciona gratis enquanto voce ficar dentro das cotas oficiais do plano Free do Supabase.

Para o seu caso, ela e mais adequada do que Cloudinary Free, porque Cloudinary limita arquivos "raw" a `10 MB`, o que conflita com seu chat de documentos/audio maiores.
