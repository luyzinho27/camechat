# CameChat Android APK (WebView)

Este projeto inclui um app Android nativo em `android/` que reutiliza o frontend web e fala com o backend configurado.

## Estrutura

- Projeto Android: `android/`
- Activity principal: `android/app/src/main/java/com/camechat/app/MainActivity.kt`
- URL inicial do app (web): `android/app/build.gradle` (`BuildConfig.START_URL`)
- URL base do backend/API: `android/app/build.gradle` (`BuildConfig.BACKEND_URL`)

## Ajustar URLs do CameChat

No arquivo `android/app/build.gradle`, altere:

```gradle
buildConfigField "String", "START_URL", "\"https://camechat.onrender.com\""
buildConfigField "String", "BACKEND_URL", "\"https://camechat.onrender.com\""
```

Use:

- `START_URL`: a URL publica onde o seu `index.html` esta rodando
- `BACKEND_URL`: a URL base da API online

Se voce migrar o backend para Supabase Edge Functions, `START_URL` e `BACKEND_URL` provavelmente serao diferentes.

## Gerar APK no Android Studio

1. Abra o Android Studio.
2. Selecione **Open** e abra a pasta `android/`.
3. Aguarde o Gradle sincronizar.
4. Menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. O APK sera gerado em:
   - `android/app/build/outputs/apk/debug/app-debug.apk`

## Funcionalidades cobertas no wrapper

- Login/sessao persistente (cookies + localStorage do WebView)
- Chat em tempo real
- Upload de arquivos (seletor do Android)
- Camera/microfone para recursos web (com permissoes Android)
- Download de anexos (DownloadManager)
- Abertura de links externos no navegador

## Permissoes Android usadas

- `INTERNET`
- `CAMERA`
- `RECORD_AUDIO`
- `MODIFY_AUDIO_SETTINGS`
- `WRITE_EXTERNAL_STORAGE` (somente ate Android 9)
