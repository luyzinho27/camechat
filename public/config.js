/**
 * Configuração segura do Firebase e Backend
 * As chaves sensíveis vêm de variáveis de ambiente
 */

// Configuração do Firebase - lida de variáveis de ambiente
window.firebaseConfig = window.firebaseConfig || {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'camechat-4fb88.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'camechat-4fb88',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'camechat-4fb88.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '405074774387',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:405074774387:web:17d2c4e7fd1e35e0c1dd06'
};

// URL do backend
window.CAMECHAT_BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'https://vkbqoqmyxesprbnzwcff.supabase.co/functions/v1/camechat-api';

// Validação
if (!window.firebaseConfig.apiKey) {
    console.warn('⚠️ Chave de API do Firebase não configurada! Verifique seu arquivo .env');
}
