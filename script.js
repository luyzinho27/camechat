// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
    apiKey: "AIzaSyDGclwLGfGVlpKNjUhenZ5nN1vK_mrdjls",
    authDomain: "camechat-4fb88.firebaseapp.com",
    projectId: "camechat-4fb88",
    storageBucket: "camechat-4fb88.firebasestorage.app",
    messagingSenderId: "405074774387",
    appId: "1:405074774387:web:17d2c4e7fd1e35e0c1dd06"
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
        role: options.role || 'user_chat',
        friends: Array.isArray(options.friends) ? options.friends : [],
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
    const shouldUpdatePhoto = options.photoURL && data.photoURL !== options.photoURL;

    if (!data.role && options.role) updates.role = options.role;
    if (shouldUpdateName) updates.name = options.name;
    if (shouldUpdateEmail) updates.email = options.email;
    if (shouldUpdateEmailLower) updates.emailLower = emailLower;
    if (shouldUpdatePhoto) updates.photoURL = options.photoURL;
    if (!Array.isArray(data.friends)) updates.friends = [];

    if (Object.keys(updates).length > 0) {
        updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        await userRef.update(updates);
        return { ...data, ...updates };
    }

    return data;
}

async function uploadProfilePhoto(user, file) {
    const safeName = file.name.replace(/[^\w.-]/g, '_');
    const storageRef = storage.ref(`images/profile/${user.uid}/${Date.now()}_${safeName}`);
    await storageRef.put(file);
    return storageRef.getDownloadURL();
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
        await ensureUserDocument(userCredential.user, {
            name: name,
            email: email,
            role: resolvedRole
        });

        let photoUrl = '';
        try {
            photoUrl = await uploadProfilePhoto(userCredential.user, photoFile);
            await userCredential.user.updateProfile({
                photoURL: photoUrl
            });
            await db.collection('users').doc(userCredential.user.uid).set({
                photoURL: photoUrl,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (uploadError) {
            alert('Erro ao enviar a foto de perfil. Verifique as regras do Storage e tente novamente.');
            console.error('Erro no upload da foto:', uploadError);
        }
        
        registerForm.reset();
        if (registerRole) registerRole.value = 'user_chat';
        if (registerPhotoPreview) {
            registerPhotoPreview.src = '';
            registerPhotoPreview.style.display = 'none';
        }
        if (registerPhotoPreviewUrl) {
            URL.revokeObjectURL(registerPhotoPreviewUrl);
            registerPhotoPreviewUrl = null;
        }
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
        userPhoto.src = currentUserProfile.photoURL || user.photoURL || 'https://via.placeholder.com/45/002776/ffffff?text=User';
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
        
        // Cleanup
        if (messagesUnsubscribe) messagesUnsubscribe();
        if (usersUnsubscribe) usersUnsubscribe();
        if (adminUsersUnsubscribe) adminUsersUnsubscribe();
        if (currentUserDocUnsubscribe) currentUserDocUnsubscribe();
        messagesUnsubscribe = null;
        usersUnsubscribe = null;
        adminUsersUnsubscribe = null;
        currentUserDocUnsubscribe = null;
        if (onlineStatusInterval) clearInterval(onlineStatusInterval);
        
        selectedUserId = null;
        if (btnEmoji) btnEmoji.disabled = true;
        if (btnAttach) btnAttach.disabled = true;
        if (btnSend) btnSend.disabled = true;
        if (messageInput) messageInput.disabled = true;
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

            if (data.name) userName.textContent = data.name;
            if (data.photoURL) userPhoto.src = data.photoURL;

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
}

function setAdminAccess(isAdmin) {
    if (!btnAdminPanel) return;
    btnAdminPanel.classList.toggle('hidden', !isAdmin);
    if (!isAdmin) {
        setAdminPanelVisible(false);
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
    });
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
    const friends = allUsersCache.filter(user => friendSet.has(user.uid) && !user.disabled);

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
        
        li.innerHTML = `
            <img src="${user.photoURL || 'https://via.placeholder.com/45/cccccc/666666?text=User'}" alt="avatar">
            <div class="user-item-info">
                <h4>${user.name || 'Usuário'}</h4>
                <p>${status}</p>
            </div>
        `;
        
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
    
    // Atualizar seleção na lista
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.toggle('active', item.dataset.uid === user.uid);
    });
    
    // Atualizar cabeçalho do chat
    chatPartnerName.textContent = user.name || 'Usuário';
    chatPartnerPhoto.src = user.photoURL || 'https://via.placeholder.com/45/cccccc/666666?text=User';
    chatPartnerStatus.textContent = user.online ? '🟢 Online' : '⚪ Offline';
    
    // Habilitar input
    messageInput.disabled = false;
    btnSend.disabled = false;
    btnAttach.disabled = false;
    if (btnEmoji) btnEmoji.disabled = false;
    messageInput.focus();

    if (emojiPicker) emojiPicker.classList.add('hidden');
    
    // Esconder mensagem de boas-vindas
    document.querySelector('.welcome-message')?.remove();
    
    // Carregar mensagens
    await loadMessages(user.uid);
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

// Enviar mensagem de texto
btnSend.addEventListener('click', async () => {
    const text = messageInput.value.trim();
    if (!text || !selectedUserId) return;
    
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
    } catch (error) {
        alert('Erro ao sair: ' + error.message);
    }
});

updateRegisterRoleAvailability();
