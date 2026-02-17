// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
    apiKey: "AIzaSyDGclwLGfGVlpKNjUhenZ5nN1vK_mrdjls",
    authDomain: "camechat-4fb88.firebaseapp.com",
    projectId: "camechat-4fb88",
    storageBucket: "camechat-4fb88.firebasestorage.app",
    messagingSenderId: "405074774387",
    appId: "1:405074774387:web:17d2c4e7fd1e35e0c1dd06"
};

const BACKEND_BASE_URL = (window.CAMECHAT_BACKEND_URL || '').replace(/\/$/, '');
const RTC_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ]
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ========== ELEMENTOS DOM ==========
// Auth
const authContainer = document.getElementById('auth-container');
const app = document.getElementById('app');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerPhotoInput = document.getElementById('register-photo');
const registerPhotoPreview = document.getElementById('register-photo-preview');
const registerRole = document.getElementById('register-role');
const registerRoleAdminOption = document.getElementById('register-role-admin');
const btnGoogleLogin = document.getElementById('btn-google-login');
const btnGoogleRegister = document.getElementById('btn-google-register');
const forgotPasswordLink = document.getElementById('forgot-password');
const forgotModal = document.getElementById('forgot-modal');
const closeModal = document.getElementById('forgot-close-modal');
const btnResetPassword = document.getElementById('btn-reset-password');
const resetEmail = document.getElementById('reset-email');
const rememberMe = document.getElementById('remember-me');

// App
const userPhoto = document.getElementById('user-photo');
const userName = document.getElementById('user-name');
const userStatus = document.getElementById('user-status');
const userRoleBadge = document.getElementById('user-role-badge');
const usersList = document.getElementById('users-list');
const totalUsers = document.getElementById('total-users');
const chatPartnerName = document.getElementById('chat-partner-name');
const chatPartnerPhoto = document.getElementById('chat-partner-photo');
const chatPartnerStatus = document.getElementById('chat-partner-status');
const defaultChatPartnerPhoto = chatPartnerPhoto?.dataset?.defaultSrc || chatPartnerPhoto?.src || '';
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const btnSend = document.getElementById('btn-send');
const btnAttach = document.getElementById('btn-attach');
const fileUpload = document.getElementById('file-upload');
const btnEmoji = document.getElementById('btn-emoji');
const emojiPicker = document.getElementById('emoji-picker');
const searchUser = document.getElementById('search-user');
const friendEmailInput = document.getElementById('friend-email');
const btnAddFriend = document.getElementById('btn-add-friend');
const btnAdminPanel = document.getElementById('btn-admin-panel');
const btnLogout = document.getElementById('btn-logout');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// Admin panel
const chatPanel = document.getElementById('chat-panel');
const adminPanel = document.getElementById('admin-panel');
const metricTotalUsers = document.getElementById('metric-total-users');
const metricTotalAdmins = document.getElementById('metric-total-admins');
const metricOnlineUsers = document.getElementById('metric-online-users');
const adminUsersList = document.getElementById('admin-users-list');
const adminCreateForm = document.getElementById('admin-create-form');
const adminCreateName = document.getElementById('admin-create-name');
const adminCreateEmail = document.getElementById('admin-create-email');
const adminCreatePassword = document.getElementById('admin-create-password');
const adminCreateRole = document.getElementById('admin-create-role');
const adminEditModal = document.getElementById('admin-edit-modal');
const adminEditClose = document.getElementById('admin-edit-close');
const adminEditName = document.getElementById('admin-edit-name');
const adminEditEmail = document.getElementById('admin-edit-email');
const adminEditRole = document.getElementById('admin-edit-role');
const adminEditSave = document.getElementById('admin-edit-save');
const adminTabs = document.getElementById('admin-tabs');

// Profile modal
const profileModal = document.getElementById('profile-modal');
const profileCloseModal = document.getElementById('profile-close-modal');
const profileCropFrame = document.getElementById('profile-crop-frame');
const profileCropImage = document.getElementById('profile-crop-image');
const profileZoom = document.getElementById('profile-zoom');
const profileCenterBtn = document.getElementById('profile-center-btn');
const profilePhotoInput = document.getElementById('profile-photo-input');
const profileSaveBtn = document.getElementById('profile-save-btn');
const profileCancelBtn = document.getElementById('profile-cancel-btn');

// Friend modal
const friendModal = document.getElementById('friend-modal');
const friendCloseModal = document.getElementById('friend-close-modal');
const friendPreviewImage = document.getElementById('friend-preview-image');
const friendDetailName = document.getElementById('friend-detail-name');
const friendDetailEmail = document.getElementById('friend-detail-email');
const friendDetailStatus = document.getElementById('friend-detail-status');
const friendBlockedBadge = document.getElementById('friend-blocked-badge');
const friendRemoveBtn = document.getElementById('friend-remove-btn');
const friendBlockBtn = document.getElementById('friend-block-btn');
const friendUnblockBtn = document.getElementById('friend-unblock-btn');

// Call modal
const btnCall = document.getElementById('btn-call');
const btnVideoCall = document.getElementById('btn-video-call');
const callIndicator = document.getElementById('call-indicator');
const callModal = document.getElementById('call-modal');
const callTitle = document.getElementById('call-title');
const callStatus = document.getElementById('call-status');
const callUserPhoto = document.getElementById('call-user-photo');
const callUserName = document.getElementById('call-user-name');
const callMedia = document.getElementById('call-media');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const callAcceptBtn = document.getElementById('call-accept-btn');
const callRejectBtn = document.getElementById('call-reject-btn');
const callHangupBtn = document.getElementById('call-hangup-btn');
const localAudio = document.getElementById('local-audio');
const remoteAudio = document.getElementById('remote-audio');

// ========== VARIÁVEIS DE ESTADO ==========
let currentUser = null;
let currentUserProfile = null;
let currentUserRole = 'user_chat';
let currentFriends = [];
let allUsersCache = [];
let selectedUserId = null;
let messagesUnsubscribe = null;
let usersUnsubscribe = null;
let adminUsersUnsubscribe = null;
let onlineStatusInterval = null;
let currentUserDocUnsubscribe = null;
let editingUserId = null;
let registerPhotoPreviewUrl = null;
let profilePhotoPreviewUrl = null;
let pendingProfilePhotoFile = null;
let cropBaseScale = 1;
let cropScale = 1;
let cropOffsetX = 0;
let cropOffsetY = 0;
let cropDragging = false;
let cropStartX = 0;
let cropStartY = 0;
let cropStartOffsetX = 0;
let cropStartOffsetY = 0;
let profileCropReady = false;
let selectedFriendData = null;
let callDocRef = null;
let callDocUnsubscribe = null;
let incomingCallUnsubscribe = null;
let callerCandidatesUnsubscribe = null;
let calleeCandidatesUnsubscribe = null;
let peerConnection = null;
let localStream = null;
let remoteStream = null;
let currentCallId = null;
let currentCallRole = null;
let activeCallData = null;
let callTimeout = null;
let callPhase = null;
let currentCallType = null;
let ringtoneInterval = null;
let ringtoneContext = null;

// ========== FUNÇÕES DE AUTENTICAÇÃO ==========

// Alternar abas
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    updateRegisterRoleAvailability();
});

if (registerPhotoInput) {
    registerPhotoInput.addEventListener('change', () => {
        const file = registerPhotoInput.files[0];

        if (registerPhotoPreviewUrl) {
            URL.revokeObjectURL(registerPhotoPreviewUrl);
            registerPhotoPreviewUrl = null;
        }

        if (!file) {
            if (registerPhotoPreview) {
                registerPhotoPreview.src = '';
                registerPhotoPreview.style.display = 'none';
            }
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Selecione apenas imagens.');
            registerPhotoInput.value = '';
            if (registerPhotoPreview) {
                registerPhotoPreview.src = '';
                registerPhotoPreview.style.display = 'none';
            }
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('A foto deve ter no máximo 5MB.');
            registerPhotoInput.value = '';
            if (registerPhotoPreview) {
                registerPhotoPreview.src = '';
                registerPhotoPreview.style.display = 'none';
            }
            return;
        }

        registerPhotoPreviewUrl = URL.createObjectURL(file);
        if (registerPhotoPreview) {
            registerPhotoPreview.src = registerPhotoPreviewUrl;
            registerPhotoPreview.style.display = 'block';
        }
    });
}

async function checkAdminExists() {
    try {
        const snapshot = await db.collection('users')
            .where('role', '==', 'administrador')
            .limit(1)
            .get();
        return !snapshot.empty;
    } catch (error) {
        console.warn('Erro ao verificar administrador:', error);
        return null;
    }
}

async function resolveRoleForSignup(requestedRole) {
    const normalizedRole = requestedRole === 'administrador' ? 'administrador' : 'user_chat';
    const adminExists = await checkAdminExists();
    if (adminExists === false) {
        return 'administrador';
    }
    if (adminExists === true && normalizedRole === 'administrador') {
        return 'user_chat';
    }
    if (adminExists === null && normalizedRole === 'administrador') {
        return 'user_chat';
    }
    return normalizedRole;
}

