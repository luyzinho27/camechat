import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FUNCTION_NAME = 'cametachat-api'
const FIREBASE_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const PROFILE_FILE_LIMIT_BYTES = 5 * 1024 * 1024
const CHAT_FILE_LIMIT_BYTES = 50 * 1024 * 1024
const STORAGE_BUCKET = ((
  Deno.env.get('CAMETACHAT_STORAGE_BUCKET')
  || Deno.env.get('CAMECHAT_STORAGE_BUCKET')
  || ''
).trim() || 'cametachat-media')
const STORAGE_PUBLIC_BASE_URL = trimTrailingSlash(
  Deno.env.get('CAMETACHAT_STORAGE_PUBLIC_BASE_URL')
  || Deno.env.get('CAMECHAT_STORAGE_PUBLIC_BASE_URL')
  || ''
)
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const corsHeaders = Object.freeze({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
})

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

type FirebaseServiceAccount = {
  client_email: string
  private_key: string
  project_id: string
}

type FirebaseAccessTokenCache = {
  accessToken: string
  expiresAt: number
}

let firebaseServiceAccountCache: FirebaseServiceAccount | null = null
let firebaseAccessTokenCache: FirebaseAccessTokenCache | null = null

class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const routePath = extractRoutePath(new URL(req.url).pathname)

    if (req.method === 'GET' && routePath === '/') {
      return jsonResponse(buildFunctionManifest(req))
    }

    if (req.method === 'GET' && routePath === '/api/health') {
      return jsonResponse(buildHealthPayload(req))
    }

    if (req.method === 'POST' && routePath === '/api/upload-profile') {
      return await handleProfileUpload(req)
    }

    if (req.method === 'POST' && routePath === '/api/upload-chat') {
      return await handleChatUpload(req)
    }

    if (req.method === 'POST' && routePath === '/api/call-notify') {
      return await handleCallNotify(req)
    }

    if (req.method === 'POST' && routePath === '/api/message-notify') {
      return await handleMessageNotify(req)
    }

    return jsonResponse({ message: 'Endpoint nao encontrado.' }, 404)
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500
    const message = error instanceof Error ? error.message : 'Erro interno.'
    console.error('cametachat-api error', error)
    return jsonResponse({ message }, status)
  }
})

async function handleProfileUpload(req: Request): Promise<Response> {
  const formData = await req.formData()
  const file = formData.get('photo')
  if (!(file instanceof File)) {
    throw new HttpError(400, 'Nenhum arquivo enviado.')
  }
  if (!file.type.startsWith('image/')) {
    throw new HttpError(400, 'A foto de perfil deve ser uma imagem.')
  }
  if (file.size > PROFILE_FILE_LIMIT_BYTES) {
    throw new HttpError(400, 'A foto de perfil deve ter no maximo 5 MB.')
  }

  const displayName = readFormDataString(formData.get('displayName'))
  const uid = readFormDataString(formData.get('uid'))
  const filename = buildProfileFilename(displayName, uid, file.name)
  const objectPath = `profile/${filename}`
  const url = await uploadFileToStorage(objectPath, file)

  return jsonResponse(
    { url },
    200,
    { 'Cache-Control': 'public, max-age=31536000, immutable' }
  )
}

async function handleChatUpload(req: Request): Promise<Response> {
  const formData = await req.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    throw new HttpError(400, 'Nenhum arquivo enviado.')
  }
  if (file.size > CHAT_FILE_LIMIT_BYTES) {
    throw new HttpError(400, 'O arquivo deve ter no maximo 50 MB.')
  }

  const uid = readFormDataString(formData.get('uid'))
  const filename = buildChatFilename(uid, file.name)
  const objectPath = `upload/${filename}`
  const url = await uploadFileToStorage(objectPath, file)

  return jsonResponse(
    { url },
    200,
    { 'Cache-Control': 'public, max-age=31536000, immutable' }
  )
}

