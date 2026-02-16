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
const btnGoogleLogin = document.getElementById('btn-google-login');
const btnGoogleRegister = document.getElementById('btn-google-register');
const forgotPasswordLink = document.getElementById('forgot-password');
const forgotModal = document.getElementById('forgot-modal');
const closeModal = document.querySelector('.close-modal');
const btnResetPassword = document.getElementById('btn-reset-password');
const resetEmail = document.getElementById('reset-email');
const rememberMe = document.getElementById('remember-me');

// App
const userPhoto = document.getElementById('user-photo');
const userName = document.getElementById('user-name');
const userStatus = document.getElementById('user-status');
const usersList = document.getElementById('users-list');
const totalUsers = document.getElementById('total-users');
const chatPartnerName = document.getElementById('chat-partner-name');
const chatPartnerPhoto = document.getElementById('chat-partner-photo');
const chatPartnerStatus = document.getElementById('chat-partner-status');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const btnSend = document.getElementById('btn-send');
const btnAttach = document.getElementById('btn-attach');
const imageUpload = document.getElementById('image-upload');
const searchUser = document.getElementById('search-user');
const btnLogout = document.getElementById('btn-logout');

// ========== VARIÁVEIS DE ESTADO ==========
let currentUser = null;
let selectedUserId = null;
let messagesUnsubscribe = null;
let usersUnsubscribe = null;
let onlineStatusInterval = null;

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
});

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
        
        await db.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            name: name,
            email: email,
            photoURL: userCredential.user.photoURL || null,
            online: true,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        registerForm.reset();
        alert('Cadastro realizado com sucesso!');
    } catch (error) {
        handleAuthError(error);
    }
});

// Login com Google
async function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const result = await auth.signInWithPopup(provider);
        
        const userRef = db.collection('users').doc(result.user.uid);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            await userRef.set({
                uid: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                online: true,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        handleAuthError(error);
    }
}

btnGoogleLogin.addEventListener('click', handleGoogleLogin);
btnGoogleRegister.addEventListener('click', handleGoogleLogin);

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
        
        // Atualizar interface do usuário
        userPhoto.src = user.photoURL || 'https://via.placeholder.com/45/002776/ffffff?text=User';
        userName.textContent = user.displayName || 'Usuário';
        
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
        authContainer.classList.remove('hidden');
        app.classList.add('hidden');
        
        // Cleanup
        if (messagesUnsubscribe) messagesUnsubscribe();
        if (usersUnsubscribe) usersUnsubscribe();
        if (onlineStatusInterval) clearInterval(onlineStatusInterval);
        
        selectedUserId = null;
    }
});

// Atualizar status online do usuário
async function updateUserOnlineStatus(online) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            online: online,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
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

// ========== FUNÇÕES DO CHAT ==========

// Carregar lista de usuários
function loadUsers() {
    if (usersUnsubscribe) usersUnsubscribe();
    
    usersUnsubscribe = db.collection('users')
        .where('uid', '!=', currentUser.uid)
        .onSnapshot((snapshot) => {
            const users = [];
            snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
            
            // Ordenar: online primeiro, depois por lastSeen
            users.sort((a, b) => {
                if (a.online && !b.online) return -1;
                if (!a.online && b.online) return 1;
                return (b.lastSeen?.seconds || 0) - (a.lastSeen?.seconds || 0);
            });
            
            renderUsers(users);
            totalUsers.textContent = `${users.length} usuário${users.length !== 1 ? 's' : ''}`;
        });
}

// Renderizar lista de usuários
function renderUsers(users) {
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const li = document.createElement('li');
        li.className = `user-item ${selectedUserId === user.uid ? 'active' : ''}`;
        li.dataset.uid = user.uid;
        
        const lastSeen = user.lastSeen ? formatLastSeen(user.lastSeen.toDate()) : '';
        const status = user.online ? '🟢 Online' : `⚪ Offline ${lastSeen}`;
        
        li.innerHTML = `
            <img src="${user.photoURL || 'https://via.placeholder.com/45/cccccc/666666?text=User'}" alt="avatar">
            <div class="user-item-info">
                <h4>${user.name}</h4>
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
    chatPartnerName.textContent = user.name;
    chatPartnerPhoto.src = user.photoURL || 'https://via.placeholder.com/45/cccccc/666666?text=User';
    chatPartnerStatus.textContent = user.online ? '🟢 Online' : '⚪ Offline';
    
    // Habilitar input
    messageInput.disabled = false;
    btnSend.disabled = false;
    btnAttach.disabled = false;
    messageInput.focus();
    
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
        
        if (msg.type === 'image') {
            div.innerHTML = `
                <img src="${msg.imageUrl}" alt="imagem" onclick="window.open('${msg.imageUrl}', '_blank')" style="max-width: 200px;">
                <small>${formatTime(msg.timestamp)}</small>
            `;
        } else {
            div.innerHTML = `
                <p>${msg.text}</p>
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

// Anexar imagem
btnAttach.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUserId) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Selecione apenas imagens.');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
    }
    
    try {
        const storageRef = storage.ref(`chat-images/${currentUser.uid}/${Date.now()}_${file.name}`);
        await storageRef.put(file);
        const imageUrl = await storageRef.getDownloadURL();
        
        const conversationId = getConversationId(currentUser.uid, selectedUserId);
        
        await db.collection('conversations')
            .doc(conversationId)
            .collection('messages')
            .add({
                imageUrl: imageUrl,
                senderId: currentUser.uid,
                receiverId: selectedUserId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                type: 'image',
                read: false
            });
    } catch (error) {
        alert('Erro ao enviar imagem: ' + error.message);
    }
    
    imageUpload.value = '';
});

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