async function updateRegisterRoleAvailability() {
    if (!registerRoleAdminOption) return;
    const adminExists = await checkAdminExists();
    const disableAdmin = adminExists !== false;
    registerRoleAdminOption.disabled = disableAdmin;
    registerRoleAdminOption.textContent = disableAdmin ? 'Administrador (indisponível)' : 'Administrador';
    if (disableAdmin && registerRole && registerRole.value === 'administrador') {
        registerRole.value = 'user_chat';
    }
}

async function ensureUserDocument(user, options = {}) {
    const userRef = db.collection('users').doc(user.uid);
    const snapshot = await userRef.get();
    const emailValue = options.email || user.email || '';
    const emailLower = emailValue ? emailValue.toLowerCase() : '';
    const baseData = {
        uid: user.uid,
        name: options.name || user.displayName || '',
        email: emailValue,
        emailLower: emailLower,
        photoURL: options.photoURL ?? user.photoURL ?? null,
        photoData: options.photoData ?? null,
        role: options.role || 'user_chat',
        friends: Array.isArray(options.friends) ? options.friends : [],
        blocked: Array.isArray(options.blocked) ? options.blocked : [],
        online: true,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: options.createdBy || null
    };

    if (!snapshot.exists) {
        await userRef.set(baseData);
        return baseData;
    }

    const data = snapshot.data() || {};
    const updates = {};

    const shouldUpdateName = options.name && data.name !== options.name;
    const shouldUpdateEmail = options.email && data.email !== options.email;
    const shouldUpdateEmailLower = emailLower && data.emailLower !== emailLower;
    const shouldUpdatePhoto = Object.prototype.hasOwnProperty.call(options, 'photoURL')
        && data.photoURL !== options.photoURL;
    const shouldUpdatePhotoData = Object.prototype.hasOwnProperty.call(options, 'photoData')
        && data.photoData !== options.photoData;

    if (!data.role && options.role) updates.role = options.role;
    if (shouldUpdateName) updates.name = options.name;
    if (shouldUpdateEmail) updates.email = options.email;
    if (shouldUpdateEmailLower) updates.emailLower = emailLower;
    if (shouldUpdatePhoto) updates.photoURL = options.photoURL ?? null;
    if (shouldUpdatePhotoData) updates.photoData = options.photoData ?? null;
    if (!Array.isArray(data.friends)) updates.friends = [];
    if (!Array.isArray(data.blocked)) updates.blocked = [];

    if (Object.keys(updates).length > 0) {
        updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        await userRef.update(updates);
        return { ...data, ...updates };
    }

    return data;
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });
}

async function createProfileImageDataUrl(file) {
    const originalDataUrl = await readFileAsDataUrl(file);
    const img = await loadImageFromDataUrl(originalDataUrl);

    const maxSize = 256;
    let { width, height } = img;
    if (width > height) {
        if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
        }
    } else {
        if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
        }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', 0.8);
}

async function uploadProfilePhotoViaBackend(file, options = {}) {
    const formData = new FormData();
    formData.append('photo', file);
    if (options.displayName) formData.append('displayName', options.displayName);
    if (options.uid) formData.append('uid', options.uid);

    const apiUrl = BACKEND_BASE_URL ? `${BACKEND_BASE_URL}/api/upload-profile` : '/api/upload-profile';
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        let errorMessage = 'Erro ao enviar foto.';
        try {
            const data = await response.json();
            if (data?.message) errorMessage = data.message;
        } catch (error) {
            // ignore
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data?.url) {
        throw new Error('Resposta inválida do servidor.');
    }
    if (BACKEND_BASE_URL && data.url.startsWith('/')) {
        return `${BACKEND_BASE_URL}${data.url}`;
    }
    return data.url;
}

// Login com email/senha
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const persistence = rememberMe.checked 
            ? firebase.auth.Auth.Persistence.LOCAL 
            : firebase.auth.Auth.Persistence.SESSION;
        
        await auth.setPersistence(persistence);
        await auth.signInWithEmailAndPassword(email, password);
        loginForm.reset();
    } catch (error) {
        handleAuthError(error);
    }
});

// Cadastro com email/senha
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const requestedRole = registerRole ? registerRole.value : 'user_chat';
    const photoFile = registerPhotoInput ? registerPhotoInput.files[0] : null;

    if (!photoFile) {
        alert('Selecione uma foto de perfil.');
        return;
    }

    if (!photoFile.type.startsWith('image/')) {
        alert('Selecione apenas imagens.');
        return;
    }

    if (photoFile.size > 5 * 1024 * 1024) {
        alert('A foto deve ter no máximo 5MB.');
        return;
    }
    
    if (password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('As senhas não conferem.');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        await userCredential.user.updateProfile({
            displayName: name
        });

        const resolvedRole = await resolveRoleForSignup(requestedRole);

        let photoUrl = '';
        let photoData = '';

        try {
            photoUrl = await uploadProfilePhotoViaBackend(photoFile, {
                displayName: name,
                uid: userCredential.user.uid
            });
        } catch (uploadError) {
            console.warn('Falha no upload via backend, usando fallback base64.', uploadError);
        }

        try {
            photoData = await createProfileImageDataUrl(photoFile);
        } catch (error) {
            console.error('Erro ao processar a foto:', error);
            alert('Não foi possível processar a foto. Tente outra imagem.');
            return;
        }

        await ensureUserDocument(userCredential.user, {
            name: name,
            email: email,
            role: resolvedRole,
            photoURL: photoUrl || null,
            photoData: photoData || null
        });
        
        registerForm.reset();
        resetRegisterForm();
        await updateRegisterRoleAvailability();
        alert('Cadastro realizado com sucesso!');
    } catch (error) {
        handleAuthError(error);
    }
});

// Login com Google
async function handleGoogleLogin(requestedRole) {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const result = await auth.signInWithPopup(provider);
        
        const resolvedRole = await resolveRoleForSignup(requestedRole);
        await ensureUserDocument(result.user, {
            name: result.user.displayName || result.user.email?.split('@')[0] || 'Usuário',
            email: result.user.email,
            role: resolvedRole,
            photoURL: result.user.photoURL || null
        });
    } catch (error) {
        if (error.code === 'auth/popup-blocked') {
            await auth.signInWithRedirect(provider);
            return;
        }
        handleAuthError(error);
    }
}

btnGoogleLogin.addEventListener('click', () => handleGoogleLogin());
btnGoogleRegister.addEventListener('click', () => handleGoogleLogin(registerRole ? registerRole.value : 'user_chat'));

// Recuperação de senha
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotModal.classList.add('show');
});

closeModal.addEventListener('click', () => {
    forgotModal.classList.remove('show');
    resetEmail.value = '';
});

window.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
        forgotModal.classList.remove('show');
        resetEmail.value = '';
    }
    if (profileModal && e.target === profileModal) {
        closeProfileModal();
    }
    if (friendModal && e.target === friendModal) {
        closeFriendModal();
    }
    if (adminEditModal && e.target === adminEditModal) {
        closeAdminEditModal();
    }
    if (emojiPicker && !emojiPicker.classList.contains('hidden')) {
        if (!emojiPicker.contains(e.target) && e.target !== btnEmoji) {
            emojiPicker.classList.add('hidden');
        }
    }
});

btnResetPassword.addEventListener('click', async () => {
    const email = resetEmail.value.trim();
    
    if (!email) {
        alert('Digite seu e-mail.');
        return;
    }
    
    try {
        await auth.sendPasswordResetEmail(email);
        alert('E-mail de recuperação enviado!');
        forgotModal.classList.remove('show');
        resetEmail.value = '';
    } catch (error) {
        handleAuthError(error);
    }
});

// Tratamento de erros de autenticação
function handleAuthError(error) {
    let message = 'Erro de autenticação. ';
    switch (error.code) {
        case 'auth/user-not-found':
            message += 'Usuário não encontrado.';
            break;
        case 'auth/wrong-password':
            message += 'Senha incorreta.';
            break;
        case 'auth/email-already-in-use':
            message += 'Este e-mail já está em uso.';
            break;
        case 'auth/invalid-email':
            message += 'E-mail inválido.';
            break;
        case 'auth/weak-password':
            message += 'Senha muito fraca.';
            break;
        case 'auth/unauthorized-domain':
            message += 'Domínio não autorizado. Adicione este domínio em Authentication > Settings > Authorized domains.';
            break;
        case 'auth/popup-blocked':
            message += 'Pop-up bloqueado pelo navegador. Libere o pop-up e tente novamente.';
            break;
        case 'auth/popup-closed-by-user':
            message += 'Pop-up fechado antes de concluir o login.';
            break;
        case 'auth/cancelled-popup-request':
            message += 'Outra solicitação de login já está em andamento.';
            break;
        case 'auth/operation-not-allowed':
            message += 'Operação não permitida. Verifique se o provedor está habilitado no Firebase.';
            break;
        default:
            message += error.message;
    }
    alert(message);
}

