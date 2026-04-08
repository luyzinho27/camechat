const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let S3Client = null;
let PutObjectCommand = null;
try {
    ({ S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'));
} catch (error) {
    console.warn('SDK S3 nao encontrado. Upload em bucket externo desativado; usando disco local.');
}

let firebaseAdmin = null;
try {
    firebaseAdmin = require('firebase-admin');
} catch (error) {
    console.warn('Firebase Admin SDK nao encontrado. Notificacoes de chamadas desativadas.');
}

let firebaseMessaging = null;
let firebaseInitError = '';

function repairServiceAccountJson(rawValue) {
    const raw = (rawValue || '').toString();
    const pattern = /"private_key"\s*:\s*"([\s\S]*?)"/m;
    const match = raw.match(pattern);
    if (!match) return raw;
    const repairedKey = match[1].replace(/\r?\n/g, '\\n');
    return raw.replace(pattern, `"private_key": "${repairedKey}"`);
}

function parseServiceAccountJson(rawValue) {
    let candidate = (rawValue || '').toString().trim();
    if (!candidate) return null;

    if (
        (candidate.startsWith('"') && candidate.endsWith('"'))
        || (candidate.startsWith("'") && candidate.endsWith("'"))
    ) {
        try {
            candidate = JSON.parse(candidate);
        } catch (_) {
            // mantem o valor original
        }
    }

    try {
        const parsed = JSON.parse(candidate);
        if (typeof parsed === 'string') {
            try {
                return JSON.parse(parsed);
            } catch (_) {
                return null;
            }
        }
        return parsed;
    } catch (_) {
        const repaired = repairServiceAccountJson(candidate);
        if (repaired !== candidate) {
            try {
                return JSON.parse(repaired);
            } catch (_) {
                return null;
            }
        }
        return null;
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

const imagesRoot = path.join(__dirname, 'images');
const profileDir = path.join(imagesRoot, 'profile');
const chatUploadsDir = path.join(imagesRoot, 'uploads');

fs.mkdirSync(profileDir, { recursive: true });
fs.mkdirSync(chatUploadsDir, { recursive: true });

function trimTrailingSlash(value) {
    return (value || '').toString().trim().replace(/\/+$/, '');
}

function slugify(value) {
    return (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()
        .slice(0, 40);
}

function safeExtFromName(filename) {
    const ext = path.extname(filename || '').toLowerCase();
    if (!ext || ext.length > 10) return '';
    return ext;
}

function safeBaseName(filename) {
    const base = path.basename(filename || '', path.extname(filename || ''));
    return slugify(base) || 'arquivo';
}

function safeUid(value) {
    return (value || '').toString().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24);
}

function buildUniqueSuffix() {
    return `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

function buildProfileFilename(req, file) {
    const safeExt = safeExtFromName(file.originalname);
    const nameSlug = slugify(req.body?.displayName) || 'usuario';
    const uid = safeUid(req.body?.uid);
    const unique = buildUniqueSuffix();
    const prefix = uid ? `${nameSlug}-${uid}` : nameSlug;
    return `${prefix}-${unique}${safeExt}`;
}

function buildChatFilename(req, file) {
    const safeExt = safeExtFromName(file.originalname);
    const baseName = safeBaseName(file.originalname);
    const uid = safeUid(req.body?.uid) || 'user';
    const unique = buildUniqueSuffix();
    return `${uid}-${baseName}-${unique}${safeExt}`;
}

function buildPublicObjectUrl(baseUrl, key) {
    const normalizedBase = trimTrailingSlash(baseUrl);
    const encodedKey = (key || '').split('/').map(encodeURIComponent).join('/');
    return `${normalizedBase}/${encodedKey}`;
}

const r2AccountId = (process.env.R2_ACCOUNT_ID || '').trim();
const r2Endpoint = trimTrailingSlash(
    process.env.R2_ENDPOINT
        || (r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : '')
);
const r2Region = (process.env.R2_REGION || 'auto').trim() || 'auto';
const r2AccessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim();
const r2SecretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim();
const r2Bucket = (process.env.R2_BUCKET || '').trim();
const r2PublicBaseUrl = trimTrailingSlash(process.env.R2_PUBLIC_BASE_URL || '');
let objectStorageEnabled = Boolean(
    S3Client
    && PutObjectCommand
    && r2Endpoint
    && r2AccessKeyId
    && r2SecretAccessKey
    && r2Bucket
    && r2PublicBaseUrl
);

let objectStorageClient = objectStorageEnabled
    ? new S3Client({
        region: r2Region,
        endpoint: r2Endpoint,
        credentials: {
            accessKeyId: r2AccessKeyId,
            secretAccessKey: r2SecretAccessKey
        },
        forcePathStyle: true
    })
    : null;

function getFirebaseMessaging() {
    if (firebaseMessaging) return firebaseMessaging;
    if (!firebaseAdmin) {
        firebaseInitError = firebaseInitError || 'Firebase Admin SDK indisponivel.';
        return null;
    }
    if (firebaseInitError) return null;

    let serviceAccount = null;
    const rawJson = (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
    const rawBase64 = (process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 || '').trim();
    const jsonPath = (process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '').trim();
    const hasSource = Boolean(rawJson || rawBase64 || jsonPath);

    try {
        if (rawBase64) {
            const decoded = Buffer.from(rawBase64, 'base64').toString('utf8');
            serviceAccount = parseServiceAccountJson(decoded);
        } else if (rawJson) {
            serviceAccount = parseServiceAccountJson(rawJson);
        } else if (jsonPath) {
            const resolvedPath = path.isAbsolute(jsonPath)
                ? jsonPath
                : path.join(__dirname, jsonPath);
            const fileContent = fs.readFileSync(resolvedPath, 'utf8');
            serviceAccount = parseServiceAccountJson(fileContent);
        }
    } catch (error) {
        firebaseInitError = 'Falha ao carregar o service account do Firebase.';
        return null;
    }

    if (!serviceAccount) {
        firebaseInitError = hasSource
            ? 'Falha ao carregar o service account do Firebase.'
            : 'Service account do Firebase nao configurado.';
        return null;
    }

    try {
        if (!firebaseAdmin.apps.length) {
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount)
            });
        }
        firebaseMessaging = firebaseAdmin.messaging();
        return firebaseMessaging;
    } catch (error) {
        firebaseInitError = 'Falha ao inicializar o Firebase Admin.';
        return null;
    }
}

async function uploadBufferToObjectStorage(file, keyPrefix, generatedName) {
    if (!objectStorageClient) {
        throw new Error('Bucket externo nao configurado.');
    }
    const key = `${keyPrefix}/${generatedName}`;
    const contentType = file?.mimetype || 'application/octet-stream';

    await objectStorageClient.send(new PutObjectCommand({
        Bucket: r2Bucket,
        Key: key,
        Body: file.buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable'
    }));

    return buildPublicObjectUrl(r2PublicBaseUrl, key);
}

async function writeBufferToLocalDisk(file, targetDir, filename, publicPrefix) {
    if (!file?.buffer) {
        throw new Error('Arquivo vazio.');
    }
    const outputPath = path.join(targetDir, filename);
    await fs.promises.writeFile(outputPath, file.buffer);
    return `${publicPrefix}/${filename}`;
}

function runMulter(middleware, req, res) {
    return new Promise((resolve, reject) => {
        middleware(req, res, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

const profileFileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens sao permitidas.'));
    }
};

const profileStorageDisk = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileDir);
    },
    filename: (req, file, cb) => {
        cb(null, buildProfileFilename(req, file));
    }
});

const chatStorageDisk = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, chatUploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, buildChatFilename(req, file));
    }
});

const uploadProfileDisk = multer({
    storage: profileStorageDisk,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: profileFileFilter
});

const uploadProfileMemory = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: profileFileFilter
});

const uploadChatDisk = multer({
    storage: chatStorageDisk,
    limits: { fileSize: 60 * 1024 * 1024 }
});

const uploadChatMemory = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 60 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/images', express.static(imagesRoot, {
    etag: true,
    maxAge: '365d',
    immutable: true
}));
app.use(express.static(__dirname));

app.post('/api/upload-profile', async (req, res, next) => {
    try {
        const useObjectStorage = objectStorageEnabled;
        const uploadMiddleware = useObjectStorage
            ? uploadProfileMemory.single('photo')
            : uploadProfileDisk.single('photo');

        await runMulter(uploadMiddleware, req, res);

        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        let url = '';
        if (useObjectStorage) {
            const filename = buildProfileFilename(req, req.file);
            try {
                url = await uploadBufferToObjectStorage(req.file, 'profile', filename);
            } catch (error) {
                console.warn('Falha no bucket externo. Salvando perfil no disco local.', error);
                objectStorageEnabled = false;
                objectStorageClient = null;
                url = await writeBufferToLocalDisk(req.file, profileDir, filename, '/images/profile');
            }
        } else {
            url = `/images/profile/${req.file.filename}`;
        }

        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        return res.json({ url });
    } catch (error) {
        return next(error);
    }
});

app.post('/api/upload-chat', async (req, res, next) => {
    try {
        const useObjectStorage = objectStorageEnabled;
        const uploadMiddleware = useObjectStorage
            ? uploadChatMemory.single('file')
            : uploadChatDisk.single('file');

        await runMulter(uploadMiddleware, req, res);

        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        let url = '';
        if (useObjectStorage) {
            const filename = buildChatFilename(req, req.file);
            try {
                url = await uploadBufferToObjectStorage(req.file, 'uploads', filename);
            } catch (error) {
                console.warn('Falha no bucket externo. Salvando anexo no disco local.', error);
                objectStorageEnabled = false;
                objectStorageClient = null;
                url = await writeBufferToLocalDisk(req.file, chatUploadsDir, filename, '/images/uploads');
            }
        } else {
            url = `/images/uploads/${req.file.filename}`;
        }

        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        return res.json({ url });
    } catch (error) {
        return next(error);
    }
});

app.post('/api/call-notify', async (req, res) => {
    try {
        const tokens = Array.isArray(req.body?.tokens)
            ? req.body.tokens.filter((token) => typeof token === 'string' && token.trim())
            : [];
        if (tokens.length === 0) {
            return res.json({ ok: true, skipped: true });
        }

        const messaging = getFirebaseMessaging();
        if (!messaging) {
            return res.status(500).json({ message: firebaseInitError || 'Firebase Admin nao configurado.' });
        }

        const isVideo = String(req.body?.callType || 'audio') === 'video';
        const callerName = String(req.body?.callerName || 'Usuario');
        const callIcon = isVideo ? '📹' : '📞';
        const notificationBody = isVideo
            ? `${callIcon} Chamada de video recebida`
            : `${callIcon} Chamada de voz recebida`;

        const baseMessage = {
            notification: {
                title: callerName,
                body: notificationBody
            },
            data: {
                type: 'call',
                callId: String(req.body?.callId || ''),
                callType: String(req.body?.callType || 'audio'),
                callerId: String(req.body?.callerId || ''),
                callerName,
                callerPhoto: String(req.body?.callerPhotoURL || '')
            },
            android: {
                priority: 'high',
                notification: {
                    channelId: 'camechat_calls',
                    visibility: 'PUBLIC',
                    sound: 'default',
                    defaultVibrateTimings: true,
                    icon: 'ic_launcher'
                }
            }
        };

        try {
            const response = await messaging.sendMulticast({
                ...baseMessage,
                tokens
            });
            return res.json({
                ok: true,
                successCount: response.successCount,
                failureCount: response.failureCount
            });
        } catch (error) {
            const message = String(error?.message || '');
            if (message.includes('/batch')) {
                const results = await Promise.allSettled(
                    tokens.map((token) => messaging.send({ ...baseMessage, token }))
                );
                const successCount = results.filter((result) => result.status === 'fulfilled').length;
                const failureCount = tokens.length - successCount;
                return res.json({ ok: true, successCount, failureCount, fallback: true });
            }
            throw error;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Falha ao notificar chamada.' });
    }
});

app.post('/api/message-notify', async (req, res) => {
    try {
        const tokens = Array.isArray(req.body?.tokens)
            ? req.body.tokens.filter((token) => typeof token === 'string' && token.trim())
            : [];
        if (tokens.length === 0) {
            return res.json({ ok: true, skipped: true });
        }

        const messaging = getFirebaseMessaging();
        if (!messaging) {
            return res.status(500).json({ message: firebaseInitError || 'Firebase Admin nao configurado.' });
        }

        const senderName = String(req.body?.senderName || 'Usuario');
        const messageType = String(req.body?.messageType || 'text');
        const messageText = String(req.body?.messageText || '');
        const fileName = String(req.body?.fileName || '');
        const typeIcon = messageType === 'audio'
            ? '🎤'
            : messageType === 'video'
                ? '📹'
                : messageType === 'text'
                    ? '💬'
                    : messageType === 'image'
                        ? '🖼️'
                        : '📎';
        const notificationBody = String(req.body?.notificationBody || messageText || fileName || 'Nova mensagem');
        const notificationBodyWithIcon = `${typeIcon} ${notificationBody}`;

        const baseMessage = {
            notification: {
                title: senderName,
                body: notificationBodyWithIcon
            },
            data: {
                type: 'message',
                messageType,
                messageText,
                fileName,
                senderId: String(req.body?.senderId || ''),
                senderName,
                senderPhoto: String(req.body?.senderPhotoURL || ''),
                conversationId: String(req.body?.conversationId || ''),
                count: String(req.body?.count || '')
            },
            android: {
                priority: 'high',
                notification: {
                    channelId: 'camechat_messages',
                    visibility: 'PRIVATE',
                    sound: 'default',
                    defaultVibrateTimings: true,
                    icon: 'ic_launcher'
                }
            }
        };

        try {
            const response = await messaging.sendMulticast({
                ...baseMessage,
                tokens
            });
            return res.json({
                ok: true,
                successCount: response.successCount,
                failureCount: response.failureCount
            });
        } catch (error) {
            const message = String(error?.message || '');
            if (message.includes('/batch')) {
                const results = await Promise.allSettled(
                    tokens.map((token) => messaging.send({ ...baseMessage, token }))
                );
                const successCount = results.filter((result) => result.status === 'fulfilled').length;
                const failureCount = tokens.length - successCount;
                return res.json({ ok: true, successCount, failureCount, fallback: true });
            }
            throw error;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Falha ao notificar mensagem.' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        storageMode: objectStorageEnabled ? 'object-storage' : 'local-disk'
    });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err) {
        return res.status(400).json({ message: err.message || 'Erro no upload.' });
    }
    return next();
});

app.listen(PORT, () => {
    const mode = canUseObjectStorage ? 'bucket externo' : 'disco local';
    console.log(`Servidor rodando em http://localhost:${PORT} (${mode})`);
});