async function handleCallNotify(req: Request): Promise<Response> {
  const payload = await readJsonBody(req)
  const tokens = normalizeTokens(payload.tokens)
  if (!tokens.length) {
    return jsonResponse({ ok: true, skipped: true })
  }

  const isVideo = String(payload.callType || 'audio') === 'video'
  const callerName = String(payload.callerName || 'Usuario')
  const notificationBody = isVideo
    ? 'Chamada de video recebida'
    : 'Chamada de voz recebida'

  const result = await sendFirebaseMessages(tokens, {
    notification: {
      title: callerName,
      body: notificationBody
    },
    data: {
      type: 'call',
      callId: String(payload.callId || ''),
      callType: String(payload.callType || 'audio'),
      callerId: String(payload.callerId || ''),
      callerName,
      callerPhoto: String(payload.callerPhotoURL || '')
    },
    android: {
      priority: 'HIGH',
      notification: {
        channel_id: 'cametachat_calls',
        visibility: 'PUBLIC',
        sound: 'default',
        default_vibrate_timings: true,
        icon: 'ic_launcher'
      }
    }
  })

  return jsonResponse({ ok: true, ...result })
}

async function handleMessageNotify(req: Request): Promise<Response> {
  const payload = await readJsonBody(req)
  const tokens = normalizeTokens(payload.tokens)
  if (!tokens.length) {
    return jsonResponse({ ok: true, skipped: true })
  }

  const senderName = String(payload.senderName || 'Usuario')
  const messageType = String(payload.messageType || 'text')
  const messageText = String(payload.messageText || '')
  const fileName = String(payload.fileName || '')
  const notificationBody = String(payload.notificationBody || messageText || fileName || 'Nova mensagem')

  const result = await sendFirebaseMessages(tokens, {
    notification: {
      title: senderName,
      body: notificationBody
    },
    data: {
      type: 'message',
      messageType,
      messageText,
      fileName,
      senderId: String(payload.senderId || ''),
      senderName,
      senderPhoto: String(payload.senderPhotoURL || ''),
      conversationId: String(payload.conversationId || ''),
      count: String(payload.count || '')
    },
    android: {
      priority: 'HIGH',
      notification: {
        channel_id: 'cametachat_messages',
        visibility: 'PRIVATE',
        sound: 'default',
        default_vibrate_timings: true,
        icon: 'ic_launcher'
      }
    }
  })

  return jsonResponse({ ok: true, ...result })
}

async function uploadFileToStorage(objectPath: string, file: File): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new HttpError(500, 'Supabase nao configurado.')
  }

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, file, {
      cacheControl: '31536000',
      contentType: file.type || 'application/octet-stream',
      upsert: false
    })

  if (error) {
    throw new HttpError(500, error.message || 'Falha ao enviar arquivo.')
  }

  return buildPublicObjectUrl(objectPath)
}

function buildPublicObjectUrl(objectPath: string): string {
  const encodedPath = objectPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  if (STORAGE_PUBLIC_BASE_URL) {
    return `${STORAGE_PUBLIC_BASE_URL}/${encodedPath}`
  }

  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath)
  return data.publicUrl
}

function buildFunctionManifest(req: Request): Record<string, unknown> {
  const serviceAccountState = readFirebaseServiceAccountState()
  const baseUrl = buildFunctionBaseUrl(req)

  return {
    ok: true,
    function: FUNCTION_NAME,
    provider: 'supabase-edge-functions',
    storageMode: 'object-storage',
    storageBucket: STORAGE_BUCKET,
    storagePublicBaseUrl: STORAGE_PUBLIC_BASE_URL || null,
    supabaseConfigured: Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY),
    firebaseConfigured: serviceAccountState.configured,
    firebaseProjectId: serviceAccountState.projectId,
    limits: {
      profileFileBytes: PROFILE_FILE_LIMIT_BYTES,
      chatFileBytes: CHAT_FILE_LIMIT_BYTES
    },
    endpoints: {
      manifest: baseUrl,
      health: `${baseUrl}/api/health`,
      uploadProfile: `${baseUrl}/api/upload-profile`,
      uploadChat: `${baseUrl}/api/upload-chat`,
      callNotify: `${baseUrl}/api/call-notify`,
      messageNotify: `${baseUrl}/api/message-notify`
    }
  }
}

