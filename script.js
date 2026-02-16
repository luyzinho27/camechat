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

// Elementos DOM - Auth
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

// Elementos DOM - App
const userPhoto = document.getElementById('user-photo');
const userName = document.getElementById('user-name');
const usersList = document.getElementById('users-list');
const chatPartnerName = document.getElementById('chat-partner-name');
const chatPartnerPhoto = document.getElementById('chat-partner-photo');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const btnSend = document.getElementById('btn-send');
const btnAttach = document.getElementById('btn-attach');
const imageUpload = document.getElementById('image-upload');
const searchUser = document.getElementById('search-user');
const btnLogout = document.getElementById('btn-logout');

// Variáveis de estado
let currentUser = null;
let selectedUserId = null;
let messagesUnsubscribe = null;

// Emojis regionais
const cametaEmojis = ['🦀', '🌊', '🐟', '🚣', '🌴', '☀️', '🎣'];

// ==================== FUNÇÕES DE AUTENTICAÇÃO ====================

// Alternar entre abas de login e cadastro
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
        // Configurar persistência baseada no checkbox "Lembrar-me"
        const persistence = rememberMe.checked 
            ? firebase.auth.Auth.Persistence.LOCAL 
            : firebase.auth.Auth.Persistence.SESSION;
        
        await auth.setPersistence(persistence);
        
        // Fazer login
        await auth.signInWithEmailAndPassword(email, password);
        
        // Limpar formulário
        loginForm.reset();
    } catch (error) {
        let errorMessage = 'Erro ao fazer login. ';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += 'Usuário não encontrado.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Senha incorreta.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'E-mail inválido.';
                break;
            default:
                errorMessage += error.message;
        }
        alert(errorMessage);
    }
});

// Cadastro com email/senha
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validações
    if (password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('As senhas não conferem.');
        return;
    }
    
    try {
        // Criar usuário no Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Atualizar perfil do usuário com o nome
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Criar documento do usuário no Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            name: name,
            email: email,
            photoURL: userCredential.user.photoURL || null,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            region: 'Cametá-PA',
            favoriteEmoji: cametaEmojis[Math.floor(Math.random() * cametaEmojis.length)],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Limpar formulário
        registerForm.reset();
        
        alert('Cadastro realizado com sucesso!');
    } catch (error) {
        let errorMessage = 'Erro ao cadastrar. ';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Este e-mail já está em uso.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'E-mail inválido.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Senha muito fraca.';
                break;
            default:
                errorMessage += error.message;
        }
        alert(errorMessage);
    }
});

// Login com Google (função unificada)
async function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        // Usar persistência LOCAL para Google (sempre lembrar)
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
        const result = await auth.signInWithPopup(provider);
        
        // Verificar se é primeiro login e criar documento no Firestore
        const userRef = db.collection('users').doc(result.user.uid);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            await userRef.set({
                uid: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                region: 'Cametá-PA',
                favoriteEmoji: cametaEmojis[Math.floor(Math.random() * cametaEmojis.length)],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        alert('Erro no login com Google: ' + error.message);
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
        alert('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        forgotModal.classList.remove('show');
        resetEmail.value = '';
    } catch (error) {
        let errorMessage = 'Erro ao enviar e-mail. ';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += 'Usuário não encontrado.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'E-mail inválido.';
                break;
            default:
                errorMessage += error.message;
        }
        alert(errorMessage);
    }
});

// Verificar se há credenciais salvas (lembrar-me)
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        authContainer.classList.add('hidden');
        app.classList.remove('hidden');
        
        // Atualiza dados do usuário na interface
        userPhoto.src = user.photoURL || 'https://via.placeholder.com/40/002776/FFFFFF?text=🦀';
        userName.textContent = user.displayName || 'Camarataense';
        
        // Atualizar lastSeen no Firestore
        await db.collection('users').doc(user.uid).update({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Carrega lista de usuários
        loadUsers();
    } else {
        // Usuário deslogado
        currentUser = null;
        authContainer.classList.remove('hidden');
        app.classList.add('hidden');
        if (messagesUnsubscribe) messagesUnsubscribe();
        
        // Limpar seleções
        selectedUserId = null;
    }
});