// ========== ESTADO DE AUTENTICAÇÃO ==========
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        authContainer.classList.add('hidden');
        app.classList.remove('hidden');

        const fallbackRole = await resolveRoleForSignup('user_chat');
        currentUserProfile = await ensureUserDocument(user, {
            name: user.displayName || '',
            email: user.email || '',
            role: fallbackRole,
            photoURL: user.photoURL || null
        });
        currentUserRole = currentUserProfile.role || fallbackRole || 'user_chat';

        // Atualizar interface do usuário
        const fallbackPhoto = currentUserProfile.photoData || 'https://via.placeholder.com/45/002776/ffffff?text=User';
        userPhoto.src = fallbackPhoto;
        if (currentUserProfile.photoURL) {
            hydratePhotoFromUrl(userPhoto, currentUserProfile.photoURL, fallbackPhoto);
        } else if (user.photoURL) {
            hydratePhotoFromUrl(userPhoto, user.photoURL, fallbackPhoto);
        }
        userName.textContent = currentUserProfile.name || user.displayName || 'Usuário';
        userStatus.textContent = 'Online';
        updateRoleBadge(currentUserRole);
        updateRegisterRoleAvailability();
        setAdminAccess(currentUserRole === 'administrador');

        subscribeToCurrentUserDoc();
        
        // Atualizar status online no Firestore
        await updateUserOnlineStatus(true);
        
        // Configurar heartbeat para manter status online
        setupOnlineStatus();
        
        // Carregar usuários e conversas
        loadUsers();

        listenForIncomingCalls();
        
        // Atualizar lastSeen ao fechar a página
        window.addEventListener('beforeunload', () => {
            updateUserOnlineStatus(false);
        });
    } else {
        // Usuário deslogado
        currentUser = null;
        currentUserProfile = null;
        currentUserRole = 'user_chat';
        authContainer.classList.remove('hidden');
        app.classList.add('hidden');
        updateRoleBadge('user_chat');
        setAdminAccess(false);
        updateRegisterRoleAvailability();
        resetRegisterForm();
        if (defaultChatPartnerPhoto) {
            chatPartnerPhoto.src = defaultChatPartnerPhoto;
        }
        chatPartnerName.textContent = 'Selecione um usuário';
        chatPartnerStatus.textContent = '';
        selectedFriendData = null;
        
        // Cleanup
        if (messagesUnsubscribe) messagesUnsubscribe();
        if (usersUnsubscribe) usersUnsubscribe();
        if (adminUsersUnsubscribe) adminUsersUnsubscribe();
        if (currentUserDocUnsubscribe) currentUserDocUnsubscribe();
        if (incomingCallUnsubscribe) incomingCallUnsubscribe();
        messagesUnsubscribe = null;
        usersUnsubscribe = null;
        adminUsersUnsubscribe = null;
        currentUserDocUnsubscribe = null;
        incomingCallUnsubscribe = null;
        if (onlineStatusInterval) clearInterval(onlineStatusInterval);

        selectedUserId = null;
        if (btnEmoji) btnEmoji.disabled = true;
        if (btnAttach) btnAttach.disabled = true;
        if (btnSend) btnSend.disabled = true;
        if (messageInput) messageInput.disabled = true;
        if (btnCall) btnCall.disabled = true;
        if (btnVideoCall) btnVideoCall.disabled = true;
        setSidebarOpen(false);
        resetCallState();
    }
});

// Atualizar status online do usuário
async function updateUserOnlineStatus(online) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).set({
            uid: currentUser.uid,
            online: online,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
    }
}

// Configurar heartbeat para manter status online
function setupOnlineStatus() {
    // Atualizar a cada 30 segundos
    onlineStatusInterval = setInterval(() => {
        updateUserOnlineStatus(true);
    }, 30000);
}

function subscribeToCurrentUserDoc() {
    if (!currentUser) return;
    if (currentUserDocUnsubscribe) currentUserDocUnsubscribe();

    currentUserDocUnsubscribe = db.collection('users')
        .doc(currentUser.uid)
        .onSnapshot((doc) => {
            if (!doc.exists) return;
            const data = doc.data() || {};
            if (data.disabled) {
                alert('Sua conta foi desativada por um administrador.');
                auth.signOut();
                return;
            }
            currentUserProfile = { ...(currentUserProfile || {}), ...data };
            currentUserRole = data.role || currentUserRole || 'user_chat';
            currentFriends = Array.isArray(data.friends) ? data.friends : [];
            if (!Array.isArray(currentUserProfile.blocked)) {
                currentUserProfile.blocked = [];
            }

            if (data.name) userName.textContent = data.name;
            if (data.photoURL) {
                userPhoto.src = data.photoURL;
            } else if (data.photoData) {
                userPhoto.src = data.photoData;
            }

            updateRoleBadge(currentUserRole);
            setAdminAccess(currentUserRole === 'administrador');

            if (currentUserRole === 'administrador') {
                if (!adminUsersUnsubscribe) {
                    loadAdminUsers();
                }
            } else if (adminUsersUnsubscribe) {
                adminUsersUnsubscribe();
                adminUsersUnsubscribe = null;
            }

            renderFriendUsers();
        });
}

function hydratePhotoFromUrl(imgEl, url, fallback) {
    if (!imgEl || !url) return;
    const image = new Image();
    image.onload = () => {
        imgEl.src = url;
    };
    image.onerror = () => {
        if (fallback) imgEl.src = fallback;
    };
    image.src = url;
}

function updateCropTransform() {
    if (!profileCropImage || !profileCropFrame || !profileCropReady) return;
    const frameSize = profileCropFrame.clientWidth;
    const displayWidth = profileCropImage.naturalWidth * cropScale;
    const displayHeight = profileCropImage.naturalHeight * cropScale;
    const maxOffsetX = Math.max(0, (displayWidth - frameSize) / 2);
    const maxOffsetY = Math.max(0, (displayHeight - frameSize) / 2);

    cropOffsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, cropOffsetX));
    cropOffsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, cropOffsetY));

    profileCropImage.style.transform = `translate(-50%, -50%) translate(${cropOffsetX}px, ${cropOffsetY}px) scale(${cropScale})`;
}

function resetCropPosition() {
    cropOffsetX = 0;
    cropOffsetY = 0;
    updateCropTransform();
}

function initCropper() {
    if (!profileCropImage || !profileCropFrame) return;
    const frameSize = profileCropFrame.clientWidth;
    cropBaseScale = Math.max(frameSize / profileCropImage.naturalWidth, frameSize / profileCropImage.naturalHeight);
    const sliderValue = profileZoom ? parseFloat(profileZoom.value) || 1 : 1;
    cropScale = cropBaseScale * sliderValue;
    resetCropPosition();
}

function loadCropImage(src) {
    if (!profileCropImage) return;
    profileCropImage.crossOrigin = 'anonymous';
    profileCropImage.onload = () => {
        profileCropReady = true;
        if (profileZoom) profileZoom.value = '1';
        initCropper();
    };
    profileCropImage.onerror = () => {
        profileCropReady = false;
    };
    profileCropImage.src = src;
}

function createCroppedCanvas(size = 256) {
    if (!profileCropImage || !profileCropFrame || !profileCropReady) return null;

    const frameSize = profileCropFrame.clientWidth;
    const displayWidth = profileCropImage.naturalWidth * cropScale;
    const displayHeight = profileCropImage.naturalHeight * cropScale;
    const imgLeft = frameSize / 2 + cropOffsetX - displayWidth / 2;
    const imgTop = frameSize / 2 + cropOffsetY - displayHeight / 2;
    const sourceSize = frameSize / cropScale;

    let sx = (0 - imgLeft) / cropScale;
    let sy = (0 - imgTop) / cropScale;

    sx = Math.max(0, Math.min(profileCropImage.naturalWidth - sourceSize, sx));
    sy = Math.max(0, Math.min(profileCropImage.naturalHeight - sourceSize, sy));

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(profileCropImage, sx, sy, sourceSize, sourceSize, 0, 0, size, size);
    return canvas;
}

function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.85) {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), type, quality);
    });
}

function getCallTypeLabel(type) {
    return type === 'video' ? 'vÃ­deo' : 'voz';
}

function updateCallIndicator(phase, type) {
    if (!callIndicator) return;
    if (!phase) {
        callIndicator.textContent = '';
        callIndicator.classList.add('hidden');
        return;
    }
    const labelType = getCallTypeLabel(type);
    let text = 'Em chamada';
    if (phase === 'incoming') text = `Chamada de ${labelType} recebida`;
    if (phase === 'outgoing') text = `Chamando (${labelType})`;
    if (phase === 'active') text = `Em chamada (${labelType})`;
    callIndicator.textContent = text;
    callIndicator.classList.remove('hidden');
}

function updateCallMediaVisibility(type) {
    const isVideo = type === 'video';
    if (callMedia) callMedia.classList.toggle('hidden', !isVideo);
    if (callUserPhoto) callUserPhoto.classList.toggle('hidden', isVideo);
}