function buildHealthPayload(req: Request): Record<string, unknown> {
  return {
    ...buildFunctionManifest(req),
    health: 'ok'
  }
}

async function sendFirebaseMessages(
  tokens: string[],
  message: Record<string, unknown>
): Promise<{ successCount: number; failureCount: number }> {
  const results = await Promise.allSettled(tokens.map((token) => sendFirebaseMessage(token, message)))
  const successCount = results.filter((result) => result.status === 'fulfilled').length
  return {
    successCount,
    failureCount: tokens.length - successCount
  }
}

async function sendFirebaseMessage(token: string, message: Record<string, unknown>): Promise<void> {
  const serviceAccount = getFirebaseServiceAccount()
  const accessToken = await getFirebaseAccessToken()
  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        message: {
          token,
          ...message
        }
      })
    }
  )

  if (!response.ok) {
    const rawText = await response.text()
    throw new Error(rawText || 'Falha ao enviar notificacao.')
  }
}

async function getFirebaseAccessToken(): Promise<string> {
  const now = Date.now()
  if (firebaseAccessTokenCache && firebaseAccessTokenCache.expiresAt > now + 60_000) {
    return firebaseAccessTokenCache.accessToken
  }

  const serviceAccount = getFirebaseServiceAccount()
  const issuedAt = Math.floor(now / 1000)
  const expiresAt = issuedAt + 3600
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: serviceAccount.client_email,
    scope: FIREBASE_SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: issuedAt,
    exp: expiresAt
  }

  const unsignedToken = `${base64UrlEncodeJson(header)}.${base64UrlEncodeJson(payload)}`
  const signature = await signJwt(unsignedToken, serviceAccount.private_key)
  const assertion = `${unsignedToken}.${signature}`
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion
  })

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  const data = await response.json()

  if (!response.ok || typeof data?.access_token !== 'string') {
    throw new HttpError(500, 'Falha ao gerar token do Firebase.')
  }

  firebaseAccessTokenCache = {
    accessToken: data.access_token,
    expiresAt: now + Math.max(0, Number(data.expires_in || 3600) - 60) * 1000
  }

  return firebaseAccessTokenCache.accessToken
}

function getFirebaseServiceAccount(): FirebaseServiceAccount {
  if (firebaseServiceAccountCache) {
    return firebaseServiceAccountCache
  }

  const state = readFirebaseServiceAccountState()
  if (!state.raw) {
    throw new HttpError(500, 'Firebase service account nao configurado.')
  }

  if (!state.clientEmail || !state.privateKey || !state.projectId) {
    throw new HttpError(500, 'Firebase service account invalido.')
  }

  firebaseServiceAccountCache = {
    client_email: state.clientEmail,
    private_key: state.privateKey,
    project_id: state.projectId
  }

  return firebaseServiceAccountCache
}

function readFirebaseServiceAccountState(): {
  configured: boolean
  raw: string
  clientEmail: string
  privateKey: string
  projectId: string
} {
  const rawJson = (Deno.env.get('FIREBASE_SERVICE_ACCOUNT_JSON') || '').trim()
  const rawBase64 = (Deno.env.get('FIREBASE_SERVICE_ACCOUNT_JSON_BASE64') || '').trim()
  const raw =
    rawBase64
      ? atob(rawBase64)
      : rawJson

  if (!raw) {
    return {
      configured: false,
      raw: '',
      clientEmail: '',
      privateKey: '',
      projectId: ''
    }
  }

  const parsed = parseServiceAccountJson(raw)
  const clientEmail = String(parsed?.client_email || '').trim()
  const privateKey = String(parsed?.private_key || '').replace(/\\n/g, '\n').trim()
  const projectId = String(parsed?.project_id || '').trim()
  const configured = Boolean(clientEmail && privateKey && projectId)

  return {
    configured,
    raw,
    clientEmail,
    privateKey,
    projectId
  }
}

