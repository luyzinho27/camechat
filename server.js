const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const imagesRoot = path.join(__dirname, 'images');
const profileDir = path.join(imagesRoot, 'profile');
const chatUploadsDir = path.join(imagesRoot, 'uploads');

fs.mkdirSync(profileDir, { recursive: true });
fs.mkdirSync(chatUploadsDir, { recursive: true });

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
    return (value || '').toString().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileDir);
    },
    filename: (req, file, cb) => {
        const safeExt = safeExtFromName(file.originalname);
        const nameSlug = slugify(req.body?.displayName) || 'usuario';
        const uid = safeUid(req.body?.uid);
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const prefix = uid ? `${nameSlug}-${uid}` : nameSlug;
        cb(null, `${prefix}-${unique}${safeExt}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas.'));
        }
    }
});

const chatStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, chatUploadsDir);
    },
    filename: (req, file, cb) => {
        const safeExt = safeExtFromName(file.originalname);
        const baseName = safeBaseName(file.originalname);
        const uid = safeUid(req.body?.uid) || 'user';
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${uid}-${baseName}-${unique}${safeExt}`);
    }
});

const chatUpload = multer({
    storage: chatStorage,
    limits: { fileSize: 20 * 1024 * 1024 }
});

app.use(cors());
app.use('/images', express.static(imagesRoot, {
    etag: true,
    maxAge: '365d',
    immutable: true
}));
app.use(express.static(__dirname));

app.post('/api/upload-profile', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    const url = `/images/profile/${req.file.filename}`;
    return res.json({ url });
});

app.post('/api/upload-chat', chatUpload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    const url = `/images/uploads/${req.file.filename}`;
    return res.json({ url });
});

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
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
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