function stopRingtone() {
    if (ringtoneInterval) clearInterval(ringtoneInterval);
    ringtoneInterval = null;
    if (ringtoneContext) {
        ringtoneContext.close();
        ringtoneContext = null;
    }
}

function startRingtone(mode = 'incoming') {
    stopRingtone();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
        ringtoneContext = new AudioContext();
        if (ringtoneContext.state === 'suspended') {
            ringtoneContext.resume();
        }
        const interval = mode === 'incoming' ? 1800 : 2200;
        const beep = () => {
            if (!ringtoneContext) return;
            const osc = ringtoneContext.createOscillator();
            const gain = ringtoneContext.createGain();
            osc.type = 'sine';
            osc.frequency.value = mode === 'incoming' ? 440 : 520;
            gain.gain.value = 0.18;
            osc.connect(gain);
            gain.connect(ringtoneContext.destination);
            osc.start();
            osc.stop(ringtoneContext.currentTime + 0.3);
        };
        beep();
        ringtoneInterval = setInterval(beep, interval);
    } catch (error) {
        console.warn('NÃ£o foi possÃ­vel tocar o toque da chamada.', error);
    }
}

function resetCallState() {
    if (callDocUnsubscribe) callDocUnsubscribe();
    if (callerCandidatesUnsubscribe) callerCandidatesUnsubscribe();
    if (calleeCandidatesUnsubscribe) calleeCandidatesUnsubscribe();
    callDocUnsubscribe = null;
    callerCandidatesUnsubscribe = null;
    calleeCandidatesUnsubscribe = null;

    if (peerConnection) {
        peerConnection.ontrack = null;
        peerConnection.onicecandidate = null;
        peerConnection.onconnectionstatechange = null;
        peerConnection.close();
    }
    peerConnection = null;

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    localStream = null;

    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
    }
    remoteStream = null;

    if (localAudio) localAudio.srcObject = null;
    if (remoteAudio) remoteAudio.srcObject = null;
    if (localVideo) localVideo.srcObject = null;
    if (remoteVideo) remoteVideo.srcObject = null;

    callDocRef = null;
    currentCallId = null;
    currentCallRole = null;
    activeCallData = null;
    callPhase = null;
    currentCallType = null;

    if (callTimeout) clearTimeout(callTimeout);
    callTimeout = null;

    if (callModal) callModal.classList.remove('show');

    if (btnCall) {
        btnCall.disabled = !selectedFriendData || isFriendBlocked(selectedFriendData.uid);
    }
    if (btnVideoCall) {
        btnVideoCall.disabled = !selectedFriendData || isFriendBlocked(selectedFriendData.uid);
    }

    if (callMedia) callMedia.classList.add('hidden');
    if (callUserPhoto) callUserPhoto.classList.remove('hidden');
    updateCallIndicator(null);
    stopRingtone();
}

function updateCallModal({ title, status, user }) {
    if (callTitle) callTitle.textContent = title || 'Chamada de voz';
    if (callStatus) callStatus.textContent = status || '';
    if (callUserName) callUserName.textContent = user?.name || 'Usuário';
    if (callUserPhoto) {
        const fallback = user?.photoData || 'https://via.placeholder.com/90/cccccc/666666?text=User';
        callUserPhoto.src = fallback;
        if (user?.photoURL) hydratePhotoFromUrl(callUserPhoto, user.photoURL, fallback);
    }
    if (callModal) callModal.classList.add('show');
}

function setCallButtonsVisibility(mode) {
    if (!callAcceptBtn || !callRejectBtn || !callHangupBtn) return;
    callAcceptBtn.classList.toggle('hidden', mode !== 'incoming');
    callRejectBtn.classList.toggle('hidden', mode !== 'incoming');
    callHangupBtn.classList.toggle('hidden', mode === 'incoming');
}

async function preparePeerConnection(options = {}) {
    const wantsVideo = options.video === true;
    peerConnection = new RTCPeerConnection(RTC_CONFIG);
    remoteStream = new MediaStream();
    if (remoteAudio) remoteAudio.srcObject = remoteStream;
    if (remoteVideo) remoteVideo.srcObject = remoteStream;

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
    };

    peerConnection.onconnectionstatechange = () => {
        if (!peerConnection) return;
        const state = peerConnection.connectionState;
        if (state === 'failed' || state === 'disconnected' || state === 'closed') {
            endCall('ended');
        }
    };

    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: wantsVideo });
    if (localAudio) localAudio.srcObject = localStream;
    if (localVideo) localVideo.srcObject = localStream;
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    updateCallMediaVisibility(wantsVideo ? 'video' : 'audio');
}