function parseServiceAccountJson(rawValue: string): Record<string, unknown> | null {
  let candidate = String(rawValue || '').trim()
  if (!candidate) {
    return null
  }

  if (
    (candidate.startsWith('"') && candidate.endsWith('"')) ||
    (candidate.startsWith("'") && candidate.endsWith("'"))
  ) {
    try {
      candidate = JSON.parse(candidate)
    } catch (_) {
      // Keep original candidate.
    }
  }

  try {
    const parsed = JSON.parse(candidate)
    return typeof parsed === 'string' ? JSON.parse(parsed) : parsed
  } catch (_) {
    const repaired = repairServiceAccountJson(candidate)
    if (repaired === candidate) {
      return null
    }
    try {
      const parsed = JSON.parse(repaired)
      return typeof parsed === 'string' ? JSON.parse(parsed) : parsed
    } catch (_) {
      return null
    }
  }
}

function repairServiceAccountJson(rawValue: string): string {
  const match = rawValue.match(/"private_key"\s*:\s*"([\s\S]*?)"/m)
  if (!match) {
    return rawValue
  }
  const repairedKey = match[1].replace(/\r?\n/g, '\\n')
  return rawValue.replace(match[0], `"private_key":"${repairedKey}"`)
}

function extractRoutePath(pathname: string): string {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  const marker = `/${FUNCTION_NAME}`
  const markerIndex = normalizedPath.indexOf(marker)

  if (markerIndex >= 0) {
    const suffix = normalizedPath.slice(markerIndex + marker.length)
    return suffix || '/'
  }

  return normalizedPath
}

function buildFunctionBaseUrl(req: Request): string {
  const currentUrl = new URL(req.url)
  return `${currentUrl.origin}/functions/v1/${FUNCTION_NAME}`
}

async function readJsonBody(req: Request): Promise<Record<string, unknown>> {
  try {
    const payload = await req.json()
    if (!payload || typeof payload !== 'object') {
      throw new Error('invalid-json')
    }
    return payload as Record<string, unknown>
  } catch (_) {
    throw new HttpError(400, 'JSON invalido.')
  }
}

function readFormDataString(entry: FormDataEntryValue | null): string {
  return typeof entry === 'string' ? entry.trim() : ''
}

function normalizeTokens(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((item) => String(item || '').trim())
    .filter((token, index, list) => token && list.indexOf(token) === index)
}

function buildProfileFilename(displayName: string, uid: string, originalName: string): string {
  const safeExt = safeExtFromName(originalName)
  const nameSlug = slugify(displayName) || 'usuario'
  const safeUserId = safeUid(uid)
  const unique = buildUniqueSuffix()
  const prefix = safeUserId ? `${nameSlug}-${safeUserId}` : nameSlug
  return `${prefix}-${unique}${safeExt}`
}

function buildChatFilename(uid: string, originalName: string): string {
  const safeExt = safeExtFromName(originalName)
  const baseName = safeBaseName(originalName)
  const safeUserId = safeUid(uid) || 'user'
  const unique = buildUniqueSuffix()
  return `${safeUserId}-${baseName}-${unique}${safeExt}`
}

function buildUniqueSuffix(): string {
  return `${Date.now()}-${Math.round(Math.random() * 1e6)}`
}

function safeUid(value: string): string {
  return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24)
}

function safeExtFromName(filename: string): string {
  const dotIndex = filename.lastIndexOf('.')
  const ext = dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : ''
  return ext && ext.length <= 10 ? ext : ''
}

function safeBaseName(filename: string): string {
  const dotIndex = filename.lastIndexOf('.')
  const base = dotIndex >= 0 ? filename.slice(0, dotIndex) : filename
  return slugify(base) || 'arquivo'
}

function slugify(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 40)
}

function trimTrailingSlash(value: string): string {
  return String(value || '').trim().replace(/\/+$/, '')
}

function jsonResponse(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=UTF-8',
      ...extraHeaders
    }
  })
}

async function signJwt(unsignedToken: string, privateKeyPem: string): Promise<string> {
  const keyData = pemToArrayBuffer(privateKeyPem)
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  )
  return base64UrlEncodeBytes(new Uint8Array(signature))
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes.buffer
}

function base64UrlEncodeJson(value: Record<string, unknown>): string {
  return base64UrlEncodeString(JSON.stringify(value))
}

function base64UrlEncodeString(value: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(value))
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

