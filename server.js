const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const imagesRoot = path.join(__dirname, 'images');
const profileDir = path.join(imagesRoot, 'profile');

fs.mkdirSync(profileDir, { recursive: true });

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safeExt = ext && ext.length <= 10 ? ext : '';
        const nameSlug = slugify(req.body?.displayName) || 'usuario';
        const uid = (req.body?.uid || '').toString().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12);
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

app.use(cors());
app.use('/images', express.static(imagesRoot));
app.use(express.static(__dirname));

app.post('/api/upload-profile', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    const url = `/images/profile/${req.file.filename}`;
    return res.json({ url });
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