async function startCall(callType = 'audio') {
    if (!selectedFriendData || !currentUser) return;
    if (isFriendBlocked(selectedFriendData.uid)) {
        alert('Voc?? bloqueou este usu??rio.');
        return;
    }
    if (currentCallId) {
        alert('J?? existe uma chamada em andamento.');
        return;
    }

    try {
        currentCallType = callType;
        await preparePeerConnection({ video: callType === 'video' });
    } catch (error) {
        if (callType === 'video') {
            const fallback = confirm('N??o foi poss??vel acessar a c??mera. Deseja iniciar uma chamada de voz?');
            if (!fallback) {
                return;
            }
            callType = 'audio';
            currentCallType = 'audio';
            try {
                await preparePeerConnection({ video: false });
            } catch (audioError) {
                alert('N??o foi poss??vel acessar o microfone.');
                return;
            }
        } else {
            alert('N??o foi poss??vel acessar o microfone.');
            return;
        }
    }

    const callData = {
        callerId: currentUser.uid,
        callerName: currentUserProfile?.name || currentUser.displayName || 'Usu??rio',
        callerPhotoURL: currentUserProfile?.photoURL || null,
        callerPhotoData: currentUserProfile?.photoData || null,
        calleeId: selectedFriendData.uid,
        calleeName: selectedFriendData.name || 'Usu??rio',
        calleePhotoURL: selectedFriendData.photoURL || null,
        calleePhotoData: selectedFriendData.photoData || null,
        type: callType,
        status: 'ringing',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    callDocRef = await db.collection('calls').add(callData);
    currentCallId = callDocRef.id;
    currentCallRole = 'caller';
    activeCallData = callData;
    callPhase = 'outgoing';
    if (btnCall) btnCall.disabled = true;
    if (btnVideoCall) btnVideoCall.disabled = true;

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            callDocRef.collection('callerCandidates').add(event.candidate.toJSON());
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await callDocRef.update({ offer });

    calleeCandidatesUnsubscribe = callDocRef.collection('calleeCandidates')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                }
            });
        });

    callDocUnsubscribe = callDocRef.onSnapshot(snapshot => {
        const data = snapshot.data();
        if (!data) return;
        if (data.answer && !peerConnection.currentRemoteDescription) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            callPhase = 'active';
            if (callTimeout) {
                clearTimeout(callTimeout);
                callTimeout = null;
            }
            stopRingtone();
            updateCallIndicator('active', currentCallType || callType);
            updateCallModal({
                title: callType === 'video' ? 'Chamada de v??deo' : 'Chamada de voz',
                status: 'Conectado',
                user: selectedFriendData
            });
            setCallButtonsVisibility('active');
        }
        if (data.status === 'rejected' || data.status === 'ended') {
            resetCallState();
        }
    });

    setCallButtonsVisibility('outgoing');
    updateCallIndicator('outgoing', callType);
    updateCallModal({
        title: callType === 'video' ? 'Chamada de v??deo' : 'Chamada de voz',
        status: 'Aguardando resposta',
        user: selectedFriendData
    });
    startRingtone('outgoing');

    callTimeout = setTimeout(async () => {
        if (callDocRef) {
            await callDocRef.set({
                status: 'ended',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
        resetCallState();
    }, 30000);
}


async function handleIncomingCall(callDoc) {
    if (currentCallId) {
        await callDoc.ref.set({ status: 'rejected', updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        return;
    }

    const data = callDoc.data();
    if (!data) return;

    if (isFriendBlocked(data.callerId)) {
        await callDoc.ref.set({ status: 'rejected', updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        return;
    }

    callDocRef = callDoc.ref;
    currentCallId = callDoc.id;
    currentCallRole = 'callee';
    activeCallData = data;
    currentCallType = data.type || 'audio';
    callPhase = 'incoming';
    if (btnCall) btnCall.disabled = true;
    if (btnVideoCall) btnVideoCall.disabled = true;

    updateCallMediaVisibility(currentCallType);
    setCallButtonsVisibility('incoming');
    updateCallIndicator('incoming', currentCallType);
    updateCallModal({
        title: currentCallType === 'video' ? 'Chamada de vÃ­deo' : 'Chamada de voz',
        status: 'Deseja atender?',
        user: {
            name: data.callerName,
            photoURL: data.callerPhotoURL,
            photoData: data.callerPhotoData
        }
    });
    startRingtone('incoming');
}

async function acceptIncomingCall() {
    if (!callDocRef || !activeCallData || currentCallRole !== 'callee') return;

    try {
        const wantsVideo = (currentCallType || activeCallData.type) === 'video';
        await preparePeerConnection({ video: wantsVideo });
    } catch (error) {
        if ((currentCallType || activeCallData.type) === 'video') {
            const fallback = confirm('N??o foi poss??vel acessar a c??mera. Deseja atender apenas com ??udio?');
            if (!fallback) {
                await rejectIncomingCall();
                return;
            }
            currentCallType = 'audio';
            try {
                await preparePeerConnection({ video: false });
            } catch (audioError) {
                alert('N??o foi poss??vel acessar o microfone.');
                await rejectIncomingCall();
                return;
            }
        } else {
            alert('N??o foi poss??vel acessar o microfone.');
            await rejectIncomingCall();
            return;
        }
    }

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            callDocRef.collection('calleeCandidates').add(event.candidate.toJSON());
        }
    };

    const offer = activeCallData.offer;
    if (!offer) {
        alert('Não foi possível atender esta chamada.');
        resetCallState();
        return;
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    callPhase = 'active';

    await callDocRef.update({
        answer,
        status: 'accepted',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    callerCandidatesUnsubscribe = callDocRef.collection('callerCandidates')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                }
            });
        });

    callDocUnsubscribe = callDocRef.onSnapshot(snapshot => {
        const data = snapshot.data();
        if (!data) return;
        if (data.status === 'ended' || data.status === 'rejected') {
            resetCallState();
        }
    });

    setCallButtonsVisibility('active');
    stopRingtone();
    updateCallIndicator('active', currentCallType || activeCallData.type || 'audio');
    updateCallModal({
        title: (currentCallType || activeCallData.type) === 'video' ? 'Chamada de v??deo' : 'Chamada de voz',
        status: 'Conectado',
        user: {
            name: activeCallData.callerName,
            photoURL: activeCallData.callerPhotoURL,
            photoData: activeCallData.callerPhotoData
        }
    });
}

async function rejectIncomingCall() {
    if (!callDocRef) return;
    await callDocRef.set({
        status: 'rejected',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    resetCallState();
}

async function endCall(status = 'ended') {
    if (callDocRef) {
        await callDocRef.set({
            status,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }
    resetCallState();
}

function listenForIncomingCalls() {
    if (!currentUser) return;
    if (incomingCallUnsubscribe) incomingCallUnsubscribe();

    incomingCallUnsubscribe = db.collection('calls')
        .where('calleeId', '==', currentUser.uid)
        .where('status', '==', 'ringing')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    handleIncomingCall(change.doc);
                }
                if (change.type === 'removed') {
                    if (currentCallId === change.doc.id && callPhase === 'incoming') {
                        resetCallState();
                    }
                }
            });
        });
}

async function findUserByEmail(email) {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;

    let snapshot = await db.collection('users')
        .where('emailLower', '==', normalized)
        .limit(1)
        .get();

    if (snapshot.empty) {
        snapshot = await db.collection('users')
            .where('email', '==', email.trim())
            .limit(1)
            .get();
    }

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = { id: doc.id, ...doc.data() };
    if (data.disabled) return null;
    return data;
}

async function addFriendByEmail(email) {
    if (!currentUser) return;
    const user = await findUserByEmail(email);
    if (!user) {
        alert('Usuário não encontrado.');
        return;
    }
    if (user.uid === currentUser.uid) {
        alert('Você já é este usuário.');
        return;
    }
    if (currentFriends.includes(user.uid)) {
        alert('Este usuário já está na sua lista de amigos.');
        return;
    }
    await db.collection('users').doc(currentUser.uid).set({
        friends: firebase.firestore.FieldValue.arrayUnion(user.uid)
    }, { merge: true });
    alert('Usuário adicionado à sua lista de amigos.');
}

async function removeFriend(friendId) {
    if (!currentUser || !friendId) return;
    await db.collection('users').doc(currentUser.uid).set({
        friends: firebase.firestore.FieldValue.arrayRemove(friendId),
        blocked: firebase.firestore.FieldValue.arrayRemove(friendId)
    }, { merge: true });
}

async function blockFriend(friendId) {
    if (!currentUser || !friendId) return;
    await db.collection('users').doc(currentUser.uid).set({
        blocked: firebase.firestore.FieldValue.arrayUnion(friendId)
    }, { merge: true });
}

async function unblockFriend(friendId) {
    if (!currentUser || !friendId) return;
    await db.collection('users').doc(currentUser.uid).set({
        blocked: firebase.firestore.FieldValue.arrayRemove(friendId)
    }, { merge: true });
}

function updateRoleBadge(role) {
    if (!userRoleBadge) return;
    if (role === 'administrador') {
        userRoleBadge.textContent = 'Administrador';
        userRoleBadge.classList.remove('hidden');
    } else {
        userRoleBadge.classList.add('hidden');
    }
}

function setAdminPanelVisible(show) {
    if (!chatPanel || !adminPanel) return;
    adminPanel.classList.toggle('hidden', !show);
    chatPanel.classList.toggle('hidden', show);
    if (btnAdminPanel) {
        btnAdminPanel.textContent = show ? 'Chat' : 'Admin';
    }
    if (show) {
        setAdminTab(adminPanel.dataset.activeTab || 'metrics');
    }
}

function setAdminAccess(isAdmin) {
    if (!btnAdminPanel) return;
    btnAdminPanel.classList.toggle('hidden', !isAdmin);
    if (!isAdmin) {
        setAdminPanelVisible(false);
    }
}

function setAdminTab(tab) {
    if (!adminPanel || !adminTabs) return;
    const safeTab = tab || 'metrics';
    adminPanel.dataset.activeTab = safeTab;
    const buttons = adminTabs.querySelectorAll('.admin-tab');
    buttons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === safeTab);
    });
}

function setSidebarOpen(open) {
    if (!app) return;
    app.classList.toggle('sidebar-open', open);
    if (sidebarOverlay) {
        sidebarOverlay.classList.toggle('show', open);
    }
}

function loadAdminUsers() {
    if (!adminUsersList || currentUserRole !== 'administrador') return;
    if (adminUsersUnsubscribe) adminUsersUnsubscribe();

    adminUsersUnsubscribe = db.collection('users')
        .onSnapshot((snapshot) => {
            const users = [];
            snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
            users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

            renderAdminUsers(users);

            const total = users.length;
            const admins = users.filter(user => user.role === 'administrador').length;
            const online = users.filter(user => user.online).length;

            if (metricTotalUsers) metricTotalUsers.textContent = total;
            if (metricTotalAdmins) metricTotalAdmins.textContent = admins;
            if (metricOnlineUsers) metricOnlineUsers.textContent = online;
        });
}

function renderAdminUsers(users) {
    adminUsersList.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'admin-user-item';
        const isDisabled = user.disabled === true;
        li.innerHTML = `
            <div class="admin-user-meta">
                <strong>${user.name || 'Usuário'}</strong>
                <span>${user.email || ''}</span>
                <span class="admin-role-pill">${user.role || 'user_chat'}</span>
                ${isDisabled ? '<span class="admin-status-pill">Desativado</span>' : ''}
            </div>
            <div class="admin-user-actions">
                <button class="admin-edit-btn" type="button">Editar</button>
                <button class="admin-delete-btn" type="button">Excluir</button>
            </div>
        `;

        const editButton = li.querySelector('.admin-edit-btn');
        const deleteButton = li.querySelector('.admin-delete-btn');
        editButton.addEventListener('click', () => openAdminEditModal(user));
        deleteButton.addEventListener('click', () => handleAdminDeleteUser(user));
        adminUsersList.appendChild(li);
    });
}

function openAdminEditModal(user) {
    if (!adminEditModal || !user) return;
    editingUserId = user.uid;
    adminEditName.value = user.name || '';
    adminEditEmail.value = user.email || '';
    adminEditRole.value = user.role || 'user_chat';
    adminEditModal.classList.add('show');
}

function closeAdminEditModal() {
    if (!adminEditModal) return;
    adminEditModal.classList.remove('show');
    editingUserId = null;
}

async function createUserAsAdmin({ name, email, password, role }) {
    const secondaryName = `Secondary-${Date.now()}`;
    const secondary = firebase.initializeApp(firebaseConfig, secondaryName);
    try {
        const secondaryAuth = secondary.auth();
        const userCredential = await secondaryAuth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });

        await db.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            name: name,
            email: email,
            emailLower: email.toLowerCase(),
            photoURL: userCredential.user.photoURL || null,
            role: role,
            friends: [],
            blocked: [],
            online: false,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: currentUser.uid
        });
    } finally {
        try {
            await secondary.auth().signOut();
        } catch (error) {
            console.warn('Erro ao sair do auth secundário:', error);
        }
        await secondary.delete();
    }
}