// Logout
btnLogout.addEventListener('click', async () => {
    try {
        await auth.signOut();
    } catch (error) {
        alert('Erro ao sair: ' + error.message);
    }
});

// ==================== FUNÇÕES DO CHAT ====================

// Carrega lista de usuários (exceto o atual)
async function loadUsers() {
    const querySnapshot = await db.collection('users')
        .where('uid', '!=', currentUser.uid)
        .orderBy('lastSeen', 'desc')
        .get();
    
    renderUsers(querySnapshot.docs.map(doc => doc.data()));
}

// Renderiza lista de usuários
function renderUsers(users) {
    usersList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'user-item' + (selectedUserId === user.uid ? ' active' : '');
        li.dataset.uid = user.uid;
        li.innerHTML = `
            <img src="${user.photoURL || 'https://via.placeholder.com/45/FFD100/002776?text=🦀'}" alt="avatar">
            <div class="user-info">
                <h4>${user.name}</h4>
                <p>${user.region || 'Cametá-PA'} ${user.favoriteEmoji || '🦀'}</p>
            </div>
        `;
        li.addEventListener('click', () => selectUser(user));
        usersList.appendChild(li);
    });
}

// Filtro de usuários
searchUser.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.user-item').forEach(item => {
        const name = item.querySelector('h4').innerText.toLowerCase();
        item.style.display = name.includes(term) ? 'flex' : 'none';
    });
});

// Seleciona um usuário para conversar
async function selectUser(user) {
    selectedUserId = user.uid;
    
    // Remove classe active de todos e adiciona no selecionado
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.toggle('active', item.dataset.uid === user.uid);
    });
    
    // Atualiza cabeçalho do chat
    chatPartnerName.textContent = `${user.name} ${user.favoriteEmoji || '🦀'}`;
    chatPartnerPhoto.src = user.photoURL || 'https://via.placeholder.com/40/FFD100/002776?text=🦀';
    
    // Habilita input de mensagem
    messageInput.disabled = false;
    btnSend.disabled = false;
    btnAttach.disabled = false;
    messageInput.focus();
    
    // Carrega mensagens da conversa
    await loadMessages(user.uid);
}

// Carrega mensagens em tempo real
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
            renderMessages(messages, otherUid);
        }, (error) => {
            console.error('Erro ao carregar as conversas:', error);
        });
}

// Gera ID único para conversa
function getConversationId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

// Renderiza mensagens
function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        const isSent = msg.senderId === currentUser.uid;
        const div = document.createElement('div');
        div.className = `message ${isSent ? 'sent' : 'received'}`;
        
        if (msg.type === 'image') {
            div.innerHTML = `
                <img src="${msg.imageUrl}" alt="imagem" onclick="window.open('${msg.imageUrl}', '_blank')">
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

// Formata timestamp
function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Envia mensagem de texto
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
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                type: 'text'
            });
        
        messageInput.value = '';
    } catch (error) {
        alert('Erro ao enviar a mensagem: ' + error.message);
    }
});

// Anexar imagem
btnAttach.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUserId) return;
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas imagens.');
        return;
    }
    
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
    }
    
    // Upload para o Storage
    const storageRef = storage.ref(`chat-images/cameta/${currentUser.uid}/${Date.now()}_${file.name}`);
    const uploadTask = storageRef.put(file);
    
    uploadTask.on('state_changed', 
        null,
        (error) => alert('Erro no upload da imagem: ' + error.message),
        async () => {
            const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
            
            const conversationId = getConversationId(currentUser.uid, selectedUserId);
            await db.collection('conversations')
                .doc(conversationId)
                .collection('messages')
                .add({
                    imageUrl: imageUrl,
                    senderId: currentUser.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    type: 'image'
                });
        }
    );
});

// Atalho Enter para enviar
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        btnSend.click();
    }
});