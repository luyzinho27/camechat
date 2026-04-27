# CametaChat Android APK (WebView)

Este projeto inclui um app Android nativo em `android/` que reutiliza o frontend web e fala com o backend configurado.

## Estrutura

- Projeto Android: `android/`
- Activity principal: `android/app/src/main/java/com/cametachat/app/MainActivity.kt`
- URL inicial do app (web): `android/app/build.gradle` (`BuildConfig.START_URL`)
- URL base do backend/API: `android/app/build.gradle` (`BuildConfig.BACKEND_URL`)

## Ajustar URLs do CametaChat

No arquivo `android/app/build.gradle`, use:

```gradle
buildConfigField "String", "START_URL", "\"https://cametachat.web.app\""
buildConfigField "String", "BACKEND_URL", "\"https://vkbqoqmyxesprbnzwcff.supabase.co/functions/v1/cametachat-api\""
```

Use:

- `START_URL`: a URL publica do frontend no Firebase Hosting
- `BACKEND_URL`: a URL base da Edge Function no Supabase

## Credenciais Firebase obrigatorias

Antes de gerar o APK final do CametaChat, substitua:

- `android/app/google-services.json`
- `android/app/src/main/res/values/strings.xml` (`google_web_client_id`)

pelos valores reais do projeto Firebase `cametachat`. Sem isso, o app pode ate compilar, mas `FCM` e o login nativo com Google nao vao funcionar corretamente.

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