async function removeUserFromFriends(userId) {
    const snapshot = await db.collection('users')
        .where('friends', 'array-contains', userId)
        .get();

    if (snapshot.empty) return;

    let batch = db.batch();
    let opCount = 0;

    for (const doc of snapshot.docs) {
        batch.update(doc.ref, {
            friends: firebase.firestore.FieldValue.arrayRemove(userId)
        });
        opCount += 1;

        if (opCount >= 450) {
            await batch.commit();
            batch = db.batch();
            opCount = 0;
        }
    }

    if (opCount > 0) {
        await batch.commit();
    }
}

async function handleAdminDeleteUser(user) {
    if (!user || currentUserRole !== 'administrador') return;
    if (user.uid === currentUser.uid) {
        alert('Você não pode excluir o seu próprio usuário.');
        return;
    }

    const confirmed = confirm(`Deseja excluir o usuário ${user.name || user.email || ''}?`);
    if (!confirmed) return;

    try {
        await db.collection('users').doc(user.uid).set({
            disabled: true,
            deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        await removeUserFromFriends(user.uid);
        alert('Usuário desativado com sucesso.');
    } catch (error) {
        alert('Erro ao excluir usuário: ' + error.message);
    }
}

if (btnAdminPanel) {
    btnAdminPanel.addEventListener('click', () => {
        const isVisible = adminPanel && !adminPanel.classList.contains('hidden');
        setAdminPanelVisible(!isVisible);
        setSidebarOpen(false);
    });
}

if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', () => {
        setSidebarOpen(true);
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        setSidebarOpen(false);
    });
}

if (adminTabs) {
    adminTabs.querySelectorAll('.admin-tab').forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            setAdminTab(tabButton.dataset.tab);
        });
    });
    setAdminTab(adminPanel?.dataset?.activeTab || 'metrics');
}

if (adminEditClose) {
    adminEditClose.addEventListener('click', closeAdminEditModal);
}

if (adminEditSave) {
    adminEditSave.addEventListener('click', async () => {
        if (!editingUserId || currentUserRole !== 'administrador') return;
        const name = adminEditName.value.trim();
        const role = adminEditRole.value === 'administrador' ? 'administrador' : 'user_chat';

        if (!name) {
            alert('Digite um nome válido.');
            return;
        }

        try {
            await db.collection('users').doc(editingUserId).update({
                name: name,
                role: role,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            if (editingUserId === currentUser.uid) {
                currentUserRole = role;
                if (currentUserProfile) {
                    currentUserProfile.name = name;
                    currentUserProfile.role = role;
                }
                userName.textContent = name;
                updateRoleBadge(currentUserRole);
                setAdminAccess(currentUserRole === 'administrador');
                if (currentUserRole !== 'administrador') {
                    setAdminPanelVisible(false);
                }
            }

            closeAdminEditModal();
        } catch (error) {
            alert('Erro ao atualizar usuário: ' + error.message);
        }
    });
}

if (adminCreateForm) {
    adminCreateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (currentUserRole !== 'administrador') return;

        const name = adminCreateName.value.trim();
        const email = adminCreateEmail.value.trim();
        const password = adminCreatePassword.value;
        const role = adminCreateRole.value === 'administrador' ? 'administrador' : 'user_chat';

        if (!name || !email || !password) {
            alert('Preencha todos os campos.');
            return;
        }

        if (password.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        try {
            await createUserAsAdmin({ name, email, password, role });
            adminCreateForm.reset();
            adminCreateRole.value = 'user_chat';
            alert('Usuário criado com sucesso!');
        } catch (error) {
            handleAuthError(error);
        }
    });
}

// ========== FUNÇÕES DO CHAT ==========

// Carregar lista de usuários
function loadUsers() {
    if (usersUnsubscribe) usersUnsubscribe();
    
    usersUnsubscribe = db.collection('users')
        .where('uid', '!=', currentUser.uid)
        .onSnapshot((snapshot) => {
            const users = [];
            snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
            allUsersCache = users;
            renderFriendUsers();
        });
}

function renderFriendUsers() {
    if (!Array.isArray(allUsersCache)) return;
    const friendSet = new Set(currentFriends || []);
    const blockedSet = new Set(currentUserProfile?.blocked || []);
    const friends = allUsersCache.filter(user => friendSet.has(user.uid) && !user.disabled && !blockedSet.has(user.uid));

    // Ordenar: online primeiro, depois por lastSeen
    friends.sort((a, b) => {
        if (a.online && !b.online) return -1;
        if (!a.online && b.online) return 1;
        return (b.lastSeen?.seconds || 0) - (a.lastSeen?.seconds || 0);
    });

    renderUsers(friends);
    if (totalUsers) {
        totalUsers.textContent = `${friends.length} contato${friends.length !== 1 ? 's' : ''}`;
    }

    if (selectedFriendData) {
        const updatedFriend = allUsersCache.find(user => user.uid === selectedFriendData.uid);
        if (updatedFriend) {
            selectedFriendData = updatedFriend;
        }
        if (friendModal?.classList.contains('show')) {
            if (friendDetailStatus) friendDetailStatus.textContent = getFriendStatusText(selectedFriendData);
            updateFriendModalState();
        }
    }

    if (selectedFriendData && !friendSet.has(selectedFriendData.uid)) {
        selectedFriendData = null;
        if (defaultChatPartnerPhoto) {
            chatPartnerPhoto.src = defaultChatPartnerPhoto;
        }
        chatPartnerName.textContent = 'Selecione um usuário';
        chatPartnerStatus.textContent = '';
        messageInput.disabled = true;
        btnSend.disabled = true;
        btnAttach.disabled = true;
        if (btnEmoji) btnEmoji.disabled = true;
        if (btnCall) btnCall.disabled = true;
        if (btnVideoCall) btnVideoCall.disabled = true;
    }

    if (selectedFriendData && blockedSet.has(selectedFriendData.uid)) {
        messageInput.disabled = true;
        btnSend.disabled = true;
        btnAttach.disabled = true;
        if (btnEmoji) btnEmoji.disabled = true;
        chatPartnerStatus.textContent = 'Bloqueado';
        if (btnCall) btnCall.disabled = true;
        if (btnVideoCall) btnVideoCall.disabled = true;
    }
}

// Renderizar lista de usuários
function renderUsers(users) {
    usersList.innerHTML = '';

    if (!users || users.length === 0) {
        const li = document.createElement('li');
        li.className = 'user-item empty';
        li.innerHTML = `
            <div class="user-item-info">
                <h4>Nenhum contato</h4>
                <p>Adicione um amigo pelo e-mail acima.</p>
            </div>
        `;
        usersList.appendChild(li);
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        li.className = `user-item ${selectedUserId === user.uid ? 'active' : ''}`;
        li.dataset.uid = user.uid;
        
        const lastSeen = user.lastSeen ? formatLastSeen(user.lastSeen.toDate()) : '';
        const status = user.online ? '🟢 Online' : `⚪ Offline ${lastSeen}`;
        
        const fallbackPhoto = user.photoData || 'https://via.placeholder.com/45/cccccc/666666?text=User';
        li.innerHTML = `
            <img src="${fallbackPhoto}" data-photo-url="${user.photoURL || ''}" alt="avatar">
            <div class="user-item-info">
                <h4>${user.name || 'Usuário'}</h4>
                <p>${status}</p>
            </div>
        `;

        const avatar = li.querySelector('img');
        const photoUrl = user.photoURL || '';
        if (photoUrl) {
            hydratePhotoFromUrl(avatar, photoUrl, fallbackPhoto);
        }
        
        li.addEventListener('click', () => selectUser(user));
        usersList.appendChild(li);
    });
}

// Formatar última visualização
function formatLastSeen(date) {
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);
    
    if (diffMinutes < 1) return 'agora mesmo';
    if (diffMinutes < 60) return `há ${diffMinutes} min`;
    if (diffMinutes < 1440) return `há ${Math.floor(diffMinutes / 60)} h`;
    return date.toLocaleDateString('pt-BR');
}

// Filtrar usuários
searchUser.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.user-item').forEach(item => {
        const name = item.querySelector('h4').innerText.toLowerCase();
        item.style.display = name.includes(term) ? 'flex' : 'none';
    });
});

// Selecionar usuário para conversar
async function selectUser(user) {
    selectedUserId = user.uid;
    selectedFriendData = user;
    
    // Atualizar seleção na lista
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.toggle('active', item.dataset.uid === user.uid);
    });
    
    // Atualizar cabeçalho do chat
    chatPartnerName.textContent = user.name || 'Usuário';
    const fallbackPhoto = user.photoData || 'https://via.placeholder.com/45/cccccc/666666?text=User';
    chatPartnerPhoto.src = fallbackPhoto;
    if (user.photoURL) {
        hydratePhotoFromUrl(chatPartnerPhoto, user.photoURL, fallbackPhoto);
    }
    const isBlocked = isFriendBlocked(user.uid);
    chatPartnerStatus.textContent = isBlocked ? 'Bloqueado' : (user.online ? '🟢 Online' : '⚪ Offline');
    
    // Habilitar input
    const disableChat = isBlocked;
    messageInput.disabled = disableChat;
    btnSend.disabled = disableChat;
    btnAttach.disabled = disableChat;
    if (btnEmoji) btnEmoji.disabled = disableChat;
    if (btnCall) btnCall.disabled = disableChat;
    if (btnVideoCall) btnVideoCall.disabled = disableChat;
    messageInput.focus();

    if (emojiPicker) emojiPicker.classList.add('hidden');
    
    // Esconder mensagem de boas-vindas
    document.querySelector('.welcome-message')?.remove();
    
    // Carregar mensagens
    await loadMessages(user.uid);

    // Fechar sidebar no mobile apÃ³s selecionar
    setSidebarOpen(false);
}

// Carregar mensagens em tempo real
async function loadMessages(otherUid) {
    if (messagesUnsubscribe) messagesUnsubscribe();
    
    const conversationId = getConversationId(currentUser.uid, otherUid);
    
    messagesUnsubscribe = db.collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            const messages = [];
            snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
            renderMessages(messages);
            
            // Marcar mensagens como lidas
            markMessagesAsRead(conversationId);
        });
}

// Gerar ID da conversa
function getConversationId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

// Marcar mensagens como lidas
async function markMessagesAsRead(conversationId) {
    if (!currentUser || !selectedUserId) return;
    
    const messagesRef = db.collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .where('senderId', '==', selectedUserId)
        .where('read', '==', false);
    
    const snapshot = await messagesRef.get();
    
    const batch = db.batch();
    snapshot.forEach(doc => {
        batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
}

// Renderizar mensagens
function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <p>Inicie uma conversa com ${chatPartnerName.textContent}!</p>
            </div>
        `;
        return;
    }
    
    messages.forEach(msg => {
        const isSent = msg.senderId === currentUser.uid;
        const div = document.createElement('div');
        div.className = `message ${isSent ? 'sent' : 'received'}`;
        
        const messageType = msg.type || (msg.imageUrl ? 'image' : 'text');
        if (messageType === 'image') {
            const imageUrl = msg.imageUrl || msg.fileUrl;
            if (imageUrl) {
                div.innerHTML = `
                    <img src="${imageUrl}" alt="imagem" onclick="window.open('${imageUrl}', '_blank')" style="max-width: 200px;">
                    <small>${formatTime(msg.timestamp)}</small>
                `;
            } else {
                div.innerHTML = `
                    <p>Imagem indisponível.</p>
                    <small>${formatTime(msg.timestamp)}</small>
                `;
            }
        } else if (messageType === 'file') {
            const fileUrl = msg.fileUrl || msg.imageUrl || '#';
            const fileName = msg.fileName || 'Arquivo';
            const fileSize = msg.fileSize ? formatFileSize(msg.fileSize) : '';
            div.innerHTML = `
                <div class="file-attachment">
                    <span class="file-icon">📎</span>
                    <div class="file-info">
                        <a href="${fileUrl}" target="_blank" rel="noopener">${fileName}</a>
                        <small>${fileSize}</small>
                    </div>
                </div>
                <small>${formatTime(msg.timestamp)}</small>
            `;
        } else {
            div.innerHTML = `
                <p>${msg.text || ''}</p>
                <small>${formatTime(msg.timestamp)}</small>
            `;
        }
        
        messagesContainer.appendChild(div);
    });
    
    // Scroll para o final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Formatar hora
function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatFileSize(bytes) {
    if (bytes === 0 || !bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const size = (bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1);
    return `${size} ${units[index]}`;
}

function insertAtCursor(input, text) {
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const before = input.value.slice(0, start);
    const after = input.value.slice(end);
    input.value = `${before}${text}${after}`;
    const newPos = start + text.length;
    input.setSelectionRange(newPos, newPos);
    input.focus();
}

function resetRegisterForm() {
    if (registerForm) registerForm.reset();
    if (registerRole) registerRole.value = 'user_chat';
    if (registerPhotoInput) registerPhotoInput.value = '';
    if (registerPhotoPreview) {
        registerPhotoPreview.src = '';
        registerPhotoPreview.style.display = 'none';
    }
    if (registerPhotoPreviewUrl) {
        URL.revokeObjectURL(registerPhotoPreviewUrl);
        registerPhotoPreviewUrl = null;
    }
}

function resetProfileModal() {
    pendingProfilePhotoFile = null;
    if (profilePhotoInput) profilePhotoInput.value = '';
    if (profilePhotoPreviewUrl) {
        URL.revokeObjectURL(profilePhotoPreviewUrl);
        profilePhotoPreviewUrl = null;
    }
    profileCropReady = false;
}

function openProfileModal() {
    if (!profileModal) return;
    const currentPhoto = currentUserProfile?.photoData || currentUserProfile?.photoURL || userPhoto?.src || '';
    if (currentPhoto) {
        loadCropImage(currentPhoto);
    }
    profileModal.classList.add('show');
}

function closeProfileModal() {
    if (!profileModal) return;
    profileModal.classList.remove('show');
    resetProfileModal();
}

function openFriendModal() {
    if (!friendModal || !selectedFriendData) return;
    const fallbackPhoto = selectedFriendData.photoData || 'https://via.placeholder.com/120/cccccc/666666?text=User';
    if (friendPreviewImage) {
        friendPreviewImage.src = fallbackPhoto;
        if (selectedFriendData.photoURL) {
            hydratePhotoFromUrl(friendPreviewImage, selectedFriendData.photoURL, fallbackPhoto);
        }
    }
    if (friendDetailName) friendDetailName.textContent = selectedFriendData.name || 'Usuário';
    if (friendDetailEmail) friendDetailEmail.textContent = selectedFriendData.email || '';
    if (friendDetailStatus) friendDetailStatus.textContent = getFriendStatusText(selectedFriendData);
    updateFriendModalState();
    friendModal.classList.add('show');
}

function closeFriendModal() {
    if (!friendModal) return;
    friendModal.classList.remove('show');
    selectedFriendData = null;
}

function getFriendStatusText(friend) {
    if (!friend) return '';
    if (friend.online) return 'Online';
    if (friend.lastSeen?.toDate) {
        const lastSeen = formatLastSeen(friend.lastSeen.toDate());
        return `Offline ${lastSeen}`;
    }
    return 'Offline';
}

function updateFriendModalState() {
    if (!selectedFriendData) return;
    const blockedSet = new Set(currentUserProfile?.blocked || []);
    const isBlocked = blockedSet.has(selectedFriendData.uid);

    if (friendBlockedBadge) {
        friendBlockedBadge.classList.toggle('hidden', !isBlocked);
    }
    if (friendBlockBtn) {
        friendBlockBtn.classList.toggle('hidden', isBlocked);
    }
    if (friendUnblockBtn) {
        friendUnblockBtn.classList.toggle('hidden', !isBlocked);
    }
}

function isFriendBlocked(friendId) {
    return (currentUserProfile?.blocked || []).includes(friendId);
}

// Enviar mensagem de texto
btnSend.addEventListener('click', async () => {
    const text = messageInput.value.trim();
    if (!text || !selectedUserId) return;
    if (isFriendBlocked(selectedUserId)) {
        alert('Você bloqueou este usuário.');
        return;
    }
    
    const conversationId = getConversationId(currentUser.uid, selectedUserId);
    
    try {
        await db.collection('conversations')
            .doc(conversationId)
            .collection('messages')
            .add({
                text: text,
                senderId: currentUser.uid,
                receiverId: selectedUserId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                type: 'text',
                read: false
            });
        
        messageInput.value = '';
    } catch (error) {
        alert('Erro ao enviar mensagem: ' + error.message);
    }
});

// Anexar arquivo
btnAttach.addEventListener('click', () => {
    fileUpload.click();
});

fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUserId) {
        fileUpload.value = '';
        return;
    }
    if (isFriendBlocked(selectedUserId)) {
        alert('Você bloqueou este usuário.');
        fileUpload.value = '';
        return;
    }
    
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('O arquivo deve ter no máximo 20MB.');
        fileUpload.value = '';
        return;
    }
    
    const isImage = file.type && file.type.startsWith('image/');
    
    try {
        const storageRef = storage.ref(`chat-files/${currentUser.uid}/${Date.now()}_${file.name}`);
        await storageRef.put(file);
        const fileUrl = await storageRef.getDownloadURL();
        
        const conversationId = getConversationId(currentUser.uid, selectedUserId);
        
        await db.collection('conversations')
            .doc(conversationId)
            .collection('messages')
            .add({
                fileUrl: fileUrl,
                fileName: file.name,
                fileType: file.type || 'application/octet-stream',
                fileSize: file.size,
                imageUrl: isImage ? fileUrl : null,
                senderId: currentUser.uid,
                receiverId: selectedUserId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                type: isImage ? 'image' : 'file',
                read: false
            });
    } catch (error) {
        alert('Erro ao enviar arquivo: ' + error.message);
    }
    
    fileUpload.value = '';
});

if (btnEmoji) {
    btnEmoji.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!emojiPicker) return;
        emojiPicker.classList.toggle('hidden');
    });
}

if (emojiPicker) {
    emojiPicker.addEventListener('emoji-click', (event) => {
        insertAtCursor(messageInput, event.detail.unicode);
    });
}

if (btnAddFriend) {
    btnAddFriend.addEventListener('click', async () => {
        const email = friendEmailInput ? friendEmailInput.value.trim() : '';
        if (!email) {
            alert('Digite o e-mail do usuário.');
            return;
        }
        try {
            await addFriendByEmail(email);
            if (friendEmailInput) friendEmailInput.value = '';
        } catch (error) {
            alert('Erro ao adicionar amigo: ' + error.message);
        }
    });
}

if (friendEmailInput) {
    friendEmailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnAddFriend?.click();
        }
    });
}

if (chatPartnerPhoto) {
    chatPartnerPhoto.addEventListener('click', () => {
        if (!selectedFriendData) return;
        openFriendModal();
    });
}

if (chatPartnerName) {
    chatPartnerName.addEventListener('click', () => {
        if (!selectedFriendData) return;
        openFriendModal();
    });
}

if (friendCloseModal) {
    friendCloseModal.addEventListener('click', closeFriendModal);
}

if (friendRemoveBtn) {
    friendRemoveBtn.addEventListener('click', async () => {
        if (!selectedFriendData) return;
        const confirmed = confirm('Deseja remover este amigo da sua lista?');
        if (!confirmed) return;
        try {
            await removeFriend(selectedFriendData.uid);
            closeFriendModal();
        } catch (error) {
            alert('Erro ao remover amigo: ' + error.message);
        }
    });
}

if (friendBlockBtn) {
    friendBlockBtn.addEventListener('click', async () => {
        if (!selectedFriendData) return;
        const confirmed = confirm('Deseja bloquear este amigo? Ele não aparecerá mais na sua lista.');
        if (!confirmed) return;
        try {
            await blockFriend(selectedFriendData.uid);
            if (!currentUserProfile) currentUserProfile = {};
            currentUserProfile.blocked = Array.isArray(currentUserProfile.blocked) ? currentUserProfile.blocked : [];
            if (!currentUserProfile.blocked.includes(selectedFriendData.uid)) {
                currentUserProfile.blocked.push(selectedFriendData.uid);
            }
            updateFriendModalState();

            if (selectedUserId === selectedFriendData.uid) {
                messageInput.disabled = true;
                btnSend.disabled = true;
                btnAttach.disabled = true;
                if (btnEmoji) btnEmoji.disabled = true;
                chatPartnerStatus.textContent = 'Bloqueado';
                if (btnCall) btnCall.disabled = true;
                if (btnVideoCall) btnVideoCall.disabled = true;
            }
        } catch (error) {
            alert('Erro ao bloquear amigo: ' + error.message);
        }
    });
}

if (friendUnblockBtn) {
    friendUnblockBtn.addEventListener('click', async () => {
        if (!selectedFriendData) return;
        try {
            await unblockFriend(selectedFriendData.uid);
            if (currentUserProfile?.blocked) {
                currentUserProfile.blocked = currentUserProfile.blocked.filter(id => id !== selectedFriendData.uid);
            }
            updateFriendModalState();
            if (selectedUserId === selectedFriendData.uid) {
                chatPartnerStatus.textContent = selectedFriendData.online ? '🟢 Online' : '⚪ Offline';
                messageInput.disabled = false;
                btnSend.disabled = false;
                btnAttach.disabled = false;
                if (btnEmoji) btnEmoji.disabled = false;
                if (btnCall) btnCall.disabled = false;
                if (btnVideoCall) btnVideoCall.disabled = false;
            }
        } catch (error) {
            alert('Erro ao desbloquear amigo: ' + error.message);
        }
    });
}

if (btnCall) {
    btnCall.addEventListener('click', async () => {
        if (!selectedFriendData) return;
        await startCall('audio');
    });
}

if (btnVideoCall) {
    btnVideoCall.addEventListener('click', async () => {
        if (!selectedFriendData) return;
        await startCall('video');
    });
}

if (callAcceptBtn) {
    callAcceptBtn.addEventListener('click', async () => {
        await acceptIncomingCall();
    });
}

if (callRejectBtn) {
    callRejectBtn.addEventListener('click', async () => {
        await rejectIncomingCall();
    });
}

if (callHangupBtn) {
    callHangupBtn.addEventListener('click', async () => {
        await endCall('ended');
    });
}

if (userPhoto) {
    userPhoto.addEventListener('click', () => {
        if (!currentUser) return;
        openProfileModal();
    });
}

if (profileCloseModal) {
    profileCloseModal.addEventListener('click', closeProfileModal);
}

if (profileCancelBtn) {
    profileCancelBtn.addEventListener('click', closeProfileModal);
}

if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', () => {
        const file = profilePhotoInput.files[0];

        if (profilePhotoPreviewUrl) {
            URL.revokeObjectURL(profilePhotoPreviewUrl);
            profilePhotoPreviewUrl = null;
        }

        if (!file) {
            pendingProfilePhotoFile = null;
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Selecione apenas imagens.');
            profilePhotoInput.value = '';
            pendingProfilePhotoFile = null;
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('A foto deve ter no máximo 5MB.');
            profilePhotoInput.value = '';
            pendingProfilePhotoFile = null;
            return;
        }

        pendingProfilePhotoFile = file;
        profilePhotoPreviewUrl = URL.createObjectURL(file);
        loadCropImage(profilePhotoPreviewUrl);
    });
}

if (profileSaveBtn) {
    profileSaveBtn.addEventListener('click', async () => {
        if (!currentUser || !profileCropReady) {
            closeProfileModal();
            return;
        }

        const canvas = createCroppedCanvas(256);
        if (!canvas) {
            alert('Não foi possível processar a foto. Tente outra imagem.');
            return;
        }

        const photoData = canvas.toDataURL('image/jpeg', 0.85);
        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.85);
        const croppedFile = blob ? new File([blob], 'profile.jpg', { type: 'image/jpeg' }) : null;

        let photoUrl = '';
        if (croppedFile) {
            try {
                photoUrl = await uploadProfilePhotoViaBackend(croppedFile, {
                    displayName: currentUserProfile?.name || currentUser.displayName || 'usuario',
                    uid: currentUser.uid
                });
            } catch (error) {
                console.warn('Falha no upload via backend, usando fallback base64.', error);
            }
        }

        try {
            await db.collection('users').doc(currentUser.uid).set({
                photoURL: photoUrl || null,
                photoData: photoData || null,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            if (photoUrl) {
                await currentUser.updateProfile({ photoURL: photoUrl });
            }

            const fallbackPhoto = photoData || 'https://via.placeholder.com/45/002776/ffffff?text=User';
            userPhoto.src = fallbackPhoto;
            if (photoUrl) hydratePhotoFromUrl(userPhoto, photoUrl, fallbackPhoto);

            closeProfileModal();
        } catch (error) {
            alert('Erro ao atualizar foto: ' + error.message);
        }
    });
}

if (profileZoom) {
    profileZoom.addEventListener('input', () => {
        if (!profileCropReady) return;
        const zoomValue = parseFloat(profileZoom.value) || 1;
        cropScale = cropBaseScale * zoomValue;
        updateCropTransform();
    });
}

if (profileCenterBtn) {
    profileCenterBtn.addEventListener('click', () => {
        resetCropPosition();
    });
}

if (profileCropFrame) {
    profileCropFrame.addEventListener('pointerdown', (e) => {
        if (!profileCropReady) return;
        cropDragging = true;
        cropStartX = e.clientX;
        cropStartY = e.clientY;
        cropStartOffsetX = cropOffsetX;
        cropStartOffsetY = cropOffsetY;
        profileCropFrame.setPointerCapture(e.pointerId);
        if (profileCropImage) profileCropImage.classList.add('dragging');
    });

    profileCropFrame.addEventListener('pointermove', (e) => {
        if (!cropDragging) return;
        cropOffsetX = cropStartOffsetX + (e.clientX - cropStartX);
        cropOffsetY = cropStartOffsetY + (e.clientY - cropStartY);
        updateCropTransform();
    });

    const endDrag = (e) => {
        if (!cropDragging) return;
        cropDragging = false;
        if (profileCropImage) profileCropImage.classList.remove('dragging');
        if (profileCropFrame.hasPointerCapture(e.pointerId)) {
            profileCropFrame.releasePointerCapture(e.pointerId);
        }
    };

    profileCropFrame.addEventListener('pointerup', endDrag);
    profileCropFrame.addEventListener('pointercancel', endDrag);
    profileCropFrame.addEventListener('pointerleave', endDrag);
}

// Atalho Enter
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        btnSend.click();
    }
});

// Logout
btnLogout.addEventListener('click', async () => {
    try {
        await updateUserOnlineStatus(false);
        await auth.signOut();
        resetRegisterForm();
        setSidebarOpen(false);
    } catch (error) {
        alert('Erro ao sair: ' + error.message);
    }
});

updateRegisterRoleAvailability();
