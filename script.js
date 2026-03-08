// Configuração do Firebase
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

// Mantem sessao ativa ate o usuario clicar em "Sair"
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
    console.warn('Nao foi possivel definir persistencia LOCAL:', error);
});

// ========== ELEMENTOS DOM ==========
// Auth
const authContainer = document.getElementById('auth-container');
const app = document.getElementById('app');
const appLaunchSplash = document.getElementById('app-launch-splash');
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
const rememberMeContainer = rememberMe?.closest('.checkbox-container');

if (rememberMe) {
    rememberMe.checked = true;
}
if (rememberMeContainer) {
    rememberMeContainer.classList.add('hidden');
}

// App
const userPhoto = document.getElementById('user-photo');
const userName = document.getElementById('user-name');
const userStatus = document.getElementById('user-status');
const userHandle = document.getElementById('user-handle');
const userRoleBadge = document.getElementById('user-role-badge');
const friendSelectionToolbar = document.getElementById('friend-selection-toolbar');
const friendSelectionCount = document.getElementById('friend-selection-count');
const btnFriendMuteSelected = document.getElementById('btn-friend-mute-selected');
const btnFriendBlockSelected = document.getElementById('btn-friend-block-selected');
const btnFriendRemoveSelected = document.getElementById('btn-friend-remove-selected');
const usersList = document.getElementById('users-list');
const totalUsers = document.getElementById('total-users');
const chatHeader = document.getElementById('chat-header');
const chatSelectionSummary = document.getElementById('chat-selection-summary');
const chatSelectionCount = document.getElementById('chat-selection-count');
const chatPartnerName = document.getElementById('chat-partner-name');
const chatPartnerPhoto = document.getElementById('chat-partner-photo');
const chatPartnerStatus = document.getElementById('chat-partner-status');
const chatPartnerActivity = document.getElementById('chat-partner-activity');
const defaultChatPartnerPhoto = chatPartnerPhoto?.dataset?.defaultSrc || chatPartnerPhoto?.src || '';
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const btnSend = document.getElementById('btn-send');
const btnAttach = document.getElementById('btn-attach');
const fileUpload = document.getElementById('file-upload');
const fileUploadGallery = document.getElementById('file-upload-gallery');
const fileUploadCameraPhoto = document.getElementById('file-upload-camera-photo');
const fileUploadCameraVideo = document.getElementById('file-upload-camera-video');
const fileUploadAudio = document.getElementById('file-upload-audio');
const fileUploadDocument = document.getElementById('file-upload-document');
const btnEmoji = document.getElementById('btn-emoji');
const btnVoice = document.getElementById('btn-voice');
const btnCameraQuick = document.getElementById('btn-camera-quick');
const emojiPicker = document.getElementById('emoji-picker');
const attachMenu = document.getElementById('attach-menu');
const uploadProgressList = document.getElementById('upload-progress-list');
const cameraModal = document.getElementById('camera-modal');
const cameraCloseModal = document.getElementById('camera-close-modal');
const cameraPreview = document.getElementById('camera-preview');
const cameraStatus = document.getElementById('camera-status');
const btnCameraSwitch = document.getElementById('btn-camera-switch');
const btnCameraCapture = document.getElementById('btn-camera-capture');
const btnCameraRecord = document.getElementById('btn-camera-record');
const btnCameraCancel = document.getElementById('btn-camera-cancel');
const voiceRecordingStatus = document.getElementById('voice-recording-status');
const voiceRecordingBanner = document.getElementById('voice-recording-banner');
const voiceRecordingText = document.getElementById('voice-recording-text');
const btnVoiceCancel = document.getElementById('btn-voice-cancel');
const searchUser = document.getElementById('search-user');
const friendEmailInput = document.getElementById('friend-email');
const btnAddFriend = document.getElementById('btn-add-friend');
const btnAdminPanel = document.getElementById('btn-admin-panel');
const btnLogout = document.getElementById('btn-logout');
const btnSettings = document.getElementById('btn-settings');
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const btnSoundToggle = document.getElementById('btn-sound-toggle');
const btnReadReceiptsToggle = document.getElementById('btn-read-receipts-toggle');
const btnDesktopNotificationsToggle = document.getElementById('btn-desktop-notifications-toggle');
const btnOnlineStatusToggle = document.getElementById('btn-online-status-toggle');
const btnChatFontToggle = document.getElementById('btn-chat-font-toggle');
const btnChatBackground = document.getElementById('btn-chat-background');
const chatBackgroundUpload = document.getElementById('chat-background-upload');
const btnMediaSaveModeToggle = document.getElementById('btn-media-save-mode-toggle');
const btnMediaFolderPc = document.getElementById('btn-media-folder-pc');
const btnCallBlockToggle = document.getElementById('btn-call-block-toggle');
const btnLastSeenToggle = document.getElementById('btn-last-seen-toggle');
const btnLanguageToggle = document.getElementById('btn-language-toggle');
const settingsMenu = document.getElementById('settings-menu');
const sidebarSettings = document.getElementById('sidebar-settings');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const ADMIN_TAB_STORAGE_KEY = 'camechat_admin_tab';
const THEME_STORAGE_KEY = 'camechat_theme';
const SOUND_NOTIFICATIONS_STORAGE_KEY = 'camechat_sound_notifications';
const READ_RECEIPTS_STORAGE_KEY = 'camechat_read_receipts';
const DESKTOP_NOTIFICATIONS_STORAGE_KEY = 'camechat_desktop_notifications';
const ONLINE_STATUS_VISIBILITY_STORAGE_KEY = 'camechat_online_status_visibility';
const CHAT_FONT_SIZE_STORAGE_KEY = 'camechat_chat_font_size';
const CHAT_BACKGROUND_STORAGE_KEY = 'camechat_chat_background';
const MEDIA_AUTO_SAVE_STORAGE_KEY = 'camechat_media_auto_save';
const MEDIA_PC_FOLDER_READY_STORAGE_KEY = 'camechat_media_pc_folder_ready';
const MEDIA_HANDLE_DB_NAME = 'camechat_local_media';
const MEDIA_HANDLE_DB_VERSION = 2;
const MEDIA_HANDLE_STORE_NAME = 'settings';
const MEDIA_CACHE_STORE_NAME = 'attachments';
const MEDIA_HANDLE_ROOT_KEY = 'pc_root_handle';
const MEDIA_DOWNLOAD_SCOPE_QUERY_PARAM = 'camechat_scope';
const CALL_BLOCK_STORAGE_KEY = 'camechat_block_incoming_calls';
const LAST_SEEN_VISIBILITY_STORAGE_KEY = 'camechat_last_seen_visible';
const LANGUAGE_STORAGE_KEY = 'camechat_language';
const MUTED_FRIENDS_STORAGE_KEY_PREFIX = 'camechat_muted_friends_';

let soundNotificationsEnabled = true;
let readReceiptsEnabled = true;
let desktopNotificationsEnabled = false;
let showOnlineStatusEnabled = true;
let chatFontSizePreference = 'normal';
let chatBackgroundDataUrl = '';
let autoMediaSaveEnabled = true;
let pcLocalMediaFolderReady = false;
let blockIncomingCallsEnabled = false;
let showLastSeenEnabled = true;
let selectedLanguage = 'pt-BR';

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
const profileHandle = document.getElementById('profile-handle');
const profileSaveBtn = document.getElementById('profile-save-btn');
const profileCancelBtn = document.getElementById('profile-cancel-btn');

// Friend modal
const friendModal = document.getElementById('friend-modal');
const friendCloseModal = document.getElementById('friend-close-modal');
const friendPreviewImage = document.getElementById('friend-preview-image');
const friendDetailName = document.getElementById('friend-detail-name');
const friendDetailHandle = document.getElementById('friend-detail-handle');
const friendDetailEmail = document.getElementById('friend-detail-email');
const friendDetailStatus = document.getElementById('friend-detail-status');
const friendBlockedBadge = document.getElementById('friend-blocked-badge');
const friendRemoveBtn = document.getElementById('friend-remove-btn');
const friendBlockBtn = document.getElementById('friend-block-btn');
const friendUnblockBtn = document.getElementById('friend-unblock-btn');
const userTagMatchModal = document.getElementById('user-tag-match-modal');
const userTagMatchClose = document.getElementById('user-tag-match-close');
const userTagMatchText = document.getElementById('user-tag-match-text');
const userTagMatchList = document.getElementById('user-tag-match-list');

// Call modal
const btnCall = document.getElementById('btn-call');
const btnVideoCall = document.getElementById('btn-video-call');
const btnEditSelected = document.getElementById('btn-edit-selected');
const btnDeleteSelected = document.getElementById('btn-delete-selected');
const btnCopySelected = document.getElementById('btn-copy-selected');
const btnShareSelected = document.getElementById('btn-share-selected');
const callIndicator = document.getElementById('call-indicator');
const callModal = document.getElementById('call-modal');
const callTitle = document.getElementById('call-title');
const callStatus = document.getElementById('call-status');
const callCountdown = document.getElementById('call-countdown');
const callToast = document.getElementById('call-toast');
const callRenegotiation = document.getElementById('call-renegotiation');
const callUserPhoto = document.getElementById('call-user-photo');
const callUserName = document.getElementById('call-user-name');
const callMediaContainer = document.getElementById('call-media-container');
const callMedia = document.getElementById('call-media');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const callAcceptBtn = document.getElementById('call-accept-btn');
const callRejectBtn = document.getElementById('call-reject-btn');
const callHangupBtn = document.getElementById('call-hangup-btn');
const btnCallMute = document.getElementById('btn-call-mute');
const btnCallVideoToggle = document.getElementById('btn-call-video-toggle');
const btnCallMinimize = document.getElementById('btn-call-minimize');
const btnCallSpeaker = document.getElementById('btn-call-speaker');
const btnCallSwitchVideo = document.getElementById('btn-call-switch-video');
const btnCallSwitchAudio = document.getElementById('btn-call-switch-audio');
const callMini = document.getElementById('call-mini');
const callMiniBody = document.getElementById('call-mini-body');
const callMiniHeader = document.getElementById('call-mini-header');
const btnCallRestore = document.getElementById('btn-call-restore');
const btnCallMiniHangup = document.getElementById('btn-call-mini-hangup');
const localAudio = document.getElementById('local-audio');
const remoteAudio = document.getElementById('remote-audio');
const proximityOverlay = document.getElementById('proximity-overlay');
const deleteMessageModal = document.getElementById('delete-message-modal');
const deleteMessageModalText = document.getElementById('delete-message-modal-text');
const btnDeleteMessageMe = document.getElementById('btn-delete-message-me');
const btnDeleteMessageAll = document.getElementById('btn-delete-message-all');
const btnDeleteMessageCancel = document.getElementById('btn-delete-message-cancel');
const shareMessageModal = document.getElementById('share-message-modal');
const shareMessageFriendsList = document.getElementById('share-message-friends-list');
const btnShareMessageCancel = document.getElementById('btn-share-message-cancel');
const mediaViewerModal = document.getElementById('media-viewer-modal');
const mediaViewerContent = document.getElementById('media-viewer-content');
const btnMediaViewerSave = document.getElementById('btn-media-viewer-save');
const btnMediaViewerClose = document.getElementById('btn-media-viewer-close');
const messageActionMenu = document.getElementById('message-action-menu');
const messageActionReply = document.getElementById('message-action-reply');
const messageActionCopy = document.getElementById('message-action-copy');
const messageActionEdit = document.getElementById('message-action-edit');
const messageActionDelete = document.getElementById('message-action-delete');
const replyPreview = document.getElementById('reply-preview');
const replyPreviewLabel = document.getElementById('reply-preview-label');
const replyPreviewText = document.getElementById('reply-preview-text');
const replyPreviewThumb = document.getElementById('reply-preview-thumb');
const btnReplyCancel = document.getElementById('btn-reply-cancel');
const editPreview = document.getElementById('edit-preview');
const editPreviewLabel = document.getElementById('edit-preview-label');
const editPreviewText = document.getElementById('edit-preview-text');
const btnEditCancel = document.getElementById('btn-edit-cancel');
const DEFAULT_MESSAGE_INPUT_PLACEHOLDER = messageInput?.getAttribute('placeholder') || 'Digite sua mensagem...';

const CALL_ICON_MIC_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="11" rx="3"></rect><path d="M5 10v2a7 7 0 0 0 14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>';
const CALL_ICON_MIC_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="11" rx="3"></rect><path d="M5 10v2a7 7 0 0 0 14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line><line x1="3" y1="3" x2="21" y2="21"></line></svg>';
const CALL_ICON_VIDEO_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="13" height="10" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path></svg>';
const CALL_ICON_VIDEO_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="13" height="10" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path><line x1="3" y1="3" x2="21" y2="21"></line></svg>';
const CALL_ICON_MINIMIZE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><line x1="8" y1="15" x2="16" y2="15"></line></svg>';
const CALL_ICON_SPEAKER_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15 9a5 5 0 0 1 0 6"></path><path d="M18 6a9 9 0 0 1 0 12"></path></svg>';
const CALL_ICON_SPEAKER_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="3" y1="3" x2="21" y2="21"></line></svg>';
const CALL_ICON_SWITCH_VIDEO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="13" height="10" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path><path d="M8 4H4v4"></path><path d="M4 4l4 4"></path></svg>';
const CALL_ICON_SWITCH_AUDIO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.58 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.1a2 2 0 0 1 2.11-.45c.85.26 1.73.46 2.63.58a2 2 0 0 1 1.72 1.98z"></path><path d="M19 5h-4"></path><path d="M17 3v4"></path></svg>';
const VOICE_ICON_IDLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><rect x="10" y="7" width="4" height="8" rx="2"></rect><path d="M7 11v1a5 5 0 0 0 10 0v-1"></path><line x1="12" y1="16" x2="12" y2="19"></line></svg>';
const VOICE_ICON_RECORDING = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><rect x="10" y="7" width="4" height="8" rx="2"></rect><path d="M7 11v1a5 5 0 0 0 10 0v-1"></path><line x1="12" y1="16" x2="12" y2="19"></line><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle></svg>';
const RECORDING_HEARTBEAT_MS = 5000;
const ONLINE_HEARTBEAT_MS = 30000;
const ONLINE_STALE_MS = (ONLINE_HEARTBEAT_MS * 2) + 10000;
const LARGE_AUTO_DOWNLOAD_BYTES = 4 * 1024 * 1024;
const MAX_CHAT_FILE_SIZE_BYTES = 60 * 1024 * 1024;
const MAX_CHAT_FILE_SIZE_MB = Math.round(MAX_CHAT_FILE_SIZE_BYTES / (1024 * 1024));
const MESSAGE_LONG_PRESS_MS = 450;
const MESSAGE_EDIT_WINDOW_MS = 30 * 60 * 1000;
const MEDIA_VIEWER_MIN_SCALE = 1;
const MEDIA_VIEWER_MAX_SCALE = 4;
const APP_BOOTSTRAP_FALLBACK_MS = 18000;

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
let currentConversationId = null;
let currentConversationMessages = [];
let typingUnsubscribe = null;
let typingIdleTimeout = null;
let typingRemoteTimeout = null;
let remoteTypingState = null;
let remoteUserActivityState = null;
let friendDocUnsubscribe = null;
let lastTypingSentAt = 0;
let localTypingState = null;
let recordingHeartbeatInterval = null;
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
let touchStartX = 0;
let touchStartY = 0;
let touchTracking = false;
let callCountdownInterval = null;
let callCountdownRemaining = 0;
let callCountdownBaseStatus = '';
let callReloadScheduled = false;
let isAudioMuted = false;
let isVideoMuted = false;
let isCallMinimized = false;
let isVideoSwapped = false;
let isSpeakerOn = false;
let speakerOutputDeviceId = null;
let suppressCallReload = false;
let callMiniDragging = false;
let callMiniStartX = 0;
let callMiniStartY = 0;
let callMiniOrigX = 0;
let callMiniOrigY = 0;
let callMiniDragMoved = false;
let suppressVideoSwapUntil = 0;
let callMiniDragPointerId = null;
let callMiniDragTouchId = null;
let callPreviewDragging = false;
let callPreviewStartX = 0;
let callPreviewStartY = 0;
let callPreviewOrigX = 0;
let callPreviewOrigY = 0;
let callPreviewDragMoved = false;
let callPreviewDragPointerId = null;
let callPreviewDragTouchId = null;
let callPreviewTarget = null;
let lastTouchSwapAt = 0;
let proximitySensor = null;
let proximityActive = false;
let deviceProximityHandler = null;
let userProximityHandler = null;
let pendingRenegotiationId = null;
let lastRenegotiationId = null;
let renegotiationInProgress = false;
let renegotiationTimeout = null;
let pendingRenegotiationTarget = null;
let renegotiationFallbackUsed = false;
let audioRecorder = null;
let audioRecorderStream = null;
let audioRecorderChunks = [];
let isRecordingAudio = false;
let audioRecorderSend = true;
let voiceRecordingStartedAt = null;
let voiceRecordingTimer = null;
let cameraStream = null;
let cameraRecorder = null;
let cameraRecorderChunks = [];
let isCameraRecording = false;
let cancelCameraRecording = false;
let currentCameraFacing = 'environment';
let autoDownloadedAttachmentKeys = new Set();
let autoDownloadingAttachmentKeys = new Set();
let isMessageSelectionMode = false;
let selectedMessageIds = new Set();
let isFriendSelectionMode = false;
let selectedFriendIds = new Set();
let mutedFriendIds = new Set();
let suppressMediaOpenUntil = 0;
let replyToMessage = null;
let editingMessage = null;
let activeMessageActionTarget = null;
let deleteMessageModalResolver = null;
let shareMessageModalResolver = null;
let userTagMatchModalResolver = null;
let mediaViewerImageEl = null;
let mediaViewerImageScale = 1;
let mediaViewerImageTranslateX = 0;
let mediaViewerImageTranslateY = 0;
let mediaViewerImagePointers = new Map();
let mediaViewerImagePinchDistance = 0;
let mediaViewerImageStartScale = 1;
let mediaViewerActiveMessage = null;
let mediaViewerActiveUrl = '';
let isManualMediaSaveInProgress = false;
let pcMediaRootHandle = null;
let pcMediaRootHandleLoaded = false;
let attachmentCacheObjectUrls = new Map();
let hasCompletedInitialBootstrap = false;
let appBootstrapFallbackTimer = null;

// ========== FUNCOES DE AUTENTICACAO ==========

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
    if (!auth?.currentUser) return null;
    try {
        const snapshot = await db.collection('users')
            .where('role', '==', 'administrador')
            .limit(1)
            .get();
        return !snapshot.empty;
    } catch (error) {
        if (error?.code !== 'permission-denied' && error?.code !== 'unauthenticated') {
            console.warn('Erro ao verificar administrador:', error);
        }
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

function normalizeUserTagInput(value) {
    return String(value || '')
        .trim()
        .replace(/^@+/, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/_+/g, '_');
}

function extractFirstName(value) {
    return String(value || '')
        .trim()
        .split(/\s+/)
        .find(Boolean) || '';
}

function normalizeUserTagBase(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '');
}

function buildGeneratedUserTag(name, uid) {
    const firstName = extractFirstName(name);
    const base = normalizeUserTagBase(firstName).slice(0, 20) || 'usuario';
    return `@${base}`;
}

function getUserTagValue(entity) {
    if (!entity) return '';
    const name = entity.name || entity.displayName || '';
    if (name) {
        return buildGeneratedUserTag(name, entity.uid || entity.id || '');
    }
    const normalizedStoredTag = normalizeUserTagInput(entity.userTag || entity.userTagLower || '');
    if (normalizedStoredTag) {
        return `@${normalizedStoredTag}`;
    }
    const uid = entity.uid || entity.id || '';
    if (!uid) return '';
    return buildGeneratedUserTag(name, uid);
}

function buildUserTagFields(name, uid, existingTag = '') {
    const userTag = buildGeneratedUserTag(name, uid) || getUserTagValue({
        userTag: existingTag,
        name,
        uid
    });
    return {
        userTag,
        userTagLower: normalizeUserTagInput(userTag)
    };
}

function getSearchableUserTag(entity) {
    if (!entity) return '';
    const sourceName = entity.name || entity.displayName || '';
    const canonicalTag = sourceName
        ? normalizeUserTagInput(buildGeneratedUserTag(sourceName, entity.uid || entity.id || ''))
        : '';
    if (canonicalTag) {
        return canonicalTag;
    }
    return normalizeUserTagInput(entity.userTag || entity.userTagLower || '');
}

function sortUsersByNameAndEmail(users) {
    return [...users].sort((a, b) => {
        const nameA = String(a?.name || '').toLowerCase();
        const nameB = String(b?.name || '').toLowerCase();
        if (nameA !== nameB) return nameA.localeCompare(nameB, 'pt-BR');
        const emailA = String(a?.email || '').toLowerCase();
        const emailB = String(b?.email || '').toLowerCase();
        return emailA.localeCompare(emailB, 'pt-BR');
    });
}

function getUserTagMatchOptionMeta(user) {
    if (!user?.uid || !currentUser) {
        return { selectable: true, buttonLabel: 'Escolher' };
    }
    if (user.uid === currentUser.uid) {
        return { selectable: false, buttonLabel: 'Você' };
    }
    if (currentFriends.includes(user.uid)) {
        return { selectable: false, buttonLabel: 'Adicionado' };
    }
    return { selectable: true, buttonLabel: 'Escolher' };
}

function buildUserTagMatchItem(user) {
    const item = document.createElement('li');
    item.className = 'share-message-friend-item';
    item.dataset.uid = user.uid;
    const optionMeta = getUserTagMatchOptionMeta(user);

    const safeName = escapeHtml(user.name || 'Usuário');
    const safeEmail = escapeHtml(user.email || 'E-mail não informado');

    item.innerHTML = `
        <img src="https://via.placeholder.com/40/cccccc/666666?text=User" alt="avatar">
        <div class="share-message-friend-info">
            <strong>${safeName}</strong>
            <small>${safeEmail}</small>
        </div>
        <button type="button" class="btn-primary share-message-pick-btn"${optionMeta.selectable ? '' : ' disabled'}>${optionMeta.buttonLabel}</button>
    `;

    const avatar = item.querySelector('img');
    if (avatar) {
        applyProfilePhoto(avatar, user, 'https://via.placeholder.com/40/cccccc/666666?text=User');
    }

    return item;
}

function closeUserTagMatchModal() {
    if (userTagMatchModal) {
        userTagMatchModal.classList.remove('show');
    }
    if (userTagMatchList) {
        userTagMatchList.innerHTML = '';
    }
    if (userTagMatchModalResolver) {
        const resolve = userTagMatchModalResolver;
        userTagMatchModalResolver = null;
        resolve(null);
    }
}

async function askUserTagMatchSelection(identifier, users) {
    if (!Array.isArray(users) || users.length === 0) return null;
    if (!userTagMatchModal || !userTagMatchList) {
        return users.find((user) => getUserTagMatchOptionMeta(user).selectable) || null;
    }

    const normalizedIdentifier = normalizeUserTagInput(identifier);
    if (userTagMatchText) {
        userTagMatchText.textContent = `Mais de um usuário foi encontrado com @${normalizedIdentifier}. Escolha o usuário correto abaixo.`;
    }

    userTagMatchList.innerHTML = '';
    users.forEach((user) => {
        const item = buildUserTagMatchItem(user);
        const optionMeta = getUserTagMatchOptionMeta(user);
        const choose = () => {
            if (!optionMeta.selectable) return;
            if (userTagMatchModalResolver) {
                const resolve = userTagMatchModalResolver;
                userTagMatchModalResolver = null;
                userTagMatchModal.classList.remove('show');
                userTagMatchList.innerHTML = '';
                resolve(user);
            }
        };

        item.addEventListener('click', (event) => {
            if (event.target.closest('.share-message-pick-btn') || event.target === item || event.target.closest('.share-message-friend-info') || event.target.tagName === 'IMG') {
                choose();
            }
        });

        userTagMatchList.appendChild(item);
    });

    userTagMatchModal.classList.add('show');
    return await new Promise((resolve) => {
        userTagMatchModalResolver = resolve;
    });
}

function renderCurrentUserIdentity(profile) {
    const handleText = getUserTagValue(profile);
    if (userHandle) {
        userHandle.textContent = handleText;
    }
    if (profileHandle) {
        profileHandle.textContent = handleText;
    }
}

function getMutedFriendsStorageKey(uid = currentUser?.uid) {
    return uid ? `${MUTED_FRIENDS_STORAGE_KEY_PREFIX}${uid}` : '';
}

function loadMutedFriendsForCurrentUser() {
    const key = getMutedFriendsStorageKey();
    if (!key) {
        mutedFriendIds = new Set();
        return;
    }

    try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        mutedFriendIds = new Set(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
    } catch (error) {
        mutedFriendIds = new Set();
    }
}

function persistMutedFriendsForCurrentUser() {
    const key = getMutedFriendsStorageKey();
    if (!key) return;

    try {
        localStorage.setItem(key, JSON.stringify(Array.from(mutedFriendIds)));
    } catch (error) {
        // ignore
    }
}

function isFriendMuted(friendId) {
    return !!friendId && mutedFriendIds.has(friendId);
}

function updateChatSelectionSummary() {
    const selectedCount = selectedMessageIds.size;
    const hasSelection = isMessageSelectionMode && selectedCount > 0;
    if (chatSelectionCount) {
        chatSelectionCount.textContent = String(selectedCount || 0);
    }
    if (chatSelectionSummary) {
        chatSelectionSummary.classList.toggle('hidden', !hasSelection);
    }
    if (chatHeader) {
        chatHeader.classList.toggle('message-selection-active', hasSelection);
    }
}

function getSelectedFriendsData() {
    if (!Array.isArray(allUsersCache) || !selectedFriendIds.size) return [];
    return allUsersCache.filter((user) => selectedFriendIds.has(user.uid));
}

function updateFriendSelectionUI() {
    const selectedCount = selectedFriendIds.size;
    const hasSelection = isFriendSelectionMode && selectedCount > 0;
    const selectedFriends = hasSelection ? getSelectedFriendsData() : [];
    const allMuted = selectedFriends.length > 0 && selectedFriends.every((friend) => isFriendMuted(friend.uid));

    if (friendSelectionCount) {
        friendSelectionCount.textContent = String(selectedCount || 0);
    }
    if (friendSelectionToolbar) {
        friendSelectionToolbar.classList.toggle('hidden', !hasSelection);
    }
    const sidebarHeader = userPhoto?.closest('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.classList.toggle('friend-selection-active', hasSelection);
    }
    if (btnFriendMuteSelected) {
        btnFriendMuteSelected.title = allMuted ? 'Remover silêncio' : 'Silenciar';
        btnFriendMuteSelected.setAttribute('aria-label', allMuted ? 'Remover silêncio' : 'Silenciar');
        btnFriendMuteSelected.setAttribute('aria-pressed', allMuted ? 'true' : 'false');
    }
}

function resetFriendSelectionState() {
    isFriendSelectionMode = false;
    selectedFriendIds = new Set();
    updateFriendSelectionUI();
    renderFriendUsers();
}

function setFriendSelectionMode(enabled) {
    const shouldEnable = !!enabled;
    isFriendSelectionMode = shouldEnable;
    if (!shouldEnable) {
        selectedFriendIds = new Set();
    }
    updateFriendSelectionUI();
    renderFriendUsers();
}

function toggleFriendSelection(friendId) {
    if (!friendId) return;
    if (!isFriendSelectionMode) {
        isFriendSelectionMode = true;
    }
    if (selectedFriendIds.has(friendId)) {
        selectedFriendIds.delete(friendId);
    } else {
        selectedFriendIds.add(friendId);
    }
    if (selectedFriendIds.size === 0) {
        setFriendSelectionMode(false);
        return;
    }
    updateFriendSelectionUI();
    renderFriendUsers();
}

function activateFriendSelectionByLongPress(friendId) {
    if (!friendId) return;
    if (!isFriendSelectionMode) {
        isFriendSelectionMode = true;
        selectedFriendIds = new Set([friendId]);
    } else {
        selectedFriendIds.add(friendId);
    }
    updateFriendSelectionUI();
    renderFriendUsers();
}

function notifyAndroidAppReady(screen = 'auth') {
    try {
        if (window.CameChatAndroid && typeof window.CameChatAndroid.notifyAppReady === 'function') {
            window.CameChatAndroid.notifyAppReady(String(screen || 'auth'));
        }
    } catch (error) {
        console.warn('Falha ao avisar a camada Android que o app ficou pronto.', error);
    }
}

function finishInitialBootstrap(screen = 'auth') {
    if (hasCompletedInitialBootstrap) return;
    hasCompletedInitialBootstrap = true;

    if (appBootstrapFallbackTimer) {
        clearTimeout(appBootstrapFallbackTimer);
        appBootstrapFallbackTimer = null;
    }

    if (appLaunchSplash) {
        appLaunchSplash.classList.add('is-hiding');
        window.setTimeout(() => {
            appLaunchSplash.classList.add('hidden');
        }, 420);
    }

    notifyAndroidAppReady(screen);
}

function startInitialBootstrapFallback() {
    if (appBootstrapFallbackTimer) {
        clearTimeout(appBootstrapFallbackTimer);
    }

    appBootstrapFallbackTimer = window.setTimeout(() => {
        finishInitialBootstrap(currentUser ? 'app' : 'auth');
    }, APP_BOOTSTRAP_FALLBACK_MS);
}

async function ensureUserDocument(user, options = {}) {
    const userRef = db.collection('users').doc(user.uid);
    const resolvedName = options.name || user.displayName || '';
    const tagFields = buildUserTagFields(resolvedName, user.uid, options.userTag || '');
    let snapshot = null;
    try {
        snapshot = await userRef.get();
    } catch (error) {
        console.warn('Falha ao ler perfil do usuário. Usando dados básicos da sessão.', error);
        return {
            uid: user.uid,
            name: resolvedName,
            email: options.email || user.email || '',
            userTag: tagFields.userTag,
            userTagLower: tagFields.userTagLower,
            photoURL: options.photoURL ?? user.photoURL ?? null,
            photoData: options.photoData ?? null,
            role: options.role || 'user_chat',
            friends: Array.isArray(options.friends) ? options.friends : [],
            blocked: Array.isArray(options.blocked) ? options.blocked : [],
            showOnlineStatus: typeof options.showOnlineStatus === 'boolean' ? options.showOnlineStatus : true,
            online: true
        };
    }
    const emailValue = options.email || user.email || '';
    const emailLower = emailValue ? emailValue.toLowerCase() : '';
    const baseData = {
        uid: user.uid,
        name: resolvedName,
        email: emailValue,
        emailLower: emailLower,
        userTag: tagFields.userTag,
        userTagLower: tagFields.userTagLower,
        photoURL: options.photoURL ?? user.photoURL ?? null,
        photoData: options.photoData ?? null,
        role: options.role || 'user_chat',
        friends: Array.isArray(options.friends) ? options.friends : [],
        blocked: Array.isArray(options.blocked) ? options.blocked : [],
        showOnlineStatus: typeof options.showOnlineStatus === 'boolean' ? options.showOnlineStatus : true,
        online: true,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: options.createdBy || null
    };

    if (!snapshot.exists) {
        try {
            await userRef.set(baseData);
            return baseData;
        } catch (error) {
            console.warn('Falha ao criar documento do usuário. Continuando com dados básicos.', error);
            return baseData;
        }
    }

    const data = snapshot.data() || {};
    const updates = {};
    const existingTagFields = buildUserTagFields(
        data.name || resolvedName,
        user.uid,
        data.userTag || tagFields.userTag
    );

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
    if (typeof data.showOnlineStatus !== 'boolean') updates.showOnlineStatus = true;
    if (!data.userTag || data.userTag !== existingTagFields.userTag) updates.userTag = existingTagFields.userTag;
    if (!data.userTagLower || data.userTagLower !== existingTagFields.userTagLower) updates.userTagLower = existingTagFields.userTagLower;

    if (Object.keys(updates).length > 0) {
        updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

        try {
            await userRef.update(updates);
            return { ...data, ...updates };
        } catch (error) {
            const denied = error?.code === 'permission-denied';
            if (denied && Object.prototype.hasOwnProperty.call(updates, 'showOnlineStatus')) {
                const fallbackUpdates = { ...updates };
                delete fallbackUpdates.showOnlineStatus;
                if (Object.keys(fallbackUpdates).length === 1 && Object.prototype.hasOwnProperty.call(fallbackUpdates, 'updatedAt')) {
                    delete fallbackUpdates.updatedAt;
                }

                if (Object.keys(fallbackUpdates).length > 0) {
                    try {
                        await userRef.update(fallbackUpdates);
                        return { ...data, ...fallbackUpdates };
                    } catch (retryError) {
                        console.warn('Falha ao atualizar perfil do usuário.', retryError);
                        return data;
                    }
                }

                return data;
            }

            console.warn('Falha ao atualizar perfil do usuário.', error);
            return data;
        }
    }

    return data;
}

function normalizePhotoValue(value) {
    if (typeof value !== 'string') return '';
    const normalized = value.trim();
    if (!normalized || normalized === 'null' || normalized === 'undefined' || normalized === '[object Object]') {
        return '';
    }
    return normalized;
}

function getSafePhotoData(value) {
    const normalized = normalizePhotoValue(value);
    return normalized.startsWith('data:image/') ? normalized : '';
}

function getSafePhotoUrl(value) {
    const normalized = normalizePhotoValue(value);
    if (!normalized) return '';
    if (/^https?:\/\//i.test(normalized)) return normalized;
    if (normalized.startsWith('blob:')) return normalized;
    if (normalized.startsWith('data:image/')) return normalized;
    return '';
}

function resolvePhotoSources(entity, defaultFallback) {
    const fallback = getSafePhotoData(entity?.photoData) || defaultFallback;
    const url = getSafePhotoUrl(entity?.photoURL);
    return { fallback, url };
}

function applyProfilePhoto(imgEl, entity, defaultFallback, extraUrl = '') {
    if (!imgEl) return;
    const { fallback, url } = resolvePhotoSources(entity, defaultFallback);
    imgEl.src = fallback;
    const candidateUrl = url || getSafePhotoUrl(extraUrl);
    if (candidateUrl) {
        hydratePhotoFromUrl(imgEl, candidateUrl, fallback);
    }
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
    return normalizeBackendUrl(data.url);
}

async function uploadChatFileViaBackend(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    if (options.uid) formData.append('uid', options.uid);

    const apiUrl = BACKEND_BASE_URL ? `${BACKEND_BASE_URL}/api/upload-chat` : '/api/upload-chat';
    const timeoutMs = Number(options.timeoutMs) > 0
        ? Number(options.timeoutMs)
        : Math.max(120000, Math.ceil((Number(file?.size || 0) / (1024 * 1024)) * 5000));
    let response;
    try {
        response = await uploadChatFileViaBackendWithProgress(file, formData, apiUrl, { ...options, timeoutMs });
    } catch (error) {
        throw new Error('Não foi possível conectar ao backend de upload.');
    }

    if (!response.ok) {
        let errorMessage = `Erro ao enviar arquivo. (${response.status})`;
        try {
            const rawText = await response.text();
            if (rawText) {
                try {
                    const data = JSON.parse(rawText);
                    if (data?.message) {
                        errorMessage = data.message;
                    } else if (rawText.trim()) {
                        errorMessage = rawText.trim();
                    }
                } catch (parseError) {
                    errorMessage = rawText.trim().slice(0, 160);
                }
            }
        } catch (error) {
            // ignore
        }
        if (response.status === 404) {
            errorMessage = 'Endpoint de upload não encontrado. Atualize o backend com /api/upload-chat.';
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data?.url) {
        throw new Error('Resposta inválida do servidor.');
    }
    return normalizeBackendUrl(data.url);
}

async function uploadChatFile(file, options = {}) {
    const timeoutMs = Number(options.timeoutMs) > 0
        ? Number(options.timeoutMs)
        : Math.max(120000, Math.ceil((Number(file?.size || 0) / (1024 * 1024)) * 5000));
    return await uploadChatFileViaBackend(file, { ...options, timeoutMs });
}

function normalizeBackendUrl(url) {
    if (!url) return url;
    const raw = String(url).trim();
    if (!raw) return '';
    if (/^(https?:\/\/|data:|blob:)/i.test(raw)) return raw;

    let path = raw;
    if (path.startsWith('./')) path = path.slice(2);

    if (path.startsWith('/uploads/')) {
        path = `/images${path}`;
    } else if (!path.startsWith('/')) {
        if (path.startsWith('uploads/')) {
            path = `/images/${path}`;
        } else if (path.startsWith('profile/')) {
            path = `/images/${path}`;
        } else {
            path = `/${path}`;
        }
    }

    if (BACKEND_BASE_URL) {
        return `${BACKEND_BASE_URL}${path}`;
    }
    return path;
}

function createUploadProgressItem(fileName) {
    if (!uploadProgressList) return null;
    const item = document.createElement('div');
    item.className = 'upload-progress-item';
    item.innerHTML = `
        <div class="upload-progress-header">
            <span class="upload-progress-name">${fileName}</span>
            <span class="upload-progress-status">0%</span>
        </div>
        <div class="upload-progress-bar"><span></span></div>
    `;
    uploadProgressList.appendChild(item);
    uploadProgressList.classList.remove('hidden');
    return item;
}

function updateUploadProgressItem(item, percent, statusText) {
    if (!item) return;
    const bar = item.querySelector('.upload-progress-bar span');
    const status = item.querySelector('.upload-progress-status');
    if (bar) bar.style.width = `${percent}%`;
    if (status && statusText) status.textContent = statusText;
}

function markUploadError(item, message) {
    if (!item) return;
    const status = item.querySelector('.upload-progress-status');
    if (status) status.textContent = 'Erro';
    const error = document.createElement('div');
    error.className = 'upload-progress-error';
    error.textContent = message || 'Falha no upload';
    item.appendChild(error);
    setTimeout(() => {
        item.remove();
        if (uploadProgressList && !uploadProgressList.querySelector('.upload-progress-item')) {
            uploadProgressList.classList.add('hidden');
        }
    }, 3000);
}

function finalizeUploadItem(item) {
    if (!item) return;
    updateUploadProgressItem(item, 100, 'Enviado');
    setTimeout(() => {
        item.remove();
        if (uploadProgressList && !uploadProgressList.querySelector('.upload-progress-item')) {
            uploadProgressList.classList.add('hidden');
        }
    }, 2000);
}

function createDownloadProgressItem(fileName) {
    const item = createUploadProgressItem(fileName || 'arquivo');
    if (!item) return null;
    item.classList.add('download-progress-item');
    updateUploadProgressItem(item, 0, 'Baixando');
    return item;
}

function updateDownloadProgressItem(item, loaded, total) {
    if (!item) return;
    if (!total || total <= 0) {
        const bar = item.querySelector('.upload-progress-bar span');
        if (bar) {
            bar.style.width = '45%';
            bar.classList.add('indeterminate');
        }
        updateUploadProgressItem(item, 0, 'Baixando');
        return;
    }

    const percent = Math.max(0, Math.min(100, Math.round((loaded / total) * 100)));
    const bar = item.querySelector('.upload-progress-bar span');
    if (bar) bar.classList.remove('indeterminate');
    updateUploadProgressItem(item, percent, `${percent}%`);
}

function finalizeDownloadItem(item) {
    if (!item) return;
    item.classList.remove('download-progress-item');
    const bar = item.querySelector('.upload-progress-bar span');
    if (bar) bar.classList.remove('indeterminate');
    updateUploadProgressItem(item, 100, 'Salvo');
    setTimeout(() => {
        item.remove();
        if (uploadProgressList && !uploadProgressList.querySelector('.upload-progress-item')) {
            uploadProgressList.classList.add('hidden');
        }
    }, 2200);
}

function markDownloadError(item, message) {
    if (!item) return;
    item.classList.remove('download-progress-item');
    const bar = item.querySelector('.upload-progress-bar span');
    if (bar) bar.classList.remove('indeterminate');
    markUploadError(item, message || 'Falha no download');
}

function sanitizeDownloadFileName(fileName) {
    const value = String(fileName || '').trim();
    if (!value) return `arquivo_${Date.now()}`;
    return value.replace(/[\\/:*?"<>|]+/g, '_');
}

function inferAttachmentFileName(msg, url, blobType = '') {
    const byMessage = sanitizeDownloadFileName(msg?.fileName || '');
    if (byMessage && !/^arquivo_\d+$/.test(byMessage)) return byMessage;

    try {
        const parsed = new URL(url, window.location.href);
        const fromPath = decodeURIComponent(parsed.pathname.split('/').pop() || '').trim();
        if (fromPath) return sanitizeDownloadFileName(fromPath);
    } catch (error) {
        // ignore
    }

    const type = msg?.type || 'file';
    let ext = 'bin';
    if (type === 'image') ext = 'jpg';
    if (type === 'video') ext = 'mp4';
    if (type === 'audio') ext = 'webm';
    if (blobType?.includes('pdf')) ext = 'pdf';
    return sanitizeDownloadFileName(`${type}_${msg?.id || Date.now()}.${ext}`);
}

function normalizeUrlForCompare(url) {
    if (!url) return '';
    try {
        return new URL(url, window.location.href).href;
    } catch (error) {
        return String(url);
    }
}

function addUniqueUrl(target, url) {
    if (!url) return;
    const normalized = normalizeUrlForCompare(url);
    if (!normalized) return;
    if (!target.some(existing => normalizeUrlForCompare(existing) === normalized)) {
        target.push(url);
    }
}

function extractFileNameFromUrl(url) {
    if (!url) return '';
    try {
        const parsed = new URL(url, window.location.href);
        const value = decodeURIComponent(parsed.pathname.split('/').pop() || '').trim();
        return value || '';
    } catch (error) {
        return '';
    }
}

function buildFirebaseMediaUrl(storagePath) {
    const bucket = firebaseConfig?.storageBucket;
    if (!bucket || !storagePath) return '';
    return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(storagePath)}?alt=media`;
}

function getAttachmentDownloadCandidates(msg) {
    if (!msg) return [];
    const type = msg.type || (msg.imageUrl ? 'image' : 'text');
    if (!['image', 'video', 'audio', 'file'].includes(type)) return [];

    const basePath = type === 'image'
        ? (msg.imageUrl || msg.fileUrl || '')
        : (msg.fileUrl || msg.imageUrl || '');
    const primary = normalizeBackendUrl(basePath);
    const candidates = [];
    addUniqueUrl(candidates, primary);

    const filename = extractFileNameFromUrl(primary || basePath);
    if (filename) {
        addUniqueUrl(candidates, normalizeBackendUrl(`/images/uploads/${filename}`));
        addUniqueUrl(candidates, normalizeBackendUrl(`/uploads/${filename}`));
        addUniqueUrl(candidates, normalizeBackendUrl(`uploads/${filename}`));
        if (msg.senderId) {
            addUniqueUrl(candidates, buildFirebaseMediaUrl(`chat-files/${msg.senderId}/${filename}`));
        }
        if (msg.receiverId) {
            addUniqueUrl(candidates, buildFirebaseMediaUrl(`chat-files/${msg.receiverId}/${filename}`));
        }
        addUniqueUrl(candidates, buildFirebaseMediaUrl(`chat-files/${filename}`));
    }

    return candidates.filter(Boolean);
}

function getAttachmentDownloadUrl(msg) {
    return getAttachmentDownloadCandidates(msg)[0] || '';
}

async function canAccessAttachmentUrl(url) {
    if (!url) return false;
    try {
        const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        if (response.ok) return true;
        if (response.status === 405) {
            const fallback = await fetch(url, {
                method: 'GET',
                headers: { Range: 'bytes=0-0' },
                cache: 'no-store'
            });
            return fallback.ok || fallback.status === 206;
        }
        return false;
    } catch (error) {
        // Quando não for possível validar (CORS/rede), tentamos usar a URL mesmo assim.
        return true;
    }
}

async function resolveAttachmentUrl(msg, preferredUrl = '') {
    const candidates = getAttachmentDownloadCandidates(msg);
    if (preferredUrl) {
        addUniqueUrl(candidates, preferredUrl);
    }
    if (!candidates.length) {
        return await getCachedAttachmentObjectUrl(msg);
    }

    for (const url of candidates) {
        const ok = await canAccessAttachmentUrl(url);
        if (ok) return url;
    }
    return await getCachedAttachmentObjectUrl(msg);
}

function attachMediaFallbackHandlers(mediaEl, msg) {
    if (!mediaEl || !msg) return;
    const candidates = getAttachmentDownloadCandidates(msg);
    if (!candidates.length) return;

    let currentIndex = candidates.findIndex((item) => normalizeUrlForCompare(item) === normalizeUrlForCompare(mediaEl.src));
    if (currentIndex < 0) currentIndex = 0;
    const tried = new Set([normalizeUrlForCompare(candidates[currentIndex])]);
    let switching = false;

    mediaEl.addEventListener('error', async () => {
        if (switching) return;
        switching = true;
        try {
            let nextUrl = '';
            for (let i = 0; i < candidates.length; i += 1) {
                const candidate = candidates[(currentIndex + 1 + i) % candidates.length];
                const normalizedCandidate = normalizeUrlForCompare(candidate);
                if (tried.has(normalizedCandidate)) continue;
                nextUrl = candidate;
                currentIndex = candidates.findIndex((item) => item === candidate);
                tried.add(normalizedCandidate);
                break;
            }
            if (nextUrl) {
                mediaEl.src = nextUrl;
                if (typeof mediaEl.load === 'function') mediaEl.load();
                return;
            }
            const cachedUrl = await getCachedAttachmentObjectUrl(msg);
            if (cachedUrl) {
                mediaEl.src = cachedUrl;
                if (typeof mediaEl.load === 'function') mediaEl.load();
            }
        } finally {
            switching = false;
        }
    });
}

function clampValue(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getPointerDistance(pointA, pointB) {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    return Math.hypot(dx, dy);
}

function resetMediaViewerImageState() {
    mediaViewerImageEl = null;
    mediaViewerImageScale = MEDIA_VIEWER_MIN_SCALE;
    mediaViewerImageTranslateX = 0;
    mediaViewerImageTranslateY = 0;
    mediaViewerImagePointers = new Map();
    mediaViewerImagePinchDistance = 0;
    mediaViewerImageStartScale = MEDIA_VIEWER_MIN_SCALE;
}

function syncMediaViewerSaveButton() {
    if (!btnMediaViewerSave) return;
    const canSave = !!(mediaViewerActiveMessage && mediaViewerActiveUrl);
    btnMediaViewerSave.classList.toggle('hidden', !canSave);
    btnMediaViewerSave.disabled = !canSave || isManualMediaSaveInProgress;
}

function clampMediaViewerImageTranslate() {
    if (!mediaViewerImageEl || !mediaViewerContent) return;
    const baseWidth = mediaViewerImageEl.clientWidth || 0;
    const baseHeight = mediaViewerImageEl.clientHeight || 0;
    const viewportWidth = mediaViewerContent.clientWidth || 0;
    const viewportHeight = mediaViewerContent.clientHeight || 0;
    if (!baseWidth || !baseHeight || !viewportWidth || !viewportHeight) return;

    const scaledWidth = baseWidth * mediaViewerImageScale;
    const scaledHeight = baseHeight * mediaViewerImageScale;
    const maxTranslateX = Math.max(0, (scaledWidth - viewportWidth) / 2);
    const maxTranslateY = Math.max(0, (scaledHeight - viewportHeight) / 2);
    mediaViewerImageTranslateX = clampValue(mediaViewerImageTranslateX, -maxTranslateX, maxTranslateX);
    mediaViewerImageTranslateY = clampValue(mediaViewerImageTranslateY, -maxTranslateY, maxTranslateY);
}

function applyMediaViewerImageTransform() {
    if (!mediaViewerImageEl) return;
    const isZoomed = mediaViewerImageScale > 1.01;
    mediaViewerImageEl.style.transform = `translate(${mediaViewerImageTranslateX}px, ${mediaViewerImageTranslateY}px) scale(${mediaViewerImageScale})`;
    mediaViewerImageEl.classList.toggle('is-zoomed', isZoomed);
}

function bindMediaViewerImageInteractions(img) {
    if (!img) return;
    resetMediaViewerImageState();
    mediaViewerImageEl = img;
    img.classList.add('media-viewer-zoomable');
    applyMediaViewerImageTransform();

    img.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });

    img.addEventListener('load', () => {
        clampMediaViewerImageTranslate();
        applyMediaViewerImageTransform();
    });

    img.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        mediaViewerImagePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (mediaViewerImagePointers.size === 2) {
            const [a, b] = Array.from(mediaViewerImagePointers.values());
            mediaViewerImagePinchDistance = getPointerDistance(a, b) || 1;
            mediaViewerImageStartScale = mediaViewerImageScale;
        }
        if (mediaViewerImageScale > 1.01) {
            try {
                img.setPointerCapture(event.pointerId);
            } catch (error) {
                // ignore
            }
        }
    });

    img.addEventListener('pointermove', (event) => {
        const previousPoint = mediaViewerImagePointers.get(event.pointerId);
        if (!previousPoint) return;

        const nextPoint = { x: event.clientX, y: event.clientY };
        mediaViewerImagePointers.set(event.pointerId, nextPoint);

        if (mediaViewerImagePointers.size === 2) {
            event.preventDefault();
            const [a, b] = Array.from(mediaViewerImagePointers.values());
            const distance = getPointerDistance(a, b);
            if (distance > 0 && mediaViewerImagePinchDistance > 0) {
                mediaViewerImageScale = clampValue(
                    mediaViewerImageStartScale * (distance / mediaViewerImagePinchDistance),
                    MEDIA_VIEWER_MIN_SCALE,
                    MEDIA_VIEWER_MAX_SCALE
                );
                if (mediaViewerImageScale <= 1.01) {
                    mediaViewerImageScale = MEDIA_VIEWER_MIN_SCALE;
                    mediaViewerImageTranslateX = 0;
                    mediaViewerImageTranslateY = 0;
                }
                clampMediaViewerImageTranslate();
                applyMediaViewerImageTransform();
            }
            return;
        }

        if (mediaViewerImagePointers.size === 1 && mediaViewerImageScale > 1.01) {
            event.preventDefault();
            const deltaX = nextPoint.x - previousPoint.x;
            const deltaY = nextPoint.y - previousPoint.y;
            mediaViewerImageTranslateX += deltaX;
            mediaViewerImageTranslateY += deltaY;
            clampMediaViewerImageTranslate();
            applyMediaViewerImageTransform();
        }
    });

    const onPointerDone = (event) => {
        mediaViewerImagePointers.delete(event.pointerId);
        if (mediaViewerImagePointers.size < 2) {
            mediaViewerImagePinchDistance = 0;
            mediaViewerImageStartScale = mediaViewerImageScale;
        }
        if (mediaViewerImagePointers.size === 0 && mediaViewerImageScale <= 1.01) {
            mediaViewerImageScale = MEDIA_VIEWER_MIN_SCALE;
            mediaViewerImageTranslateX = 0;
            mediaViewerImageTranslateY = 0;
            applyMediaViewerImageTransform();
        }
    };

    img.addEventListener('pointerup', onPointerDone);
    img.addEventListener('pointercancel', onPointerDone);
    img.addEventListener('pointerleave', onPointerDone);

    img.addEventListener('wheel', (event) => {
        event.preventDefault();
        const zoomDelta = event.deltaY < 0 ? 0.2 : -0.2;
        mediaViewerImageScale = clampValue(
            mediaViewerImageScale + zoomDelta,
            MEDIA_VIEWER_MIN_SCALE,
            MEDIA_VIEWER_MAX_SCALE
        );
        if (mediaViewerImageScale <= 1.01) {
            mediaViewerImageScale = MEDIA_VIEWER_MIN_SCALE;
            mediaViewerImageTranslateX = 0;
            mediaViewerImageTranslateY = 0;
        }
        clampMediaViewerImageTranslate();
        applyMediaViewerImageTransform();
    }, { passive: false });

    img.addEventListener('dblclick', (event) => {
        event.preventDefault();
        if (mediaViewerImageScale > 1.01) {
            mediaViewerImageScale = MEDIA_VIEWER_MIN_SCALE;
            mediaViewerImageTranslateX = 0;
            mediaViewerImageTranslateY = 0;
        } else {
            mediaViewerImageScale = 2;
        }
        clampMediaViewerImageTranslate();
        applyMediaViewerImageTransform();
    });
}

function clearMediaViewerContent() {
    if (!mediaViewerContent) return;
    const mediaNodes = mediaViewerContent.querySelectorAll('video, audio, iframe');
    mediaNodes.forEach((node) => {
        try {
            if (node.tagName === 'VIDEO' || node.tagName === 'AUDIO') {
                node.pause();
            }
            if ('src' in node) {
                node.src = '';
            }
        } catch (error) {
            // ignore
        }
    });
    mediaViewerContent.innerHTML = '';
    mediaViewerContent.classList.remove('media-viewer-image-mode');
    resetMediaViewerImageState();
    mediaViewerActiveMessage = null;
    mediaViewerActiveUrl = '';
    isManualMediaSaveInProgress = false;
    syncMediaViewerSaveButton();
}

function closeMediaViewer() {
    if (!mediaViewerModal) return;
    mediaViewerModal.classList.add('hidden');
    document.body.classList.remove('media-viewer-open');
    clearMediaViewerContent();
}

function isPdfFile(msg, resolvedUrl) {
    const fileType = String(msg?.fileType || '').toLowerCase();
    if (fileType.includes('pdf')) return true;
    return /\.pdf($|\?)/i.test(String(resolvedUrl || ''));
}

function isAttachmentImage(msg) {
    const messageType = msg?.type || (msg?.imageUrl ? 'image' : 'text');
    return messageType === 'image';
}

function isAttachmentVideo(msg) {
    const messageType = msg?.type || (msg?.imageUrl ? 'image' : 'text');
    return messageType === 'video';
}

function isAttachmentAudio(msg) {
    const messageType = msg?.type || (msg?.imageUrl ? 'image' : 'text');
    return messageType === 'audio';
}

function buildMediaViewerFallback(fileName, resolvedUrl) {
    const safeName = escapeHtml(fileName || 'Arquivo');
    const safeUrl = escapeHtml(resolvedUrl);
    return `
        <div class="media-viewer-file-fallback">
            <h3>${safeName}</h3>
            <p>Não foi possível visualizar este arquivo diretamente. Toque no botão para abrir na mesma aba.</p>
            <a href="${safeUrl}" target="_self" rel="noopener">Abrir arquivo</a>
        </div>
    `;
}

function openMediaViewer(msg, resolvedUrl) {
    if (!mediaViewerModal || !mediaViewerContent) {
        window.location.href = resolvedUrl;
        return;
    }

    clearMediaViewerContent();
    mediaViewerActiveMessage = msg || null;
    mediaViewerActiveUrl = resolvedUrl || '';
    syncMediaViewerSaveButton();

    if (isAttachmentImage(msg)) {
        mediaViewerContent.classList.add('media-viewer-image-mode');
        const img = document.createElement('img');
        img.src = resolvedUrl;
        img.alt = msg?.fileName || 'Imagem';
        mediaViewerContent.appendChild(img);
        bindMediaViewerImageInteractions(img);
    } else if (isAttachmentVideo(msg)) {
        const video = document.createElement('video');
        video.src = resolvedUrl;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        mediaViewerContent.appendChild(video);
    } else if (isAttachmentAudio(msg)) {
        const audio = document.createElement('audio');
        audio.src = resolvedUrl;
        audio.controls = true;
        audio.autoplay = true;
        mediaViewerContent.appendChild(audio);
    } else if (isPdfFile(msg, resolvedUrl)) {
        const iframe = document.createElement('iframe');
        iframe.src = resolvedUrl;
        iframe.title = msg?.fileName || 'Documento PDF';
        mediaViewerContent.appendChild(iframe);
    } else {
        const iframe = document.createElement('iframe');
        iframe.src = resolvedUrl;
        iframe.title = msg?.fileName || 'Documento';
        mediaViewerContent.appendChild(iframe);
    }

    mediaViewerModal.classList.remove('hidden');
    document.body.classList.add('media-viewer-open');
}

async function openAttachmentInNewTab(msg, preferredUrl = '') {
    const resolvedUrl = await resolveAttachmentUrl(msg, preferredUrl);
    if (!resolvedUrl) {
        alert('Arquivo de mídia indisponível. Peça para o contato reenviar.');
        return;
    }
    openMediaViewer(msg, resolvedUrl);
}

async function saveAttachmentToDevice(msg, preferredUrl = '', options = {}) {
    const resolvedUrl = await resolveAttachmentUrl(msg, preferredUrl);
    if (!resolvedUrl) {
        throw new Error('Arquivo indisponível');
    }

    const allowInteractiveFolderSetup = !!options.allowInteractiveFolderSetup;
    const scope = resolveLocalMediaScope(msg, options.scope);
    const mimeType = msg?.fileType || '';
    const fileName = inferAttachmentFileName(msg, resolvedUrl, mimeType);
    const isLargeFile = Number(msg?.fileSize || 0) >= LARGE_AUTO_DOWNLOAD_BYTES;
    const progressItem = isLargeFile ? createDownloadProgressItem(fileName || 'arquivo') : null;

    try {
        if (isAndroidWebViewRuntime() && !String(resolvedUrl).startsWith('blob:')) {
            triggerDirectUrlDownload(resolvedUrl, fileName, msg, mimeType, { scope });
            if (progressItem) finalizeDownloadItem(progressItem);
            return;
        }

        try {
            const blob = await fetchBlobWithProgress(resolvedUrl, (loaded, total) => {
                if (progressItem) updateDownloadProgressItem(progressItem, loaded, total);
            });
            if (blob && blob.size) {
                await saveAttachmentBlobToCache(msg, blob);
                if (await trySaveBlobToPcLocalFolder(msg, fileName, blob, blob.type || mimeType, allowInteractiveFolderSetup, { scope })) {
                    if (progressItem) finalizeDownloadItem(progressItem);
                    return;
                }
                triggerBlobDownload(blob, fileName, msg, blob.type || mimeType, { scope });
                if (progressItem) finalizeDownloadItem(progressItem);
                return;
            }
        } catch (blobError) {
            // fallback para download direto
        }

        triggerDirectUrlDownload(resolvedUrl, fileName, msg, mimeType, { scope });
        if (progressItem) finalizeDownloadItem(progressItem);
    } catch (error) {
        if (progressItem) markDownloadError(progressItem, 'Falha no download');
        throw error;
    }
}

async function saveCurrentMediaViewerAttachment() {
    if (!mediaViewerActiveMessage || !mediaViewerActiveUrl || isManualMediaSaveInProgress) return;
    isManualMediaSaveInProgress = true;
    syncMediaViewerSaveButton();

    try {
        await saveAttachmentToDevice(mediaViewerActiveMessage, mediaViewerActiveUrl, {
            allowInteractiveFolderSetup: true
        });
    } catch (error) {
        console.warn('Falha ao salvar mídia manualmente.', error);
        alert('Não foi possível salvar esta mídia agora. Tente novamente.');
    } finally {
        isManualMediaSaveInProgress = false;
        syncMediaViewerSaveButton();
    }
}

function shouldAutoDownloadIncomingAttachment(msg) {
    if (!msg || !currentUser) return false;
    if (!autoMediaSaveEnabled) return false;
    if (msg.senderId === currentUser.uid) return false;
    const type = msg.type || (msg.imageUrl ? 'image' : 'text');
    if (!['image', 'video', 'audio', 'file'].includes(type)) return false;
    return !!getAttachmentDownloadUrl(msg);
}

function isAndroidWebViewRuntime() {
    const ua = navigator.userAgent || '';
    return /Android/i.test(ua) && /\bwv\b/i.test(ua);
}

function getDownloadCategory(msg, fileName = '', mimeType = '') {
    const messageType = (msg?.type || '').toLowerCase();
    const mime = String(mimeType || msg?.fileType || '').toLowerCase();
    const extension = String(fileName || '').split('.').pop()?.toLowerCase() || '';

    if (messageType === 'image' || mime.startsWith('image/')) return 'Images';
    if (messageType === 'video' || mime.startsWith('video/')) return 'Video';
    if (messageType === 'audio' || mime.startsWith('audio/')) return 'Audio';

    const imageExt = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif', 'avif']);
    const videoExt = new Set(['mp4', 'webm', 'mov', 'mkv', 'avi', '3gp', 'm4v']);
    const audioExt = new Set(['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus', 'amr', 'weba']);
    if (imageExt.has(extension)) return 'Images';
    if (videoExt.has(extension)) return 'Video';
    if (audioExt.has(extension)) return 'Audio';
    return 'Documents';
}

function resolveLocalMediaScope(msg, explicitScope = '') {
    if (explicitScope === 'sent') return 'sent';
    if (explicitScope === 'received') return 'received';
    if (currentUser && msg?.senderId === currentUser.uid) return 'sent';
    return 'received';
}

function appendDownloadScopeParam(url, scope = '') {
    if (!url || scope !== 'sent') return url;
    try {
        const parsed = new URL(url, window.location.href);
        parsed.searchParams.set(MEDIA_DOWNLOAD_SCOPE_QUERY_PARAM, 'sent');
        return parsed.toString();
    } catch (error) {
        return url;
    }
}

function buildDeviceDownloadPath(msg, fileName, mimeType = '', options = {}) {
    const safeName = sanitizeDownloadFileName(fileName);
    const category = getDownloadCategory(msg, safeName, mimeType);
    const scope = resolveLocalMediaScope(msg, options.scope);
    const scopePrefix = scope === 'sent' ? 'Enviados/' : '';
    return `CameChat/Media/${scopePrefix}${category}/${safeName}`;
}

async function trySaveBlobToPcLocalFolder(msg, fileName, blob, mimeType = '', interactive = false, options = {}) {
    if (!blob || !supportsPcLocalMediaFolder()) return false;

    try {
        const rootHandle = await getPcMediaRootHandle(interactive);
        if (!rootHandle) return false;
        const saved = await writeBlobToPcLocalMediaFolder(rootHandle, msg, fileName, blob, mimeType, options);
        if (saved) {
            setPcLocalMediaFolderReady(true);
            return true;
        }
    } catch (error) {
        console.warn('Falha ao salvar arquivo na pasta local do PC.', error);
        setPcLocalMediaFolderReady(false);
    }

    return false;
}

function triggerBlobDownload(blob, fileName, msg = null, mimeType = '', options = {}) {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = buildDeviceDownloadPath(msg, fileName, mimeType || blob?.type || '', options);
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
}

function triggerDirectUrlDownload(url, fileName, msg = null, mimeType = '', options = {}) {
    const anchor = document.createElement('a');
    const scope = resolveLocalMediaScope(msg, options.scope);
    anchor.href = appendDownloadScopeParam(url, scope);
    anchor.download = buildDeviceDownloadPath(msg, fileName, mimeType, { scope });
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}

async function fetchBlobWithProgress(url, onProgress) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const total = Number(response.headers.get('content-length')) || 0;
    if (!response.body || typeof response.body.getReader !== 'function') {
        const blob = await response.blob();
        if (onProgress) onProgress(blob.size || total, blob.size || total);
        return blob;
    }

    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
            chunks.push(value);
            loaded += value.length;
            if (onProgress) onProgress(loaded, total);
        }
    }

    return new Blob(chunks, {
        type: response.headers.get('content-type') || 'application/octet-stream'
    });
}

async function autoDownloadIncomingAttachment(conversationId, msg) {
    if (!conversationId || !msg?.id) return;
    if (!shouldAutoDownloadIncomingAttachment(msg)) return;

    const key = `${conversationId}:${msg.id}`;
    if (autoDownloadedAttachmentKeys.has(key) || autoDownloadingAttachmentKeys.has(key)) {
        return;
    }

    const candidates = getAttachmentDownloadCandidates(msg);
    if (!candidates.length) return;

    autoDownloadingAttachmentKeys.add(key);
    const isLargeFile = Number(msg.fileSize || 0) >= LARGE_AUTO_DOWNLOAD_BYTES;
    const progressItem = isLargeFile ? createDownloadProgressItem(msg.fileName || 'arquivo') : null;

    try {
        if (isAndroidWebViewRuntime()) {
            const resolvedUrl = await resolveAttachmentUrl(msg);
            if (!resolvedUrl) {
                throw new Error('Arquivo indisponível');
            }
            const fileName = inferAttachmentFileName(msg, resolvedUrl, msg?.fileType || '');
            triggerDirectUrlDownload(resolvedUrl, fileName, msg, msg?.fileType || '', { scope: 'received' });
            autoDownloadedAttachmentKeys.add(key);
            if (progressItem) finalizeDownloadItem(progressItem);
            return;
        }

        let resolvedBlob = null;
        let resolvedUrl = '';

        for (const candidate of candidates) {
            try {
                const blob = await fetchBlobWithProgress(candidate, (loaded, total) => {
                    if (progressItem) updateDownloadProgressItem(progressItem, loaded, total);
                });
                if (!blob || !blob.size) continue;
                resolvedBlob = blob;
                resolvedUrl = candidate;
                break;
            } catch (candidateError) {
                // tenta o próximo candidato
            }
        }

        if (!resolvedBlob || !resolvedUrl) {
            throw new Error('Arquivo indisponível');
        }

        const fileName = inferAttachmentFileName(msg, resolvedUrl, resolvedBlob.type);
        await saveAttachmentBlobToCache(msg, resolvedBlob);
        const savedToPcLocalFolder = await trySaveBlobToPcLocalFolder(msg, fileName, resolvedBlob, resolvedBlob.type, false, { scope: 'received' });
        if (savedToPcLocalFolder) {
            autoDownloadedAttachmentKeys.add(key);
            if (progressItem) finalizeDownloadItem(progressItem);
            return;
        }
        triggerBlobDownload(resolvedBlob, fileName, msg, resolvedBlob.type, { scope: 'received' });
        autoDownloadedAttachmentKeys.add(key);
        if (progressItem) finalizeDownloadItem(progressItem);
    } catch (error) {
        const fallbackUrl = candidates[0];
        const fallbackName = inferAttachmentFileName(msg, fallbackUrl, '');
        try {
            triggerDirectUrlDownload(fallbackUrl, fallbackName, msg, msg?.fileType || '', { scope: 'received' });
            autoDownloadedAttachmentKeys.add(key);
            if (progressItem) finalizeDownloadItem(progressItem);
        } catch (fallbackError) {
            console.warn('Falha ao baixar mídia automaticamente.', error || fallbackError);
            if (progressItem) markDownloadError(progressItem, 'Falha no download');
        }
    } finally {
        autoDownloadingAttachmentKeys.delete(key);
    }
}

async function autoSaveOutgoingAttachment(msg, file) {
    if (!msg?.id || !file || !autoMediaSaveEnabled) return false;

    const mimeType = String(file.type || msg.fileType || 'application/octet-stream');
    const fileName = sanitizeDownloadFileName(file.name || msg.fileName || inferAttachmentFileName(msg, msg.fileUrl || msg.imageUrl || '', mimeType));

    try {
        await saveAttachmentBlobToCache(msg, file);

        if (await trySaveBlobToPcLocalFolder(msg, fileName, file, mimeType, false, { scope: 'sent' })) {
            return true;
        }

        if (isAndroidWebViewRuntime()) {
            const resolvedUrl = await resolveAttachmentUrl(msg, msg.fileUrl || msg.imageUrl || '');
            if (!resolvedUrl) return false;
            triggerDirectUrlDownload(resolvedUrl, fileName, msg, mimeType, { scope: 'sent' });
            return true;
        }

        triggerBlobDownload(file, fileName, msg, mimeType, { scope: 'sent' });
        return true;
    } catch (error) {
        console.warn('Falha ao salvar mídia enviada localmente.', error);
        return false;
    }
}

function uploadChatFileViaBackendWithProgress(file, formData, apiUrl, options = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const item = createUploadProgressItem(file.name || 'arquivo');
        xhr.timeout = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 60000;
        xhr.open('POST', apiUrl, true);
        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable) return;
            const percent = Math.round((event.loaded / event.total) * 100);
            updateUploadProgressItem(item, percent, `${percent}%`);
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                updateUploadProgressItem(item, 100, 'Processando');
                resolve({
                    ok: true,
                    status: xhr.status,
                    json: async () => JSON.parse(xhr.responseText || '{}'),
                    text: async () => xhr.responseText || ''
                });
                finalizeUploadItem(item);
            } else {
                markUploadError(item, xhr.responseText || 'Falha no upload');
                resolve({
                    ok: false,
                    status: xhr.status,
                    text: async () => xhr.responseText || ''
                });
            }
        };
        xhr.onerror = () => {
            markUploadError(item, 'Falha na conexão');
            reject(new Error('Não foi possível conectar ao backend de upload.'));
        };
        xhr.ontimeout = () => {
            markUploadError(item, 'Tempo esgotado');
            reject(new Error('Tempo esgotado ao enviar arquivo.'));
        };
        xhr.onabort = () => {
            markUploadError(item, 'Upload cancelado');
            reject(new Error('Upload cancelado.'));
        };
        xhr.send(formData);
    });
}

// Login com email/senha
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        await auth.signInWithEmailAndPassword(email, password);
        loginForm.reset();
        if (rememberMe) rememberMe.checked = true;
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
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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
    if (cameraModal && e.target === cameraModal) {
        closeCameraModal();
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

// ========== ESTADO DE AUTENTICACAO ==========
auth.onAuthStateChanged(async (user) => {
    if (user) {
        resetChatUI();
        autoDownloadedAttachmentKeys = new Set();
        autoDownloadingAttachmentKeys = new Set();
        currentUser = user;
        authContainer.classList.add('hidden');
        app.classList.remove('hidden');
        setLogoutButtonVisible(false);

        const fallbackRole = await resolveRoleForSignup('user_chat');
        let ensuredProfile = null;
        try {
            ensuredProfile = await ensureUserDocument(user, {
                name: user.displayName || '',
                email: user.email || '',
                role: fallbackRole,
                photoURL: user.photoURL || null
            });
        } catch (error) {
            console.warn('Falha ao preparar documento do usuário. Continuando com dados básicos.', error);
        }
        currentUserProfile = ensuredProfile || {
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            userTag: getUserTagValue({ uid: user.uid, name: user.displayName || '' }),
            userTagLower: normalizeUserTagInput(getUserTagValue({ uid: user.uid, name: user.displayName || '' })),
            role: fallbackRole,
            photoURL: user.photoURL || null,
            photoData: null,
            friends: [],
            blocked: [],
            showOnlineStatus: showOnlineStatusEnabled
        };
        currentUserRole = currentUserProfile.role || fallbackRole || 'user_chat';
        loadMutedFriendsForCurrentUser();
        if (typeof currentUserProfile.showOnlineStatus === 'boolean') {
            applyOnlineStatusVisibilitySetting(currentUserProfile.showOnlineStatus, true, false);
        } else {
            applyOnlineStatusVisibilitySetting(showOnlineStatusEnabled, true, true);
        }

        // Atualizar interface do usuário
        applyProfilePhoto(
            userPhoto,
            currentUserProfile,
            'https://via.placeholder.com/45/002776/ffffff?text=User',
            user.photoURL || ''
        );
        userName.textContent = currentUserProfile.name || user.displayName || 'Usuário';
        userStatus.textContent = 'Online';
        renderCurrentUserIdentity(currentUserProfile);
        setOnlineStatusClass(userStatus, true);
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
        finishInitialBootstrap('app');
        
        // Atualizar lastSeen ao fechar a página
        window.addEventListener('beforeunload', () => {
            updateUserOnlineStatus(false);
        });
    } else {
        // Usuário deslogado
        autoDownloadedAttachmentKeys = new Set();
        autoDownloadingAttachmentKeys = new Set();
        currentUser = null;
        currentUserProfile = null;
        currentUserRole = 'user_chat';
        if (userHandle) userHandle.textContent = '';
        if (profileHandle) profileHandle.textContent = '';
        setOnlineStatusClass(userStatus, false);
        authContainer.classList.remove('hidden');
        app.classList.add('hidden');
        setLogoutButtonVisible(false);
        updateRoleBadge('user_chat');
        setAdminAccess(false);
        updateRegisterRoleAvailability();
        resetRegisterForm();
        selectedFriendData = null;
        resetChatUI();
        
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
        currentConversationId = null;
        currentConversationMessages = [];
        currentFriends = [];
        allUsersCache = [];
        mutedFriendIds = new Set();
        selectedFriendIds = new Set();
        isFriendSelectionMode = false;
        updateFriendSelectionUI();
        if (btnEmoji) btnEmoji.disabled = true;
        if (btnVoice) btnVoice.disabled = true;
        if (btnCameraQuick) btnCameraQuick.disabled = true;
        if (btnVoice) btnVoice.disabled = true;
        if (btnCameraQuick) btnCameraQuick.disabled = true;
        if (btnAttach) btnAttach.disabled = true;
        if (btnSend) btnSend.disabled = true;
        if (messageInput) messageInput.disabled = true;
        if (btnCall) btnCall.disabled = true;
        if (btnVideoCall) btnVideoCall.disabled = true;
        setSidebarOpen(false);
        resetCallState();
        finishInitialBootstrap('auth');
    }
});

// Atualizar status online do usuário
async function updateUserOnlineStatus(online) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).set({
            online: online,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Erro ao atualizar status:', error?.code || '', error?.message || error);
    }
}

// Configurar heartbeat para manter status online
function setupOnlineStatus() {
    // Atualizar a cada 30 segundos
    onlineStatusInterval = setInterval(() => {
        updateUserOnlineStatus(true);
    }, ONLINE_HEARTBEAT_MS);
}

window.addEventListener('online', () => {
    if (currentUser) updateUserOnlineStatus(true);
});

window.addEventListener('offline', () => {
    if (currentUser) updateUserOnlineStatus(false);
});

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
            if (typeof data.showOnlineStatus === 'boolean' && data.showOnlineStatus !== showOnlineStatusEnabled) {
                applyOnlineStatusVisibilitySetting(data.showOnlineStatus, true, false);
            }

            if (data.name) userName.textContent = data.name;
            renderCurrentUserIdentity(currentUserProfile);
            applyProfilePhoto(
                userPhoto,
                data,
                'https://via.placeholder.com/45/002776/ffffff?text=User',
                currentUser?.photoURL || ''
            );

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
    return type === 'video' ? 'vídeo' : 'voz';
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
    if (callMediaContainer) callMediaContainer.classList.toggle('hidden', !isVideo);
    if (callUserPhoto) callUserPhoto.classList.toggle('hidden', isVideo);
    if (callModal) callModal.classList.toggle('video-call', isVideo);
    if (!isVideo) {
        isVideoSwapped = false;
    }
    applyVideoSwapState();
}

function stopRingtone() {
    if (ringtoneInterval) clearInterval(ringtoneInterval);
    ringtoneInterval = null;
    if (ringtoneContext) {
        ringtoneContext.close();
        ringtoneContext = null;
    }
}

function clearCallCountdown() {
    if (callCountdownInterval) {
        clearInterval(callCountdownInterval);
    }
    callCountdownInterval = null;
    callCountdownRemaining = 0;
    if (callStatus && callPhase === 'outgoing' && callCountdownBaseStatus) {
        callStatus.textContent = callCountdownBaseStatus;
    }
    callCountdownBaseStatus = '';
    if (callCountdown) {
        callCountdown.classList.add('hidden');
        callCountdown.textContent = '';
    }
}

function startCallCountdown(seconds, baseStatus = 'Aguardando resposta') {
    clearCallCountdown();
    callCountdownRemaining = seconds;
    callCountdownBaseStatus = baseStatus;
    if (callCountdown) {
        callCountdown.textContent = `${callCountdownRemaining}s`;
        callCountdown.classList.remove('hidden');
    }
    if (callStatus && baseStatus) {
        callStatus.textContent = `${baseStatus} (${callCountdownRemaining}s)`;
    }
    callCountdownInterval = setInterval(() => {
        callCountdownRemaining -= 1;
        if (callCountdownRemaining <= 0) {
            clearCallCountdown();
            return;
        }
        if (callCountdown) {
            callCountdown.textContent = `${callCountdownRemaining}s`;
        }
        if (callStatus && baseStatus) {
            callStatus.textContent = `${baseStatus} (${callCountdownRemaining}s)`;
        }
    }, 1000);
}

function showCallToast(message) {
    if (!callToast) return;
    callToast.textContent = message;
    callToast.classList.remove('hidden');
}

function moveCallMedia(target) {
    if (!callMedia || !target) return;
    if (callMedia.parentElement !== target) {
        target.appendChild(callMedia);
    }
}

function applyVideoSwapState() {
    if (!callMedia) return;
    callMedia.classList.toggle('swap', isVideoSwapped);
    const currentMainVideo = isVideoSwapped ? localVideo : remoteVideo;
    resetVideoOverlayPosition(currentMainVideo);
}

function toggleVideoSwap() {
    if (currentCallType !== 'video' || callPhase !== 'active') return;
    if (!callMedia || callMedia.classList.contains('hidden')) return;
    if (callPreviewDragging) {
        stopCallPreviewDrag();
    }
    isVideoSwapped = !isVideoSwapped;
    applyVideoSwapState();
}

function setProximityOverlayVisible(isVisible) {
    if (!proximityOverlay) return;
    proximityOverlay.classList.toggle('hidden', !isVisible);
}

function isMobileDevice() {
    if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) return true;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function handleProximityState(isNear) {
    if (!proximityActive) return;
    setProximityOverlayVisible(isNear);
}

function startProximitySensor() {
    if (proximityActive) return;
    proximityActive = true;

    if ('ProximitySensor' in window) {
        try {
            proximitySensor = new ProximitySensor();
            proximitySensor.addEventListener('reading', () => {
                const maxDistance = proximitySensor.max || 0;
                const near = maxDistance ? proximitySensor.distance < maxDistance : proximitySensor.distance === 0;
                handleProximityState(near);
            });
            proximitySensor.addEventListener('error', () => {
                // ignore
            });
            proximitySensor.start();
            return;
        } catch (error) {
            proximitySensor = null;
        }
    }

    if ('ondeviceproximity' in window) {
        deviceProximityHandler = (event) => {
            if (!event) return;
            handleProximityState(event.value < event.max);
        };
        window.addEventListener('deviceproximity', deviceProximityHandler);
        return;
    }

    if ('onuserproximity' in window) {
        userProximityHandler = (event) => {
            handleProximityState(!!event.near);
        };
        window.addEventListener('userproximity', userProximityHandler);
    }
}

function stopProximitySensor() {
    proximityActive = false;
    setProximityOverlayVisible(false);
    if (proximitySensor) {
        try {
            proximitySensor.stop();
        } catch (error) {
            // ignore
        }
        proximitySensor = null;
    }
    if (deviceProximityHandler) {
        window.removeEventListener('deviceproximity', deviceProximityHandler);
        deviceProximityHandler = null;
    }
    if (userProximityHandler) {
        window.removeEventListener('userproximity', userProximityHandler);
        userProximityHandler = null;
    }
}

function updateProximityHandling() {
    const isAudioCall = callPhase === 'active' && (currentCallType === 'audio' || currentCallType === null);
    const shouldEnable = isAudioCall && isMobileDevice();
    if (!shouldEnable) {
        stopProximitySensor();
        return;
    }
    startProximitySensor();
}

async function resolveSpeakerOutputDevice() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return null;
    const devices = await navigator.mediaDevices.enumerateDevices();
    const outputs = devices.filter(device => device.kind === 'audiooutput');
    if (!outputs.length) return null;
    const speaker = outputs.find(device => /speaker|alto|viva|loud|speakerphone/i.test(device.label));
    return speaker?.deviceId || outputs[0].deviceId;
}

async function applySpeakerOutput(enable) {
    if (!remoteAudio) return;
    if (typeof remoteAudio.setSinkId !== 'function') {
        remoteAudio.volume = enable ? 1 : 0.7;
        return;
    }
    let targetId = 'default';
    if (enable) {
        if (!speakerOutputDeviceId && navigator.mediaDevices?.selectAudioOutput) {
            try {
                const selection = await navigator.mediaDevices.selectAudioOutput();
                speakerOutputDeviceId = selection?.deviceId || null;
            } catch (error) {
                speakerOutputDeviceId = null;
            }
        }
        if (!speakerOutputDeviceId) {
            speakerOutputDeviceId = await resolveSpeakerOutputDevice();
        }
        if (speakerOutputDeviceId) {
            targetId = speakerOutputDeviceId;
        }
    }
    try {
        await remoteAudio.setSinkId(targetId);
    } catch (error) {
        // ignore if unsupported
    }
}

async function toggleSpeakerphone() {
    isSpeakerOn = !isSpeakerOn;
    await applySpeakerOutput(isSpeakerOn);
    updateCallControls();
}

function getActiveCallFriend() {
    if (selectedFriendData) return selectedFriendData;
    if (!activeCallData || !currentUser) return null;
    const isCaller = activeCallData.callerId === currentUser.uid;
    const friendId = isCaller ? activeCallData.calleeId : activeCallData.callerId;
    const friendName = isCaller ? activeCallData.calleeName : activeCallData.callerName;
    const friendPhotoURL = isCaller ? activeCallData.calleePhotoURL : activeCallData.callerPhotoURL;
    const friendPhotoData = isCaller ? activeCallData.calleePhotoData : activeCallData.callerPhotoData;
    return {
        uid: friendId,
        name: friendName,
        photoURL: friendPhotoURL || null,
        photoData: friendPhotoData || null
    };
}

function getCurrentCallType() {
    if (currentCallType) return currentCallType;
    if (localStream && localStream.getVideoTracks().length) return 'video';
    return 'audio';
}

async function addLocalVideoTrack() {
    if (localStream && localStream.getVideoTracks().length) return true;
    let cameraStream = null;
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (error) {
        return false;
    }
    const track = cameraStream.getVideoTracks()[0];
    if (!track) return false;
    if (!localStream) {
        localStream = new MediaStream();
        if (localAudio) localAudio.srcObject = localStream;
    }
    track.enabled = true;
    isVideoMuted = false;
    localStream.addTrack(track);
    if (peerConnection) {
        peerConnection.addTrack(track, localStream);
    }
    if (localVideo) localVideo.srcObject = localStream;
    return true;
}

function removeLocalVideoTrack() {
    if (!localStream) return;
    localStream.getVideoTracks().forEach(track => {
        track.stop();
        localStream.removeTrack(track);
    });
    isVideoMuted = false;
    if (peerConnection) {
        peerConnection.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'video') {
                peerConnection.removeTrack(sender);
            }
        });
    }
    if (localVideo) localVideo.srcObject = localStream;
}

async function prepareLocalTracksForType(targetType) {
    if (targetType === 'video') {
        return addLocalVideoTrack();
    }
    removeLocalVideoTrack();
    return true;
}

function clearRenegotiationTimeout() {
    if (renegotiationTimeout) {
        clearTimeout(renegotiationTimeout);
    }
    renegotiationTimeout = null;
}

function setRenegotiationUI(isActive, message) {
    if (!callRenegotiation) return;
    const textEl = callRenegotiation.querySelector('.renegotiation-text');
    if (textEl && message) {
        textEl.textContent = message;
    }
    callRenegotiation.classList.toggle('hidden', !isActive);
}

async function fallbackRestartCall(targetType, friend) {
    if (renegotiationFallbackUsed) return;
    renegotiationFallbackUsed = true;
    suppressCallReload = true;
    setRenegotiationUI(true, 'Reiniciando a chamada...');
    await endCall('ended');
    selectedFriendData = friend || selectedFriendData;
    setTimeout(() => {
        startCall(targetType);
    }, 400);
}

async function handleRenegotiationOffer(renegotiate) {
    if (!renegotiate || !renegotiate.offer || !callDocRef || !peerConnection) return;
    if (!currentUser || renegotiate.from === currentUser.uid) return;
    if (renegotiate.id && renegotiate.id === lastRenegotiationId) return;
    if (callPhase !== 'active') return;

    lastRenegotiationId = renegotiate.id || null;
    renegotiationInProgress = true;

    const targetType = renegotiate.type === 'video' ? 'video' : 'audio';
    const friend = getActiveCallFriend();
    setRenegotiationUI(true, targetType === 'video' ? 'Mudando para chamada de vídeo...' : 'Mudando para chamada de voz...');
    updateCallModal({
        title: targetType === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
        status: targetType === 'video' ? 'Mudando para chamada de vídeo...' : 'Mudando para chamada de voz...',
        user: friend || selectedFriendData
    });

    const ready = await prepareLocalTracksForType(targetType);
    if (!ready) {
        renegotiationInProgress = false;
        alert('Não foi possível acessar a câmera.');
        setRenegotiationUI(false);
        return;
    }

    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(renegotiate.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        await callDocRef.set({
            type: targetType,
            renegotiate: {
                ...renegotiate,
                answer: {
                    type: answer.type,
                    sdp: answer.sdp
                },
                respondedAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        currentCallType = targetType;
        updateCallMediaVisibility(targetType);
        updateCallIndicator('active', targetType);
        updateCallModal({
            title: targetType === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
            status: 'Conectado',
            user: friend || selectedFriendData
        });
        updateCallControls();
        enterCallFullscreen();
    } catch (error) {
        console.warn('Falha ao renegociar chamada.', error);
        fallbackRestartCall(targetType, friend);
    } finally {
        renegotiationInProgress = false;
        setRenegotiationUI(false);
    }
}

async function handleRenegotiationAnswer(renegotiate) {
    if (!renegotiate || !renegotiate.answer || !peerConnection) return;
    if (!pendingRenegotiationId || renegotiate.id !== pendingRenegotiationId) return;
    pendingRenegotiationId = null;
    clearRenegotiationTimeout();
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(renegotiate.answer));
    } catch (error) {
        console.warn('Falha ao aplicar resposta de renegociação.', error);
    }
    const targetType = renegotiate.type === 'video' ? 'video' : 'audio';
    currentCallType = targetType;
    updateCallMediaVisibility(targetType);
    updateCallIndicator('active', targetType);
    updateCallModal({
        title: targetType === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
        status: 'Conectado',
        user: getActiveCallFriend() || selectedFriendData
    });
    updateCallControls();
    enterCallFullscreen();
    renegotiationInProgress = false;
    setRenegotiationUI(false);
}

function handleRenegotiationSnapshot(data) {
    if (!data || !data.renegotiate) return;
    const renegotiate = data.renegotiate;
    if (renegotiate.offer && renegotiate.from && renegotiate.from !== currentUser?.uid) {
        handleRenegotiationOffer(renegotiate);
    }
    if (renegotiate.answer && renegotiate.from && renegotiate.from === currentUser?.uid) {
        handleRenegotiationAnswer(renegotiate);
    }
}

async function switchCallType(targetType) {
    if (callPhase !== 'active') return;
    if (targetType !== 'audio' && targetType !== 'video') return;
    if (!callDocRef || !peerConnection) return;
    if (renegotiationInProgress) return;

    const currentType = getCurrentCallType();
    if (currentType === targetType) return;

    const confirmMessage = targetType === 'video'
        ? 'Deseja mudar para chamada de vídeo?'
        : 'Deseja mudar para chamada de voz?';
    if (!confirm(confirmMessage)) return;

    renegotiationInProgress = true;
    renegotiationFallbackUsed = false;
    const friend = getActiveCallFriend();
    setRenegotiationUI(true, targetType === 'video' ? 'Mudando para chamada de vídeo...' : 'Mudando para chamada de voz...');
    updateCallModal({
        title: targetType === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
        status: targetType === 'video' ? 'Mudando para chamada de vídeo...' : 'Mudando para chamada de voz...',
        user: friend || selectedFriendData
    });

    const ready = await prepareLocalTracksForType(targetType);
    if (!ready) {
        renegotiationInProgress = false;
        alert('Não foi possível acessar a câmera.');
        setRenegotiationUI(false);
        return;
    }

    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        const renegotiationId = `${currentUser?.uid || 'user'}_${Date.now()}`;
        pendingRenegotiationId = renegotiationId;
        pendingRenegotiationTarget = targetType;
        await callDocRef.set({
            type: targetType,
            renegotiate: {
                id: renegotiationId,
                from: currentUser?.uid || '',
                type: targetType,
                offer: {
                    type: offer.type,
                    sdp: offer.sdp
                },
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        clearRenegotiationTimeout();
        renegotiationTimeout = setTimeout(() => {
            if (pendingRenegotiationId === renegotiationId) {
                pendingRenegotiationId = null;
                renegotiationInProgress = false;
                setRenegotiationUI(false);
                updateCallModal({
                    title: currentType === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
                    status: 'Não foi possível mudar a chamada.',
                    user: friend || selectedFriendData
                });
                updateCallControls();
                fallbackRestartCall(targetType, friend);
            }
        }, 15000);
    } catch (error) {
        renegotiationInProgress = false;
        console.warn('Falha ao renegociar chamada.', error);
        alert('Não foi possível mudar o tipo da chamada.');
        setRenegotiationUI(false);
        fallbackRestartCall(targetType, friend);
    }
}

function updateCallControls() {
    const hasAudio = !!(localStream && localStream.getAudioTracks().length);
    const hasVideo = !!(localStream && localStream.getVideoTracks().length);
    const isVideoCall = currentCallType === 'video' || hasVideo;
    const isActiveCall = callPhase === 'active';
    const showControls = isActiveCall;
    if (btnCallMute) {
        btnCallMute.classList.toggle('hidden', !showControls);
        btnCallMute.disabled = !hasAudio;
        btnCallMute.innerHTML = isAudioMuted ? CALL_ICON_MIC_OFF : CALL_ICON_MIC_ON;
        btnCallMute.title = isAudioMuted ? 'Ativar microfone' : 'Desativar microfone';
        btnCallMute.setAttribute('aria-pressed', String(isAudioMuted));
        btnCallMute.setAttribute('aria-label', isAudioMuted ? 'Ativar microfone' : 'Desativar microfone');
    }
    if (btnCallVideoToggle) {
        btnCallVideoToggle.classList.toggle('hidden', !showControls || !isVideoCall);
        btnCallVideoToggle.disabled = !hasVideo || !isVideoCall;
        btnCallVideoToggle.innerHTML = isVideoMuted ? CALL_ICON_VIDEO_OFF : CALL_ICON_VIDEO_ON;
        btnCallVideoToggle.title = isVideoMuted ? 'Ativar vídeo' : 'Desativar vídeo';
        btnCallVideoToggle.setAttribute('aria-pressed', String(isVideoMuted));
        btnCallVideoToggle.setAttribute('aria-label', isVideoMuted ? 'Ativar vídeo' : 'Desativar vídeo');
    }
    if (btnCallSpeaker) {
        btnCallSpeaker.classList.toggle('hidden', !showControls);
        btnCallSpeaker.disabled = !remoteStream || remoteStream.getAudioTracks().length === 0;
        btnCallSpeaker.innerHTML = isSpeakerOn ? CALL_ICON_SPEAKER_ON : CALL_ICON_SPEAKER_OFF;
        btnCallSpeaker.title = isSpeakerOn ? 'Desativar viva-voz' : 'Ativar viva-voz';
        btnCallSpeaker.setAttribute('aria-pressed', String(isSpeakerOn));
        btnCallSpeaker.setAttribute('aria-label', isSpeakerOn ? 'Desativar viva-voz' : 'Ativar viva-voz');
    }
    if (btnCallSwitchVideo) {
        btnCallSwitchVideo.classList.toggle('hidden', !showControls || isVideoCall);
        btnCallSwitchVideo.disabled = isVideoCall;
        btnCallSwitchVideo.innerHTML = CALL_ICON_SWITCH_VIDEO;
    }
    if (btnCallSwitchAudio) {
        btnCallSwitchAudio.classList.toggle('hidden', !showControls || !isVideoCall);
        btnCallSwitchAudio.disabled = !isVideoCall;
        btnCallSwitchAudio.innerHTML = CALL_ICON_SWITCH_AUDIO;
    }
    if (btnCallMinimize) {
        btnCallMinimize.classList.toggle('hidden', !showControls || !isVideoCall || isCallMinimized);
        btnCallMinimize.innerHTML = CALL_ICON_MINIMIZE;
    }
    if (renegotiationInProgress) {
        if (btnCallSwitchVideo) btnCallSwitchVideo.disabled = true;
        if (btnCallSwitchAudio) btnCallSwitchAudio.disabled = true;
        if (btnCallVideoToggle) btnCallVideoToggle.disabled = true;
    }
    updateProximityHandling();
}

function toggleLocalAudio() {
    if (!localStream) return;
    const tracks = localStream.getAudioTracks();
    if (!tracks.length) return;
    const enable = isAudioMuted;
    tracks.forEach(track => {
        track.enabled = enable;
    });
    isAudioMuted = !enable;
    updateCallControls();
}

function toggleLocalVideo() {
    if (!localStream) return;
    const tracks = localStream.getVideoTracks();
    if (!tracks.length) return;
    const enable = isVideoMuted;
    tracks.forEach(track => {
        track.enabled = enable;
    });
    isVideoMuted = !enable;
    updateCallControls();
}

async function enterCallFullscreen() {
    if (!callModal) return;
    callModal.classList.add('fullscreen');
    if (document.fullscreenElement) return;
    if (!callModal.classList.contains('show')) {
        callModal.classList.add('show');
    }
    if (callModal.requestFullscreen) {
        try {
            await callModal.requestFullscreen();
        } catch (error) {
            // ignore if blocked
        }
    }
}

async function exitCallFullscreen() {
    if (document.fullscreenElement) {
        try {
            await document.exitFullscreen();
        } catch (error) {
            // ignore
        }
    }
    if (callModal) callModal.classList.remove('fullscreen');
}

function minimizeCall() {
    if (currentCallType !== 'video' || callPhase !== 'active') return;
    if (!callMini || !callMiniBody) return;
    isCallMinimized = true;
    exitCallFullscreen();
    moveCallMedia(callMiniBody);
    if (callModal) callModal.classList.remove('show');
    callMini.classList.remove('hidden');
    updateCallControls();
}

function restoreCall() {
    if (!callMini) return;
    isCallMinimized = false;
    callMini.classList.add('hidden');
    if (callMediaContainer) moveCallMedia(callMediaContainer);
    if (callModal) callModal.classList.add('show');
    if (currentCallType === 'video' && callPhase === 'active') {
        enterCallFullscreen();
    }
    updateCallControls();
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function resetVideoOverlayPosition(videoElement) {
    if (!videoElement) return;
    videoElement.style.left = '';
    videoElement.style.top = '';
    videoElement.style.right = '';
    videoElement.style.bottom = '';
}

function getCurrentMiniPreviewVideo() {
    if (currentCallType !== 'video' || callPhase !== 'active') return null;
    if (!callMedia || callMedia.classList.contains('hidden')) return null;
    return isVideoSwapped ? remoteVideo : localVideo;
}

function startCallMiniDrag(clientX, clientY) {
    if (!callMini || callMini.classList.contains('hidden')) return;
    const rect = callMini.getBoundingClientRect();
    callMini.style.left = `${rect.left}px`;
    callMini.style.top = `${rect.top}px`;
    callMini.style.right = 'auto';
    callMini.style.bottom = 'auto';
    callMiniDragging = true;
    callMiniDragMoved = false;
    callMiniStartX = clientX;
    callMiniStartY = clientY;
    callMiniOrigX = rect.left;
    callMiniOrigY = rect.top;
}

function moveCallMini(clientX, clientY) {
    if (!callMiniDragging || !callMini) return;
    const deltaX = clientX - callMiniStartX;
    const deltaY = clientY - callMiniStartY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        callMiniDragMoved = true;
    }
    const maxX = window.innerWidth - callMini.offsetWidth;
    const maxY = window.innerHeight - callMini.offsetHeight;
    const nextX = clamp(callMiniOrigX + deltaX, 8, Math.max(8, maxX - 8));
    const nextY = clamp(callMiniOrigY + deltaY, 8, Math.max(8, maxY - 8));
    callMini.style.left = `${nextX}px`;
    callMini.style.top = `${nextY}px`;
}

function stopCallMiniDrag() {
    if (callMiniDragMoved) {
        suppressVideoSwapUntil = Date.now() + 250;
    }
    callMiniDragMoved = false;
    callMiniDragging = false;
    callMiniDragPointerId = null;
    callMiniDragTouchId = null;
}

function startCallPreviewDrag(videoElement, clientX, clientY) {
    if (!videoElement || !callMedia || callMedia.classList.contains('hidden')) return;
    const miniPreview = getCurrentMiniPreviewVideo();
    if (miniPreview !== videoElement) return;

    const mediaRect = callMedia.getBoundingClientRect();
    const previewRect = videoElement.getBoundingClientRect();
    const startLeft = previewRect.left - mediaRect.left;
    const startTop = previewRect.top - mediaRect.top;

    videoElement.style.left = `${startLeft}px`;
    videoElement.style.top = `${startTop}px`;
    videoElement.style.right = 'auto';
    videoElement.style.bottom = 'auto';

    callPreviewDragging = true;
    callPreviewDragMoved = false;
    callPreviewTarget = videoElement;
    callPreviewStartX = clientX;
    callPreviewStartY = clientY;
    callPreviewOrigX = startLeft;
    callPreviewOrigY = startTop;
}

function moveCallPreviewDrag(clientX, clientY) {
    if (!callPreviewDragging || !callPreviewTarget || !callMedia) return;

    const deltaX = clientX - callPreviewStartX;
    const deltaY = clientY - callPreviewStartY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        callPreviewDragMoved = true;
    }

    const maxX = callMedia.clientWidth - callPreviewTarget.offsetWidth;
    const maxY = callMedia.clientHeight - callPreviewTarget.offsetHeight;
    const nextX = clamp(callPreviewOrigX + deltaX, 8, Math.max(8, maxX - 8));
    const nextY = clamp(callPreviewOrigY + deltaY, 8, Math.max(8, maxY - 8));

    callPreviewTarget.style.left = `${nextX}px`;
    callPreviewTarget.style.top = `${nextY}px`;
}

function stopCallPreviewDrag() {
    if (callPreviewDragMoved) {
        suppressVideoSwapUntil = Date.now() + 250;
    }
    callPreviewDragMoved = false;
    callPreviewDragging = false;
    callPreviewDragPointerId = null;
    callPreviewDragTouchId = null;
    callPreviewTarget = null;
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
        console.warn('Não foi possível tocar o toque da chamada.', error);
    }
}

function resetCallState() {
    const shouldReloadAfterCall = callPhase === 'active' && !suppressCallReload;

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
    if (remoteAudio) remoteAudio.volume = 1;

    callDocRef = null;
    currentCallId = null;
    currentCallRole = null;
    activeCallData = null;
    callPhase = null;
    currentCallType = null;

    if (callTimeout) clearTimeout(callTimeout);
    callTimeout = null;
    setRenegotiationUI(false);

    if (callModal) callModal.classList.remove('show');

    if (btnCall) {
        btnCall.disabled = !selectedFriendData || isFriendBlocked(selectedFriendData.uid);
    }
    if (btnVideoCall) {
        btnVideoCall.disabled = !selectedFriendData || isFriendBlocked(selectedFriendData.uid);
    }

    if (callMedia) callMedia.classList.add('hidden');
    if (callUserPhoto) callUserPhoto.classList.remove('hidden');
    if (callMini) callMini.classList.add('hidden');
    if (callMediaContainer) moveCallMedia(callMediaContainer);
    exitCallFullscreen();
    stopCallMiniDrag();
    stopCallPreviewDrag();
    resetVideoOverlayPosition(localVideo);
    resetVideoOverlayPosition(remoteVideo);
    if (callMini) {
        callMini.style.left = '';
        callMini.style.top = '';
        callMini.style.right = '';
        callMini.style.bottom = '';
    }
    isAudioMuted = false;
    isVideoMuted = false;
    isCallMinimized = false;
    isVideoSwapped = false;
    isSpeakerOn = false;
    suppressCallReload = false;
    renegotiationInProgress = false;
    pendingRenegotiationId = null;
    lastRenegotiationId = null;
    pendingRenegotiationTarget = null;
    renegotiationFallbackUsed = false;
    clearRenegotiationTimeout();
    applyVideoSwapState();
    stopProximitySensor();
    updateCallIndicator(null);
    stopRingtone();
    clearCallCountdown();
    updateCallControls();

    if (shouldReloadAfterCall && !callReloadScheduled) {
        callReloadScheduled = true;
        showCallToast('Chamada encerrada. Recarregando...');
        setTimeout(() => {
            window.location.reload();
        }, 1200);
    }
}

function updateCallModal({ title, status, user }) {
    if (callTitle) callTitle.textContent = title || 'Chamada de voz';
    if (callStatus) callStatus.textContent = status || '';
    if (callUserName) callUserName.textContent = user?.name || 'Usuário';
    if (callUserPhoto) {
        applyProfilePhoto(callUserPhoto, user, 'https://via.placeholder.com/90/cccccc/666666?text=User');
    }
    if (callModal && !isCallMinimized) callModal.classList.add('show');
}

function setCallButtonsVisibility(mode) {
    if (!callAcceptBtn || !callRejectBtn || !callHangupBtn) return;
    callAcceptBtn.classList.toggle('hidden', mode !== 'incoming');
    callRejectBtn.classList.toggle('hidden', mode !== 'incoming');
    callHangupBtn.classList.toggle('hidden', mode === 'incoming');
}

function waitForOffer(timeoutMs = 5000) {
    if (!callDocRef) return Promise.resolve(null);

    return new Promise((resolve) => {
        let settled = false;
        const timeout = setTimeout(() => {
            if (settled) return;
            settled = true;
            if (unsubscribe) unsubscribe();
            resolve(null);
        }, timeoutMs);

        const unsubscribe = callDocRef.onSnapshot((snapshot) => {
            const data = snapshot.data();
            if (!data) return;
            if (data.offer) {
                if (settled) return;
                settled = true;
                clearTimeout(timeout);
                unsubscribe();
                resolve(data.offer);
                return;
            }
            if (data.status === 'ended' || data.status === 'rejected') {
                if (settled) return;
                settled = true;
                clearTimeout(timeout);
                unsubscribe();
                resolve(null);
            }
        });
    });
}

async function preparePeerConnection(options = {}) {
    const wantsVideo = options.video === true;
    peerConnection = new RTCPeerConnection(RTC_CONFIG);
    remoteStream = new MediaStream();
    if (remoteAudio) remoteAudio.srcObject = remoteStream;
    if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
        remoteVideo.muted = true;
    }

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
        updateCallControls();
        if (isSpeakerOn) {
            applySpeakerOutput(true);
        }
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
        alert('Você bloqueou este usuário.');
        return;
    }
    if (currentCallId) {
        alert('Já existe uma chamada em andamento.');
        return;
    }

    try {
        currentCallType = callType;
        isAudioMuted = false;
        isVideoMuted = false;
        isCallMinimized = false;
        isVideoSwapped = false;
        isSpeakerOn = false;
        await preparePeerConnection({ video: callType === 'video' });
    } catch (error) {
        if (callType === 'video') {
            const fallback = confirm('Não foi possível acessar a câmera. Deseja iniciar uma chamada de voz?');
            if (!fallback) {
                return;
            }
            callType = 'audio';
            currentCallType = 'audio';
            try {
                await preparePeerConnection({ video: false });
            } catch (audioError) {
                alert('Não foi possível acessar o microfone.');
                return;
            }
        } else {
            alert('Não foi possível acessar o microfone.');
            return;
        }
    }

    const callData = {
        callerId: currentUser.uid,
        callerName: currentUserProfile?.name || currentUser.displayName || 'Usuário',
        callerPhotoURL: currentUserProfile?.photoURL || null,
        callerPhotoData: currentUserProfile?.photoData || null,
        calleeId: selectedFriendData.uid,
        calleeName: selectedFriendData.name || 'Usuário',
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
    await callDocRef.update({
        offer: {
            type: offer.type,
            sdp: offer.sdp
        }
    });

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
            clearCallCountdown();
            updateCallIndicator('active', currentCallType || callType);
            updateCallModal({
                title: callType === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
                status: 'Conectado',
                user: selectedFriendData
            });
            setCallButtonsVisibility('active');
            updateCallControls();
            enterCallFullscreen();
        }
        handleRenegotiationSnapshot(data);
        if (data.status === 'rejected' || data.status === 'ended') {
            resetCallState();
        }
    });

    setCallButtonsVisibility('outgoing');
    updateCallIndicator('outgoing', callType);
    updateCallModal({
        title: callType === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
        status: 'Aguardando resposta',
        user: selectedFriendData
    });
    updateCallControls();
    startRingtone('outgoing');
    startCallCountdown(40, 'Aguardando resposta');

    callTimeout = setTimeout(async () => {
        if (callDocRef) {
            await callDocRef.set({
                status: 'ended',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
        resetCallState();
    }, 40000);
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

    if (blockIncomingCallsEnabled) {
        await callDoc.ref.set({ status: 'rejected', updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        showCallToast(getUiText('callAutoBlockedToast'));
        return;
    }

    callDocRef = callDoc.ref;
    currentCallId = callDoc.id;
    currentCallRole = 'callee';
    activeCallData = data;
    currentCallType = data.type || 'audio';
    callPhase = 'incoming';
    isAudioMuted = false;
    isVideoMuted = false;
    isCallMinimized = false;
    isVideoSwapped = false;
    isSpeakerOn = false;
    if (btnCall) btnCall.disabled = true;
    if (btnVideoCall) btnVideoCall.disabled = true;

    if (callDocUnsubscribe) callDocUnsubscribe();
    callDocUnsubscribe = callDocRef.onSnapshot(snapshot => {
        const latest = snapshot.data();
        if (!latest) return;
        activeCallData = { ...(activeCallData || {}), ...latest };
        if (latest.status === 'ended' || latest.status === 'rejected') {
            resetCallState();
        }
    });

    updateCallMediaVisibility(currentCallType);
    setCallButtonsVisibility('incoming');
    updateCallIndicator('incoming', currentCallType);
    updateCallModal({
        title: currentCallType === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
        status: 'Deseja atender?',
        user: {
            name: data.callerName,
            photoURL: data.callerPhotoURL,
            photoData: data.callerPhotoData
        }
    });
    updateCallControls();
    startRingtone('incoming');
}

async function acceptIncomingCall() {
    if (!callDocRef || !activeCallData || currentCallRole !== 'callee') return;

    try {
        const wantsVideo = (currentCallType || activeCallData.type) === 'video';
        await preparePeerConnection({ video: wantsVideo });
    } catch (error) {
        if ((currentCallType || activeCallData.type) === 'video') {
            const fallback = confirm('Não foi possível acessar a câmera. Deseja atender apenas com áudio?');
            if (!fallback) {
                await rejectIncomingCall();
                return;
            }
            currentCallType = 'audio';
            try {
                await preparePeerConnection({ video: false });
            } catch (audioError) {
                alert('Não foi possível acessar o microfone.');
                await rejectIncomingCall();
                return;
            }
        } else {
            alert('Não foi possível acessar o microfone.');
            await rejectIncomingCall();
            return;
        }
    }

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            callDocRef.collection('calleeCandidates').add(event.candidate.toJSON());
        }
    };

    let resolvedOffer = activeCallData.offer;
    if (!resolvedOffer && callDocRef) {
        try {
            const freshDoc = await callDocRef.get();
            resolvedOffer = freshDoc.data()?.offer || null;
        } catch (error) {
            resolvedOffer = null;
        }
    }
    if (!resolvedOffer) {
        resolvedOffer = await waitForOffer(5000);
    }
    if (!resolvedOffer) {
        alert('Não foi possível atender esta chamada.');
        resetCallState();
        return;
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(resolvedOffer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    callPhase = 'active';

    await callDocRef.update({
        answer: {
            type: answer.type,
            sdp: answer.sdp
        },
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

    if (callDocUnsubscribe) callDocUnsubscribe();
    callDocUnsubscribe = callDocRef.onSnapshot(snapshot => {
        const data = snapshot.data();
        if (!data) return;
        handleRenegotiationSnapshot(data);
        if (data.status === 'ended' || data.status === 'rejected') {
            resetCallState();
        }
    });

    setCallButtonsVisibility('active');
    stopRingtone();
    clearCallCountdown();
    updateCallIndicator('active', currentCallType || activeCallData.type || 'audio');
    updateCallModal({
        title: (currentCallType || activeCallData.type) === 'video' ? 'Chamada de vídeo' : 'Chamada de voz',
        status: 'Conectado',
        user: {
            name: activeCallData.callerName,
            photoURL: activeCallData.callerPhotoURL,
            photoData: activeCallData.callerPhotoData
        }
    });
    updateCallControls();
    enterCallFullscreen();
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

function looksLikeEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

async function findUsersByIdentifier(identifier) {
    const rawValue = String(identifier || '').trim();
    if (!rawValue) return [];

    if (looksLikeEmail(rawValue)) {
        const normalizedEmail = rawValue.toLowerCase();
        let snapshot = await db.collection('users')
            .where('emailLower', '==', normalizedEmail)
            .limit(1)
            .get();

        if (snapshot.empty) {
            snapshot = await db.collection('users')
                .where('email', '==', rawValue)
                .limit(1)
                .get();
        }

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data = { id: doc.id, ...doc.data() };
            return data.disabled ? [] : [data];
        }

        return [];
    }

    const normalizedTag = normalizeUserTagInput(rawValue);
    if (!normalizedTag) return [];

    const matchedUsersMap = new Map();
    const appendMatch = (user) => {
        if (!user || user.disabled || !user.uid) return;
        const storedTag = normalizeUserTagInput(user.userTag || user.userTagLower || '');
        const canonicalTag = getSearchableUserTag(user);
        if (storedTag !== normalizedTag && canonicalTag !== normalizedTag) return;
        matchedUsersMap.set(user.uid, user);
    };

    let snapshot = await db.collection('users')
        .where('userTagLower', '==', normalizedTag)
        .get();

    snapshot.forEach((doc) => appendMatch({ id: doc.id, ...doc.data() }));

    const availableUsers = Array.isArray(allUsersCache) && allUsersCache.length
        ? allUsersCache
        : (await db.collection('users').get()).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    availableUsers.forEach((user) => appendMatch(user));

    return sortUsersByNameAndEmail(Array.from(matchedUsersMap.values()));
}

async function addFriendByEmail(email) {
    if (!currentUser) return;
    const matchedUsers = await findUsersByIdentifier(email);
    if (!matchedUsers.length) {
        alert('Usuário não encontrado. Informe um e-mail ou @primeironome válido.');
        return;
    }

    const addableUsers = matchedUsers.filter((user) => getUserTagMatchOptionMeta(user).selectable);
    if (!addableUsers.length) {
        if (matchedUsers.some((user) => user.uid === currentUser.uid)) {
            alert('Você já é este usuário.');
            return;
        }
        alert('Os usuários encontrados já estão na sua lista de amigos.');
        return;
    }

    let selectedUser = null;
    if (looksLikeEmail(email)) {
        selectedUser = addableUsers[0];
    } else if (matchedUsers.length > 1) {
        selectedUser = await askUserTagMatchSelection(email, matchedUsers);
    } else {
        selectedUser = addableUsers[0];
    }

    if (!selectedUser || !getUserTagMatchOptionMeta(selectedUser).selectable) return;

    await db.collection('users').doc(currentUser.uid).set({
        friends: firebase.firestore.FieldValue.arrayUnion(selectedUser.uid)
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

function toggleMuteSelectedFriends() {
    const selectedIds = Array.from(selectedFriendIds).filter(Boolean);
    if (!selectedIds.length) return;

    const allMuted = selectedIds.every((id) => isFriendMuted(id));
    selectedIds.forEach((id) => {
        if (allMuted) {
            mutedFriendIds.delete(id);
        } else {
            mutedFriendIds.add(id);
        }
    });
    persistMutedFriendsForCurrentUser();
    updateFriendSelectionUI();
    renderFriendUsers();
}

async function blockSelectedFriends() {
    const selectedIds = Array.from(selectedFriendIds).filter(Boolean);
    if (!selectedIds.length) return;

    const confirmed = confirm(selectedIds.length === 1
        ? 'Deseja bloquear este amigo?'
        : `Deseja bloquear ${selectedIds.length} amigos selecionados?`);
    if (!confirmed) return;

    for (const friendId of selectedIds) {
        await blockFriend(friendId);
    }

    if (!Array.isArray(currentUserProfile?.blocked)) {
        currentUserProfile = { ...(currentUserProfile || {}), blocked: [] };
    }
    selectedIds.forEach((id) => {
        if (!currentUserProfile.blocked.includes(id)) {
            currentUserProfile.blocked.push(id);
        }
    });

    if (selectedUserId && selectedIds.includes(selectedUserId)) {
        renderChatPartnerStatus();
        if (messageInput) messageInput.disabled = true;
        if (btnAttach) btnAttach.disabled = true;
        if (btnSend) btnSend.disabled = true;
        if (btnEmoji) btnEmoji.disabled = true;
        if (btnVoice) btnVoice.disabled = true;
        if (btnCameraQuick) btnCameraQuick.disabled = true;
        if (btnCall) btnCall.disabled = true;
        if (btnVideoCall) btnVideoCall.disabled = true;
        updateComposerPrimaryAction();
    }

    resetFriendSelectionState();
}

async function removeSelectedFriends() {
    const selectedIds = Array.from(selectedFriendIds).filter(Boolean);
    if (!selectedIds.length) return;

    const confirmed = confirm(selectedIds.length === 1
        ? 'Deseja remover este amigo da sua lista?'
        : `Deseja remover ${selectedIds.length} amigos da sua lista?`);
    if (!confirmed) return;

    for (const friendId of selectedIds) {
        await removeFriend(friendId);
    }

    currentFriends = (currentFriends || []).filter((id) => !selectedIds.includes(id));

    resetFriendSelectionState();
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
        const storedTab = getStoredAdminTab();
        setAdminTab(storedTab || adminPanel.dataset.activeTab || 'metrics');
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
    storeAdminTab(safeTab);
    const buttons = adminTabs.querySelectorAll('.admin-tab');
    buttons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === safeTab);
    });
}

function setSidebarOpen(open) {
    if (!app) return;
    app.classList.toggle('sidebar-open', open);
    document.body.classList.toggle('sidebar-open', open);
    if (sidebarOverlay) {
        sidebarOverlay.classList.toggle('show', open);
    }
    if (!open) {
        setLogoutButtonVisible(false);
    }
}

function setLogoutButtonVisible(isVisible) {
    if (settingsMenu) {
        settingsMenu.classList.toggle('hidden', !isVisible);
        return;
    }
    if (!btnLogout) return;
    btnLogout.classList.toggle('hidden', !isVisible);
}

function toggleLogoutButtonVisible() {
    if (settingsMenu) {
        setLogoutButtonVisible(settingsMenu.classList.contains('hidden'));
        return;
    }
    if (!btnLogout) return;
    setLogoutButtonVisible(btnLogout.classList.contains('hidden'));
}

function getStoredTheme() {
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        return value === 'dark' ? 'dark' : 'light';
    } catch (error) {
        return 'light';
    }
}

function getStoredBooleanSetting(storageKey, defaultValue = true) {
    try {
        const value = localStorage.getItem(storageKey);
        if (value === null) return defaultValue;
        return value === 'true';
    } catch (error) {
        return defaultValue;
    }
}

function getStoredChatFontSize(defaultValue = 'normal') {
    try {
        const value = localStorage.getItem(CHAT_FONT_SIZE_STORAGE_KEY);
        if (value === 'large') return 'large';
        return defaultValue;
    } catch (error) {
        return defaultValue;
    }
}

function getStoredLanguage(defaultValue = 'pt-BR') {
    try {
        const value = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return value === 'en-US' ? 'en-US' : defaultValue;
    } catch (error) {
        return defaultValue;
    }
}

function getStoredChatBackground() {
    try {
        const value = localStorage.getItem(CHAT_BACKGROUND_STORAGE_KEY) || '';
        if (!value.startsWith('data:image/')) return '';
        return value;
    } catch (error) {
        return '';
    }
}

function isWindowsDesktopRuntime() {
    if (isAndroidWebViewRuntime()) return false;
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const isWindows = /Windows/i.test(ua) || /Win/i.test(platform);
    const isMobileLike = /Mobi|Android|iPhone|iPad|Tablet/i.test(ua);
    return isWindows && !isMobileLike;
}

function supportsPcLocalMediaFolder() {
    return isWindowsDesktopRuntime()
        && typeof window.showDirectoryPicker === 'function'
        && typeof window.indexedDB !== 'undefined';
}

function openMediaHandleDb() {
    return new Promise((resolve, reject) => {
        if (typeof window.indexedDB === 'undefined') {
            reject(new Error('IndexedDB indisponível'));
            return;
        }

        const request = window.indexedDB.open(MEDIA_HANDLE_DB_NAME, MEDIA_HANDLE_DB_VERSION);
        request.onupgradeneeded = () => {
            const dbRef = request.result;
            if (!dbRef.objectStoreNames.contains(MEDIA_HANDLE_STORE_NAME)) {
                dbRef.createObjectStore(MEDIA_HANDLE_STORE_NAME);
            }
            if (!dbRef.objectStoreNames.contains(MEDIA_CACHE_STORE_NAME)) {
                dbRef.createObjectStore(MEDIA_CACHE_STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Falha ao abrir banco local'));
    });
}

function getAttachmentCacheKey(msg) {
    if (!msg?.id) return '';
    const senderId = String(msg.senderId || '').trim();
    const receiverId = String(msg.receiverId || '').trim();
    if (senderId && receiverId) {
        return `${getConversationId(senderId, receiverId)}:${msg.id}`;
    }
    return String(msg.id);
}

async function saveAttachmentBlobToCache(msg, blob) {
    const cacheKey = getAttachmentCacheKey(msg);
    if (!cacheKey || !blob) return false;

    try {
        const dbRef = await openMediaHandleDb();
        await new Promise((resolve, reject) => {
            const tx = dbRef.transaction(MEDIA_CACHE_STORE_NAME, 'readwrite');
            tx.objectStore(MEDIA_CACHE_STORE_NAME).put({
                blob,
                fileName: String(msg?.fileName || '').trim(),
                fileType: String(blob.type || msg?.fileType || '').trim(),
                updatedAt: Date.now()
            }, cacheKey);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error('Falha ao salvar cache local da mídia'));
        });
        dbRef.close();
        return true;
    } catch (error) {
        console.warn('Falha ao salvar blob da mídia em cache local.', error);
        return false;
    }
}

async function loadAttachmentBlobFromCache(msg) {
    const cacheKey = getAttachmentCacheKey(msg);
    if (!cacheKey) return null;

    try {
        const dbRef = await openMediaHandleDb();
        const cachedEntry = await new Promise((resolve, reject) => {
            const tx = dbRef.transaction(MEDIA_CACHE_STORE_NAME, 'readonly');
            const req = tx.objectStore(MEDIA_CACHE_STORE_NAME).get(cacheKey);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error || new Error('Falha ao carregar cache local da mídia'));
        });
        dbRef.close();
        return cachedEntry?.blob || null;
    } catch (error) {
        console.warn('Falha ao carregar blob da mídia do cache local.', error);
        return null;
    }
}

async function getCachedAttachmentObjectUrl(msg) {
    const cacheKey = getAttachmentCacheKey(msg);
    if (!cacheKey) return '';

    const existingUrl = attachmentCacheObjectUrls.get(cacheKey);
    if (existingUrl) return existingUrl;

    const blob = await loadAttachmentBlobFromCache(msg);
    if (!blob) return '';

    const objectUrl = URL.createObjectURL(blob);
    attachmentCacheObjectUrls.set(cacheKey, objectUrl);
    return objectUrl;
}

async function savePcMediaRootHandle(handle) {
    try {
        const dbRef = await openMediaHandleDb();
        await new Promise((resolve, reject) => {
            const tx = dbRef.transaction(MEDIA_HANDLE_STORE_NAME, 'readwrite');
            tx.objectStore(MEDIA_HANDLE_STORE_NAME).put(handle, MEDIA_HANDLE_ROOT_KEY);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error('Falha ao salvar pasta local'));
        });
        dbRef.close();
    } catch (error) {
        console.warn('Não foi possível salvar referência da pasta local.', error);
    }
}

async function loadPcMediaRootHandle() {
    if (pcMediaRootHandleLoaded) return pcMediaRootHandle;
    pcMediaRootHandleLoaded = true;

    try {
        const dbRef = await openMediaHandleDb();
        const handle = await new Promise((resolve, reject) => {
            const tx = dbRef.transaction(MEDIA_HANDLE_STORE_NAME, 'readonly');
            const req = tx.objectStore(MEDIA_HANDLE_STORE_NAME).get(MEDIA_HANDLE_ROOT_KEY);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error || new Error('Falha ao carregar pasta local'));
        });
        dbRef.close();
        pcMediaRootHandle = handle || null;
        return pcMediaRootHandle;
    } catch (error) {
        console.warn('Não foi possível carregar referência da pasta local.', error);
        pcMediaRootHandle = null;
        return null;
    }
}

async function ensureHandleWritePermission(handle, interactive = false) {
    if (!handle) return false;

    try {
        const mode = { mode: 'readwrite' };
        let permission = typeof handle.queryPermission === 'function'
            ? await handle.queryPermission(mode)
            : 'prompt';

        if (permission === 'granted') return true;
        if (permission === 'prompt' && interactive && typeof handle.requestPermission === 'function') {
            permission = await handle.requestPermission(mode);
            return permission === 'granted';
        }
    } catch (error) {
        console.warn('Falha ao verificar permissão da pasta local.', error);
    }

    return false;
}

async function ensurePcMediaDirectoryHandle(rootHandle, msg, fileName, mimeType = '', options = {}) {
    const mediaDir = await ensurePcMediaFolderStructure(rootHandle);
    const category = getDownloadCategory(msg, fileName, mimeType);
    const scope = resolveLocalMediaScope(msg, options.scope);
    const targetDir = scope === 'sent'
        ? await mediaDir.getDirectoryHandle('Enviados', { create: true })
        : mediaDir;
    const categoryDir = await targetDir.getDirectoryHandle(category, { create: true });
    return { categoryDir };
}

async function ensurePcMediaFolderStructure(rootHandle) {
    const camechatDir = await rootHandle.getDirectoryHandle('CameChat', { create: true });
    const mediaDir = await camechatDir.getDirectoryHandle('Media', { create: true });
    const categories = ['Images', 'Video', 'Documents', 'Audio'];
    for (const category of categories) {
        await mediaDir.getDirectoryHandle(category, { create: true });
    }
    const sentDir = await mediaDir.getDirectoryHandle('Enviados', { create: true });
    for (const category of categories) {
        await sentDir.getDirectoryHandle(category, { create: true });
    }
    return mediaDir;
}

async function writeBlobToPcLocalMediaFolder(rootHandle, msg, fileName, blob, mimeType = '', options = {}) {
    if (!rootHandle || !blob) return false;
    const safeName = sanitizeDownloadFileName(fileName);
    const { categoryDir } = await ensurePcMediaDirectoryHandle(rootHandle, msg, safeName, mimeType || blob.type || '', options);
    const fileHandle = await categoryDir.getFileHandle(safeName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
}

async function getPcMediaRootHandle(interactive = false) {
    if (!supportsPcLocalMediaFolder()) return null;

    let handle = pcMediaRootHandle;
    if (!handle) {
        handle = await loadPcMediaRootHandle();
    }

    if (!handle && interactive) {
        try {
            handle = await window.showDirectoryPicker({ id: 'camechat-media-root', mode: 'readwrite' });
            pcMediaRootHandle = handle;
            await savePcMediaRootHandle(handle);
        } catch (error) {
            return null;
        }
    }

    if (!handle) return null;

    const hasPermission = await ensureHandleWritePermission(handle, interactive);
    if (!hasPermission) return null;

    pcMediaRootHandle = handle;
    return handle;
}

function setPcLocalMediaFolderReady(ready, persist = true) {
    pcLocalMediaFolderReady = !!ready;
    if (btnMediaFolderPc) {
        btnMediaFolderPc.classList.toggle('hidden', !supportsPcLocalMediaFolder());
    }
    refreshSettingsMenuLabels();

    if (!persist) return;
    try {
        localStorage.setItem(MEDIA_PC_FOLDER_READY_STORAGE_KEY, pcLocalMediaFolderReady ? 'true' : 'false');
    } catch (error) {
        // ignore
    }
}

async function initializePcLocalMediaFolderState() {
    if (!btnMediaFolderPc) return;
    if (!supportsPcLocalMediaFolder()) {
        setPcLocalMediaFolderReady(false, false);
        return;
    }

    const remembered = getStoredBooleanSetting(MEDIA_PC_FOLDER_READY_STORAGE_KEY, false);
    if (!remembered) {
        setPcLocalMediaFolderReady(false, false);
        return;
    }

    try {
        const handle = await getPcMediaRootHandle(false);
        setPcLocalMediaFolderReady(!!handle, false);
    } catch (error) {
        setPcLocalMediaFolderReady(false, false);
    }
}

async function configurePcLocalMediaFolder() {
    if (!supportsPcLocalMediaFolder()) {
        setPcLocalMediaFolderReady(false);
        return false;
    }

    const rootHandle = await getPcMediaRootHandle(true);
    if (!rootHandle) {
        return false;
    }

    try {
        await ensurePcMediaFolderStructure(rootHandle);
        setPcLocalMediaFolderReady(true);
        return true;
    } catch (error) {
        console.warn('Falha ao preparar pasta local de mídia no PC.', error);
        setPcLocalMediaFolderReady(false);
        return false;
    }
}

const UI_TEXT = {
    'pt-BR': {
        themeDark: 'Tema escuro',
        themeLight: 'Tema claro',
        soundOn: 'Som: ligado',
        soundOff: 'Som: desligado',
        notificationsOff: 'Notificações: desligadas',
        notificationsOn: 'Notificações: ligadas',
        notificationsBlocked: 'Notificações: bloqueadas',
        notificationsPending: 'Notificações: pendentes',
        notificationsUnavailable: 'Notificações: indisponíveis',
        readOn: 'Leitura: ligada',
        readOff: 'Leitura: desligada',
        statusVisible: 'Status: visível',
        statusHidden: 'Status: oculto',
        chatFontNormal: 'Fonte do chat: normal',
        chatFontLarge: 'Fonte do chat: grande',
        chatBackgroundDefault: 'Plano de fundo do chat',
        chatBackgroundCustom: 'Plano de fundo: personalizado',
        mediaSaveAuto: 'Salvamento de mídia: automático',
        mediaSaveManual: 'Salvamento de mídia: manual',
        mediaSaveAction: 'Salvar mídia',
        mediaPcFolderConfigure: 'Pasta de mídia (PC): configurar',
        mediaPcFolderReady: 'Pasta de mídia (PC): pronta',
        mediaPcFolderUnavailable: 'Pasta de mídia (PC): indisponível',
        mediaPcFolderSaved: 'Pasta local de mídia configurada com sucesso no PC.',
        mediaPcFolderSaveFailed: 'Não foi possível configurar a pasta local de mídia no PC.',
        callsAllowed: 'Chamadas: permitidas',
        callsBlocked: 'Chamadas: bloqueadas',
        lastSeenVisible: 'Visto por último: visível',
        lastSeenHidden: 'Visto por último: oculto',
        languagePt: 'Idioma: português',
        languageEn: 'Idioma: inglês',
        settingsTitle: 'Configurações',
        logout: 'Sair',
        presenceHidden: 'Status oculto',
        presenceLastSeen: 'Visto por último às {time}',
        presenceOffline: 'Offline',
        presenceBlocked: 'Bloqueado',
        typingActivity: '{name} está escrevendo...',
        recordingActivity: '{name} está gravando áudio...',
        callAutoBlockedToast: 'Chamada recusada automaticamente: chamadas bloqueadas.'
    },
    'en-US': {
        themeDark: 'Dark theme',
        themeLight: 'Light theme',
        soundOn: 'Sound: on',
        soundOff: 'Sound: off',
        notificationsOff: 'Notifications: off',
        notificationsOn: 'Notifications: on',
        notificationsBlocked: 'Notifications: blocked',
        notificationsPending: 'Notifications: pending',
        notificationsUnavailable: 'Notifications: unavailable',
        readOn: 'Read receipts: on',
        readOff: 'Read receipts: off',
        statusVisible: 'Status: visible',
        statusHidden: 'Status: hidden',
        chatFontNormal: 'Chat font: normal',
        chatFontLarge: 'Chat font: large',
        chatBackgroundDefault: 'Chat wallpaper',
        chatBackgroundCustom: 'Wallpaper: custom',
        mediaSaveAuto: 'Media saving: automatic',
        mediaSaveManual: 'Media saving: manual',
        mediaSaveAction: 'Save media',
        mediaPcFolderConfigure: 'Media folder (PC): configure',
        mediaPcFolderReady: 'Media folder (PC): ready',
        mediaPcFolderUnavailable: 'Media folder (PC): unavailable',
        mediaPcFolderSaved: 'Local media folder configured successfully on PC.',
        mediaPcFolderSaveFailed: 'Could not configure local media folder on PC.',
        callsAllowed: 'Calls: allowed',
        callsBlocked: 'Calls: blocked',
        lastSeenVisible: 'Last seen: visible',
        lastSeenHidden: 'Last seen: hidden',
        languagePt: 'Language: Portuguese',
        languageEn: 'Language: English',
        settingsTitle: 'Settings',
        logout: 'Sign out',
        presenceHidden: 'Status hidden',
        presenceLastSeen: 'Last seen at {time}',
        presenceOffline: 'Offline',
        presenceBlocked: 'Blocked',
        typingActivity: '{name} is typing...',
        recordingActivity: '{name} is recording audio...',
        callAutoBlockedToast: 'Call rejected automatically: calls are blocked.'
    }
};

function getUiText(key) {
    const lang = selectedLanguage === 'en-US' ? 'en-US' : 'pt-BR';
    return UI_TEXT[lang]?.[key] || UI_TEXT['pt-BR']?.[key] || '';
}

function formatUiText(key, params = {}) {
    const template = getUiText(key);
    return template.replace(/\{(\w+)\}/g, (_, token) => String(params[token] ?? ''));
}

function refreshSettingsMenuLabels() {
    if (btnThemeToggle) {
        const isDark = document.body.classList.contains('theme-dark');
        btnThemeToggle.textContent = isDark ? getUiText('themeLight') : getUiText('themeDark');
    }

    if (btnSoundToggle) {
        btnSoundToggle.textContent = soundNotificationsEnabled ? getUiText('soundOn') : getUiText('soundOff');
    }

    if (btnDesktopNotificationsToggle) {
        if (!isDesktopNotificationsSupported()) {
            btnDesktopNotificationsToggle.textContent = getUiText('notificationsUnavailable');
        } else if (!desktopNotificationsEnabled) {
            btnDesktopNotificationsToggle.textContent = getUiText('notificationsOff');
        } else {
            const permission = getDesktopNotificationPermission();
            if (permission === 'granted') {
                btnDesktopNotificationsToggle.textContent = getUiText('notificationsOn');
            } else if (permission === 'denied') {
                btnDesktopNotificationsToggle.textContent = getUiText('notificationsBlocked');
            } else {
                btnDesktopNotificationsToggle.textContent = getUiText('notificationsPending');
            }
        }
    }

    if (btnReadReceiptsToggle) {
        btnReadReceiptsToggle.textContent = readReceiptsEnabled ? getUiText('readOn') : getUiText('readOff');
    }

    if (btnOnlineStatusToggle) {
        btnOnlineStatusToggle.textContent = showOnlineStatusEnabled ? getUiText('statusVisible') : getUiText('statusHidden');
    }

    if (btnChatFontToggle) {
        btnChatFontToggle.textContent = chatFontSizePreference === 'large' ? getUiText('chatFontLarge') : getUiText('chatFontNormal');
    }

    if (btnChatBackground) {
        btnChatBackground.textContent = chatBackgroundDataUrl ? getUiText('chatBackgroundCustom') : getUiText('chatBackgroundDefault');
    }

    if (btnMediaSaveModeToggle) {
        btnMediaSaveModeToggle.textContent = autoMediaSaveEnabled ? getUiText('mediaSaveAuto') : getUiText('mediaSaveManual');
    }

    if (btnMediaFolderPc) {
        const supported = supportsPcLocalMediaFolder();
        btnMediaFolderPc.classList.toggle('hidden', !supported);
        btnMediaFolderPc.disabled = !supported;
        if (!supported) {
            btnMediaFolderPc.textContent = getUiText('mediaPcFolderUnavailable');
        } else if (pcLocalMediaFolderReady) {
            btnMediaFolderPc.textContent = getUiText('mediaPcFolderReady');
        } else {
            btnMediaFolderPc.textContent = getUiText('mediaPcFolderConfigure');
        }
    }

    if (btnCallBlockToggle) {
        btnCallBlockToggle.textContent = blockIncomingCallsEnabled ? getUiText('callsBlocked') : getUiText('callsAllowed');
    }

    if (btnLastSeenToggle) {
        btnLastSeenToggle.textContent = showLastSeenEnabled ? getUiText('lastSeenVisible') : getUiText('lastSeenHidden');
    }

    if (btnLanguageToggle) {
        btnLanguageToggle.textContent = selectedLanguage === 'en-US' ? getUiText('languageEn') : getUiText('languagePt');
    }

    if (btnLogout) {
        btnLogout.textContent = getUiText('logout');
    }

    if (btnSettings) {
        const title = getUiText('settingsTitle');
        btnSettings.title = title;
        btnSettings.setAttribute('aria-label', title);
    }

    if (btnMediaViewerSave) {
        const saveLabel = getUiText('mediaSaveAction');
        btnMediaViewerSave.title = saveLabel;
        btnMediaViewerSave.setAttribute('aria-label', saveLabel);
    }
}

function refreshPresenceDisplay() {
    renderFriendUsers();
    renderChatPartnerStatus();
    if (friendModal?.classList.contains('show') && selectedFriendData) {
        renderFriendDetailStatus(selectedFriendData);
    }
}

try {
    initializeUserPreferences();
} catch (error) {
    console.warn('Falha ao inicializar preferências locais:', error);
}

initializePcLocalMediaFolderState().catch((error) => {
    console.warn('Falha ao inicializar pasta local de mídia no PC.', error);
});

startInitialBootstrapFallback();

function isDesktopNotificationsSupported() {
    return typeof Notification !== 'undefined';
}

function getDesktopNotificationPermission() {
    if (!isDesktopNotificationsSupported()) return 'unsupported';
    return Notification.permission;
}

async function syncOnlineStatusVisibilityPreference() {
    if (!currentUser) return;
    try {
        await db.collection('users').doc(currentUser.uid).set({
            showOnlineStatus: showOnlineStatusEnabled,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.warn('Falha ao salvar preferência de status online.', error);
    }
}

function applyTheme(theme, persist = false) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    applyChatBackground(chatBackgroundDataUrl, false);

    if (btnThemeToggle) {
        btnThemeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();

    if (!persist) return;

    try {
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (error) {
        // ignore
    }
}

function applySoundNotificationsSetting(isEnabled, persist = false) {
    soundNotificationsEnabled = !!isEnabled;

    if (btnSoundToggle) {
        btnSoundToggle.setAttribute('aria-pressed', soundNotificationsEnabled ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();

    if (!persist) return;

    try {
        localStorage.setItem(SOUND_NOTIFICATIONS_STORAGE_KEY, soundNotificationsEnabled ? 'true' : 'false');
    } catch (error) {
        // ignore
    }
}

function applyReadReceiptsSetting(isEnabled, persist = false) {
    readReceiptsEnabled = !!isEnabled;

    if (btnReadReceiptsToggle) {
        btnReadReceiptsToggle.setAttribute('aria-pressed', readReceiptsEnabled ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();

    if (!persist) return;

    try {
        localStorage.setItem(READ_RECEIPTS_STORAGE_KEY, readReceiptsEnabled ? 'true' : 'false');
    } catch (error) {
        // ignore
    }
}

function applyDesktopNotificationsSetting(isEnabled, persist = false) {
    if (!isDesktopNotificationsSupported()) {
        desktopNotificationsEnabled = false;
        if (btnDesktopNotificationsToggle) {
            btnDesktopNotificationsToggle.setAttribute('aria-pressed', 'false');
            btnDesktopNotificationsToggle.disabled = true;
        }
        refreshSettingsMenuLabels();
        return;
    }

    desktopNotificationsEnabled = !!isEnabled;
    const permission = getDesktopNotificationPermission();

    if (btnDesktopNotificationsToggle) {
        btnDesktopNotificationsToggle.setAttribute('aria-pressed', desktopNotificationsEnabled && permission === 'granted' ? 'true' : 'false');
        btnDesktopNotificationsToggle.disabled = false;
    }
    refreshSettingsMenuLabels();

    if (!persist) return;

    try {
        localStorage.setItem(DESKTOP_NOTIFICATIONS_STORAGE_KEY, desktopNotificationsEnabled ? 'true' : 'false');
    } catch (error) {
        // ignore
    }
}

function applyOnlineStatusVisibilitySetting(isEnabled, persist = false, syncRemote = false) {
    showOnlineStatusEnabled = !!isEnabled;

    if (btnOnlineStatusToggle) {
        btnOnlineStatusToggle.setAttribute('aria-pressed', showOnlineStatusEnabled ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();
    refreshPresenceDisplay();

    if (persist) {
        try {
            localStorage.setItem(ONLINE_STATUS_VISIBILITY_STORAGE_KEY, showOnlineStatusEnabled ? 'true' : 'false');
        } catch (error) {
            // ignore
        }
    }

    if (syncRemote && currentUser) {
        syncOnlineStatusVisibilityPreference();
    }
}

function applyChatFontSizeSetting(size, persist = false) {
    const normalizedSize = size === 'large' ? 'large' : 'normal';
    chatFontSizePreference = normalizedSize;
    document.body.classList.toggle('chat-font-large', normalizedSize === 'large');

    if (btnChatFontToggle) {
        btnChatFontToggle.setAttribute('aria-pressed', normalizedSize === 'large' ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();

    if (!persist) return;

    try {
        localStorage.setItem(CHAT_FONT_SIZE_STORAGE_KEY, normalizedSize);
    } catch (error) {
        // ignore
    }
}

function applyMediaAutoSaveSetting(isEnabled, persist = false) {
    autoMediaSaveEnabled = !!isEnabled;

    if (btnMediaSaveModeToggle) {
        btnMediaSaveModeToggle.setAttribute('aria-pressed', autoMediaSaveEnabled ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();

    if (!persist) return;

    try {
        localStorage.setItem(MEDIA_AUTO_SAVE_STORAGE_KEY, autoMediaSaveEnabled ? 'true' : 'false');
    } catch (error) {
        // ignore
    }
}

function applyCallBlockingSetting(isEnabled, persist = false) {
    blockIncomingCallsEnabled = !!isEnabled;

    if (btnCallBlockToggle) {
        btnCallBlockToggle.setAttribute('aria-pressed', blockIncomingCallsEnabled ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();

    if (!persist) return;

    try {
        localStorage.setItem(CALL_BLOCK_STORAGE_KEY, blockIncomingCallsEnabled ? 'true' : 'false');
    } catch (error) {
        // ignore
    }
}

function applyLastSeenVisibilitySetting(isEnabled, persist = false) {
    showLastSeenEnabled = !!isEnabled;

    if (btnLastSeenToggle) {
        btnLastSeenToggle.setAttribute('aria-pressed', showLastSeenEnabled ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();
    refreshPresenceDisplay();

    if (!persist) return;

    try {
        localStorage.setItem(LAST_SEEN_VISIBILITY_STORAGE_KEY, showLastSeenEnabled ? 'true' : 'false');
    } catch (error) {
        // ignore
    }
}

function applyLanguageSetting(language, persist = false) {
    selectedLanguage = language === 'en-US' ? 'en-US' : 'pt-BR';

    if (btnLanguageToggle) {
        btnLanguageToggle.setAttribute('aria-pressed', selectedLanguage === 'en-US' ? 'true' : 'false');
    }
    refreshSettingsMenuLabels();
    refreshPresenceDisplay();

    if (!persist) return;

    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    } catch (error) {
        // ignore
    }
}

function initializeTheme() {
    applyTheme(getStoredTheme(), false);
}

function initializeUserPreferences() {
    applyLanguageSetting(getStoredLanguage('pt-BR'), false);
    initializeTheme();
    applySoundNotificationsSetting(getStoredBooleanSetting(SOUND_NOTIFICATIONS_STORAGE_KEY, true), false);
    applyDesktopNotificationsSetting(getStoredBooleanSetting(DESKTOP_NOTIFICATIONS_STORAGE_KEY, false), false);
    applyReadReceiptsSetting(getStoredBooleanSetting(READ_RECEIPTS_STORAGE_KEY, true), false);
    applyOnlineStatusVisibilitySetting(getStoredBooleanSetting(ONLINE_STATUS_VISIBILITY_STORAGE_KEY, true), false, false);
    applyChatFontSizeSetting(getStoredChatFontSize('normal'), false);
    applyChatBackground(getStoredChatBackground(), false);
    applyMediaAutoSaveSetting(getStoredBooleanSetting(MEDIA_AUTO_SAVE_STORAGE_KEY, true), false);
    setPcLocalMediaFolderReady(getStoredBooleanSetting(MEDIA_PC_FOLDER_READY_STORAGE_KEY, false), false);
    applyCallBlockingSetting(getStoredBooleanSetting(CALL_BLOCK_STORAGE_KEY, false), false);
    applyLastSeenVisibilitySetting(getStoredBooleanSetting(LAST_SEEN_VISIBILITY_STORAGE_KEY, true), false);
    refreshSettingsMenuLabels();
}

function playIncomingMessageTone(senderUid = '') {
    if (!soundNotificationsEnabled) return;
    if (senderUid && isFriendMuted(senderUid)) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 880;

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);

        setTimeout(() => {
            ctx.close().catch(() => {});
        }, 260);
    } catch (error) {
        // ignore
    }
}

function buildIncomingNotificationBody(messageData) {
    const text = (messageData?.text || '').trim();
    if (text) {
        return text.length > 120 ? `${text.slice(0, 117)}...` : text;
    }

    const fileType = (messageData?.fileType || '').toLowerCase();
    if (fileType.startsWith('image/')) return 'Enviou uma imagem';
    if (fileType.startsWith('video/')) return 'Enviou um vídeo';
    if (fileType.startsWith('audio/')) return 'Enviou um áudio';
    if (fileType.includes('pdf')) return 'Enviou um PDF';
    if (messageData?.fileName) return `Enviou ${messageData.fileName}`;
    return 'Nova mensagem';
}

function getCachedUserByUid(uid) {
    if (!uid || !Array.isArray(allUsersCache)) return null;
    return allUsersCache.find((user) => user.uid === uid) || null;
}

function showIncomingDesktopNotification(senderUid, messageData) {
    if (!desktopNotificationsEnabled) return;
    if (!isDesktopNotificationsSupported()) return;
    if (getDesktopNotificationPermission() !== 'granted') return;
    if (document.visibilityState === 'visible' && document.hasFocus()) return;
    if (isFriendMuted(senderUid)) return;

    const sender = (selectedFriendData && selectedFriendData.uid === senderUid)
        ? selectedFriendData
        : getCachedUserByUid(senderUid);
    const senderName = sender?.name || 'Usuário';
    const icon = getSafePhotoData(sender?.photoData) || getSafePhotoUrl(sender?.photoURL) || 'images/camechat_logo.png';
    const body = buildIncomingNotificationBody(messageData);

    try {
        const notification = new Notification(`Nova mensagem de ${senderName}`, {
            body,
            icon,
            tag: `camechat-message-${senderUid}`,
            renotify: true
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
            const friend = getCachedUserByUid(senderUid);
            if (friend && selectedUserId !== senderUid) {
                Promise.resolve(selectUser(friend)).catch(() => {});
            }
        };
    } catch (error) {
        // ignore
    }
}

function getStoredAdminTab() {
    try {
        const value = localStorage.getItem(ADMIN_TAB_STORAGE_KEY);
        return value || null;
    } catch (error) {
        return null;
    }
}

function storeAdminTab(tab) {
    try {
        localStorage.setItem(ADMIN_TAB_STORAGE_KEY, tab);
    } catch (error) {
        // ignore
    }
}

function isMobileLayout() {
    return window.matchMedia('(max-width: 900px)').matches;
}

function syncMobileViewportSize() {
    const viewportWidth = Math.round(window.visualViewport?.width || window.innerWidth || 0);
    const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight || 0);
    if (!viewportWidth || !viewportHeight) return;
    document.documentElement.style.setProperty('--chat-viewport-width', `${viewportWidth}px`);
    document.documentElement.style.setProperty('--chat-viewport-height', `${viewportHeight}px`);
}

function shouldAutoFocusMessageInput() {
    const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const hasTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
    return !isMobileLayout() && !hasCoarsePointer && !hasTouch;
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
            const online = users.filter(user => isUserEffectivelyOnline(user)).length;

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
        const tagFields = buildUserTagFields(name, userCredential.user.uid);

        await db.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            name: name,
            email: email,
            emailLower: email.toLowerCase(),
            userTag: tagFields.userTag,
            userTagLower: tagFields.userTagLower,
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

syncMobileViewportSize();
window.addEventListener('resize', syncMobileViewportSize);
window.addEventListener('orientationchange', syncMobileViewportSize);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncMobileViewportSize);
}

document.addEventListener('touchstart', (event) => {
    if (!isMobileLayout()) return;
    if (!event.touches || event.touches.length !== 1) return;
    touchTracking = true;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', (event) => {
    if (!touchTracking) return;
    touchTracking = false;
    if (!isMobileLayout()) return;
    if (!event.changedTouches || event.changedTouches.length !== 1) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const deltaX = endX - touchStartX;
    const deltaY = Math.abs(endY - touchStartY);

    if (deltaY > 80) return;
    const swipeDistance = 70;
    const fromLeftEdge = touchStartX < 30;
    const sidebarIsOpen = app?.classList.contains('sidebar-open');

    if (deltaX > swipeDistance && fromLeftEdge && !sidebarIsOpen) {
        setSidebarOpen(true);
    }

    if (deltaX < -swipeDistance && sidebarIsOpen) {
        setSidebarOpen(false);
    }
});

if (adminTabs) {
    adminTabs.querySelectorAll('.admin-tab').forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            setAdminTab(tabButton.dataset.tab);
        });
    });
    setAdminTab(getStoredAdminTab() || adminPanel?.dataset?.activeTab || 'metrics');
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
        const aOnline = isUserPresenceVisible(a) && isUserEffectivelyOnline(a);
        const bOnline = isUserPresenceVisible(b) && isUserEffectivelyOnline(b);
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
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
            renderFriendDetailStatus(selectedFriendData);
            updateFriendModalState();
        }
        if (selectedUserId === selectedFriendData.uid) {
            renderChatPartnerStatus();
        }
        if (isUserEffectivelyOnline(selectedFriendData) && selectedUserId) {
            updateOutgoingDeliveryStatus(currentConversationId, currentConversationMessages);
        }
    }

    if (selectedFriendData && !friendSet.has(selectedFriendData.uid)) {
        selectedFriendData = null;
        if (defaultChatPartnerPhoto) {
            chatPartnerPhoto.src = defaultChatPartnerPhoto;
        }
        chatPartnerName.textContent = 'Selecione um usuário';
        if (chatPartnerStatus) {
            chatPartnerStatus.textContent = '';
            chatPartnerStatus.classList.remove('chat-partner-status-activity');
            setOnlineStatusClass(chatPartnerStatus, false);
        }
        setChatPartnerActivity(null);
        messageInput.disabled = true;
        btnSend.disabled = true;
        btnAttach.disabled = true;
        if (btnEmoji) btnEmoji.disabled = true;
        if (btnVoice) btnVoice.disabled = true;
        if (btnCameraQuick) btnCameraQuick.disabled = true;
        if (btnCall) btnCall.disabled = true;
        if (btnVideoCall) btnVideoCall.disabled = true;
        updateComposerPrimaryAction();
    }

    if (selectedFriendData && blockedSet.has(selectedFriendData.uid)) {
        messageInput.disabled = true;
        btnSend.disabled = true;
        btnAttach.disabled = true;
        if (btnEmoji) btnEmoji.disabled = true;
        if (btnVoice) btnVoice.disabled = true;
        if (btnCameraQuick) btnCameraQuick.disabled = true;
        renderChatPartnerStatus();
        if (btnCall) btnCall.disabled = true;
        if (btnVideoCall) btnVideoCall.disabled = true;
        updateComposerPrimaryAction();
    }

    if (isFriendSelectionMode) {
        const validFriendIds = new Set(friends.map((user) => user.uid));
        selectedFriendIds.forEach((id) => {
            if (!validFriendIds.has(id)) selectedFriendIds.delete(id);
        });
        if (selectedFriendIds.size === 0) {
            isFriendSelectionMode = false;
        }
    }
    updateFriendSelectionUI();
}

function bindFriendSelectionInteractions(friendEl, user) {
    if (!friendEl || !user?.uid) return;

    let longPressTimer = null;
    let longPressTriggered = false;
    let pressClientX = 0;
    let pressClientY = 0;

    const clearTimer = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    const startLongPress = (event) => {
        if (event && typeof event.button === 'number' && event.button !== 0) return;
        clearTimer();
        longPressTriggered = false;

        if (event?.touches?.[0]) {
            pressClientX = event.touches[0].clientX;
            pressClientY = event.touches[0].clientY;
        } else {
            pressClientX = event?.clientX ?? 0;
            pressClientY = event?.clientY ?? 0;
        }

        longPressTimer = setTimeout(() => {
            longPressTriggered = true;
            activateFriendSelectionByLongPress(user.uid);
            suppressMediaOpenUntil = Date.now() + 900;
        }, MESSAGE_LONG_PRESS_MS);
    };

    const cancelLongPressOnMove = (event) => {
        if (event?.touches?.[0]) {
            const deltaX = Math.abs(event.touches[0].clientX - pressClientX);
            const deltaY = Math.abs(event.touches[0].clientY - pressClientY);
            if (deltaX > 12 || deltaY > 12) {
                clearTimer();
            }
            return;
        }
        clearTimer();
    };

    friendEl.addEventListener('mousedown', startLongPress);
    friendEl.addEventListener('touchstart', startLongPress, { passive: true });
    friendEl.addEventListener('mousemove', cancelLongPressOnMove);
    friendEl.addEventListener('mouseup', clearTimer);
    friendEl.addEventListener('mouseleave', clearTimer);
    friendEl.addEventListener('touchend', clearTimer);
    friendEl.addEventListener('touchmove', cancelLongPressOnMove, { passive: true });
    friendEl.addEventListener('touchcancel', clearTimer);

    friendEl.addEventListener('click', (event) => {
        if (longPressTriggered) {
            event.preventDefault();
            event.stopPropagation();
            longPressTriggered = false;
            return;
        }

        if (isFriendSelectionMode) {
            event.preventDefault();
            event.stopPropagation();
            toggleFriendSelection(user.uid);
            return;
        }

        selectUser(user);
    });
}

// Renderizar lista de usuários
function renderUsers(users) {
    const previousScrollTop = usersList ? usersList.scrollTop : 0;
    usersList.innerHTML = '';

    if (!users || users.length === 0) {
        const li = document.createElement('li');
        li.className = 'user-item empty';
        li.innerHTML = `
            <div class="user-item-info">
                <h4>Nenhum contato</h4>
                <p>Adicione um amigo pelo e-mail ou @primeironome acima.</p>
            </div>
        `;
        usersList.appendChild(li);
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        li.className = `user-item ${selectedUserId === user.uid ? 'active' : ''}`;
        if (isFriendSelectionMode) {
            li.classList.add('user-item-select-mode');
            li.classList.toggle('user-item-selected', selectedFriendIds.has(user.uid));
        }
        li.dataset.uid = user.uid;
        
        const status = getUserPresenceStatusText(user);
        const statusClass = status === 'Online' ? 'status-online-text' : '';
        
        const { fallback: fallbackPhoto, url: photoUrl } = resolvePhotoSources(
            user,
            'https://via.placeholder.com/45/cccccc/666666?text=User'
        );
        li.innerHTML = `
            <img src="${fallbackPhoto}" data-photo-url="${user.photoURL || ''}" alt="avatar">
            <div class="user-item-info">
                <h4>${user.name || 'Usuário'}</h4>
                <p class="${statusClass}">${status}</p>
            </div>
        `;

        const avatar = li.querySelector('img');
        if (photoUrl) {
            hydratePhotoFromUrl(avatar, photoUrl, fallbackPhoto);
        }

        bindFriendSelectionInteractions(li, user);
        usersList.appendChild(li);
    });

    if (usersList) {
        usersList.scrollTop = previousScrollTop;
    }
}

// Formatar última visualização
function formatLastSeen(date) {
    if (!date) return '';
    const locale = selectedLanguage === 'en-US' ? 'en-US' : 'pt-BR';
    const now = new Date();
    const diffMs = now - date;
    const timeText = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    const dayMs = 24 * 60 * 60 * 1000;
    if (diffMs < dayMs) {
        return timeText;
    }
    const dateText = date.toLocaleDateString(locale);
    return `${dateText} ${timeText}`;
}

function timestampToDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (value?.toDate) return value.toDate();
    return null;
}

function isUserEffectivelyOnline(user) {
    if (!user?.online) return false;
    const lastSeenDate = timestampToDate(user.lastSeen);
    if (!lastSeenDate) return false;
    return Date.now() - lastSeenDate.getTime() <= ONLINE_STALE_MS;
}

function isUserPresenceVisible(user) {
    return user?.showOnlineStatus !== false;
}

function getUserPresenceStatusText(user) {
    if (!user) return '';
    if (!isUserPresenceVisible(user)) return getUiText('presenceHidden');
    if (isUserEffectivelyOnline(user)) return 'Online';
    if (!showLastSeenEnabled) return getUiText('presenceOffline');

    const lastSeenDate = timestampToDate(user.lastSeen);
    const lastSeen = lastSeenDate ? formatLastSeen(lastSeenDate) : '';
    return lastSeen ? formatUiText('presenceLastSeen', { time: lastSeen }) : getUiText('presenceOffline');
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
    clearLocalTypingState();
    clearEditingMessage();
    if (isFriendSelectionMode) {
        resetFriendSelectionState();
    }
    if (isMobileLayout() && document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
    }
    selectedUserId = user.uid;
    selectedFriendData = user;
    resetMessageSelectionState();
    clearReplyTargetMessage();
    
    // Atualizar seleção na lista
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.toggle('active', item.dataset.uid === user.uid);
    });
    
    // Atualizar cabeçalho do chat
    chatPartnerName.textContent = user.name || 'Usuário';
    applyProfilePhoto(chatPartnerPhoto, user, 'https://via.placeholder.com/45/cccccc/666666?text=User');
    const isBlocked = isFriendBlocked(user.uid);
    remoteUserActivityState = null;
    setChatPartnerActivity(null);
    
    // Habilitar input
    const disableChat = isBlocked;
    messageInput.disabled = disableChat;
    btnSend.disabled = disableChat;
    btnAttach.disabled = disableChat;
    if (btnEmoji) btnEmoji.disabled = disableChat;
    if (btnVoice) btnVoice.disabled = disableChat;
    if (btnCameraQuick) btnCameraQuick.disabled = disableChat;
    if (btnCall) btnCall.disabled = disableChat;
    if (btnVideoCall) btnVideoCall.disabled = disableChat;
    if (!disableChat && shouldAutoFocusMessageInput()) {
        messageInput.focus();
    }
    updateComposerPrimaryAction();

    if (emojiPicker) emojiPicker.classList.add('hidden');
    
    // Esconder mensagem de boas-vindas
    document.querySelector('.welcome-message')?.remove();
    
    // Carregar mensagens
    subscribeToFriendDoc(user.uid);
    await loadMessages(user.uid);

    // Fechar sidebar no mobile apos selecionar
    setSidebarOpen(false);
}

// Carregar mensagens em tempo real
async function loadMessages(otherUid) {
    if (messagesUnsubscribe) messagesUnsubscribe();
    if (typingUnsubscribe) typingUnsubscribe();
    
    const conversationId = getConversationId(currentUser.uid, otherUid);
    currentConversationId = conversationId;
    let hasLoadedInitialSnapshot = false;

    listenTypingStatus(otherUid);
    
    messagesUnsubscribe = db.collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            if (hasLoadedInitialSnapshot) {
                const incomingChanges = snapshot.docChanges().filter((change) => {
                    if (change.type !== 'added') return false;
                    const data = change.doc.data();
                    return data?.senderId === otherUid;
                });

                if (incomingChanges.length > 0) {
                    playIncomingMessageTone(otherUid);
                    const latestIncoming = incomingChanges[incomingChanges.length - 1].doc.data();
                    showIncomingDesktopNotification(otherUid, latestIncoming);

                    incomingChanges.forEach((change) => {
                        const msgData = change.doc.data() || {};
                        const message = { id: change.doc.id, ...msgData };
                        autoDownloadIncomingAttachment(conversationId, message);
                    });
                }
            }

            const messages = [];
            snapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                if (isMessageHiddenForCurrentUser(data)) return;
                messages.push(data);
            });
            currentConversationMessages = messages;
            if (editingMessage?.id) {
                const latestEditingMessage = messages.find((msg) => msg.id === editingMessage.id);
                if (!latestEditingMessage || !canEditMessage(latestEditingMessage)) {
                    clearEditingMessage();
                } else {
                    editingMessage = latestEditingMessage;
                    syncComposerEditModeUI();
                }
            }
            if (isMessageSelectionMode) {
                const validIds = new Set(messages.map((msg) => msg.id));
                selectedMessageIds.forEach((id) => {
                    if (!validIds.has(id)) selectedMessageIds.delete(id);
                });
                if (selectedMessageIds.size === 0) {
                    isMessageSelectionMode = false;
                }
            }
            renderMessages(messages);
            updateMessageSelectionUI();
            updateMessageAttachmentUrls(conversationId, messages);
            updateMessageDeliveryStatus(conversationId, messages);
            updateOutgoingDeliveryStatus(conversationId, messages);
            
            // Marcar mensagens como lidas
            markMessagesAsRead(conversationId);
            hasLoadedInitialSnapshot = true;
        });
}

// Gerar ID da conversa
function getConversationId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

// Marcar mensagens como lidas
async function markMessagesAsRead(conversationId) {
    if (!currentUser || !selectedUserId) return;
    if (!readReceiptsEnabled) return;
    
    const messagesRef = db.collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .where('senderId', '==', selectedUserId)
        .where('read', '==', false);
    
    const snapshot = await messagesRef.get();
    
    const batch = db.batch();
    snapshot.forEach(doc => {
        batch.update(doc.ref, {
            read: true,
            readAt: firebase.firestore.FieldValue.serverTimestamp(),
            delivered: true,
            deliveredAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    });
    
    await batch.commit();
}

function updateMessageDeliveryStatus(conversationId, messages) {
    if (!currentUser || !conversationId || !messages?.length) return;
    const batch = db.batch();
    let hasUpdates = false;

    messages.forEach(msg => {
        if (!msg?.id) return;
        if (msg.receiverId !== currentUser.uid) return;
        if (msg.delivered === true) return;
        const ref = db.collection('conversations')
            .doc(conversationId)
            .collection('messages')
            .doc(msg.id);
        batch.update(ref, {
            delivered: true,
            deliveredAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        hasUpdates = true;
    });

    if (hasUpdates) {
        batch.commit().catch((error) => {
            console.warn('Falha ao atualizar entrega das mensagens.', error);
        });
    }
}

function updateOutgoingDeliveryStatus(conversationId, messages) {
    const resolvedConversationId = conversationId || currentConversationId;
    const resolvedMessages = messages?.length ? messages : currentConversationMessages;
    if (!currentUser || !resolvedConversationId || !resolvedMessages?.length) return;
    if (!isUserEffectivelyOnline(selectedFriendData)) return;
    const batch = db.batch();
    let hasUpdates = false;

    resolvedMessages.forEach(msg => {
        if (!msg?.id) return;
        if (msg.senderId !== currentUser.uid) return;
        if (msg.receiverId !== selectedUserId) return;
        if (msg.delivered === true) return;
        const ref = db.collection('conversations')
            .doc(resolvedConversationId)
            .collection('messages')
            .doc(msg.id);
        batch.update(ref, {
            delivered: true,
            deliveredAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        hasUpdates = true;
    });

    if (hasUpdates) {
        batch.commit().catch((error) => {
            console.warn('Falha ao atualizar entrega (remetente).', error);
        });
    }
}

function updateMessageAttachmentUrls(conversationId, messages) {
    if (!conversationId || !messages?.length || !currentUser) return;
    const batch = db.batch();
    let hasUpdates = false;

    messages.forEach(msg => {
        if (!msg?.id) return;
        const patch = {};
        if (msg.fileUrl && msg.fileUrl.startsWith('/')) {
            patch.fileUrl = normalizeBackendUrl(msg.fileUrl);
        }
        if (msg.imageUrl && msg.imageUrl.startsWith('/')) {
            patch.imageUrl = normalizeBackendUrl(msg.imageUrl);
        }
        if (Object.keys(patch).length) {
            const ref = db.collection('conversations')
                .doc(conversationId)
                .collection('messages')
                .doc(msg.id);
            batch.update(ref, patch);
            hasUpdates = true;
        }
    });

    if (hasUpdates) {
        batch.commit().catch((error) => {
            console.warn('Falha ao atualizar URLs antigas.', error);
        });
    }
}

function applyChatBackground(backgroundDataUrl, persist = false) {
    const normalized = (backgroundDataUrl || '').startsWith('data:image/') ? backgroundDataUrl : '';
    chatBackgroundDataUrl = normalized;
    const darkTheme = document.body.classList.contains('theme-dark');
    const overlay = darkTheme
        ? 'linear-gradient(rgba(17, 24, 39, 0.72), rgba(17, 24, 39, 0.72))'
        : 'linear-gradient(rgba(245, 247, 251, 0.68), rgba(245, 247, 251, 0.68))';

    if (messagesContainer) {
        if (normalized) {
            messagesContainer.style.backgroundImage = `${overlay}, url("${normalized}")`;
            messagesContainer.style.backgroundSize = 'cover';
            messagesContainer.style.backgroundRepeat = 'no-repeat';
            messagesContainer.style.backgroundPosition = 'center center';
            messagesContainer.classList.add('messages-container-custom-bg');
        } else {
            messagesContainer.style.backgroundImage = '';
            messagesContainer.style.backgroundSize = '';
            messagesContainer.style.backgroundRepeat = '';
            messagesContainer.style.backgroundPosition = '';
            messagesContainer.classList.remove('messages-container-custom-bg');
        }
    }

    refreshSettingsMenuLabels();

    if (!persist) return;
    try {
        if (normalized) {
            localStorage.setItem(CHAT_BACKGROUND_STORAGE_KEY, normalized);
        } else {
            localStorage.removeItem(CHAT_BACKGROUND_STORAGE_KEY);
        }
    } catch (error) {
        alert('Não foi possível salvar o plano de fundo neste dispositivo.');
    }
}

async function buildChatBackgroundDataUrl(file) {
    if (!file) return '';
    const sourceDataUrl = await readFileAsDataUrl(file);
    const image = await loadImageFromDataUrl(sourceDataUrl);
    const maxSide = 1600;
    let { width, height } = image;

    if (width > height) {
        if (width > maxSide) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
        }
    } else {
        if (height > maxSide) {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
        }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return sourceDataUrl;
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.82);
}

function resetMessageSelectionState() {
    isMessageSelectionMode = false;
    selectedMessageIds = new Set();
    closeMessageActionMenu();
    updateMessageSelectionUI();
}

function getMessageType(msg) {
    return msg?.type || (msg?.imageUrl ? 'image' : 'text');
}

function getSelectedTextMessagesData() {
    return getSelectedMessagesData()
        .filter((msg) => getMessageType(msg) === 'text')
        .sort((a, b) => getMessageTimestampMs(a) - getMessageTimestampMs(b));
}

function isMessageEdited(message) {
    return !!(message?.edited || message?.editedAt);
}

function canEditMessage(message) {
    if (!message || !currentUser) return false;
    if (!message.id) return false;
    if (message.senderId !== currentUser.uid) return false;
    if (getMessageType(message) !== 'text') return false;
    if (isMessageHiddenForCurrentUser(message)) return false;

    const timestampMs = getMessageTimestampMs(message);
    if (!timestampMs) return false;

    return (Date.now() - timestampMs) <= MESSAGE_EDIT_WINDOW_MS;
}

function getSelectedEditableMessageData() {
    const selectedMessages = getSelectedMessagesData();
    if (selectedMessages.length !== 1) return null;
    return canEditMessage(selectedMessages[0]) ? selectedMessages[0] : null;
}

function canManageMessageAction(message) {
    if (!message || !currentUser) return false;
    return message.senderId === currentUser.uid || message.receiverId === currentUser.uid;
}

function canCopyMessageText(message) {
    return getMessageType(message) === 'text' && !!String(message?.text || '').trim();
}

function setSingleSelectedMessage(messageId) {
    if (!messageId || !selectedUserId) return;
    isMessageSelectionMode = true;
    selectedMessageIds = new Set([messageId]);
    updateMessageSelectionUI();
    renderMessages(currentConversationMessages || []);
}

async function copyTextToClipboard(textPayload) {
    const text = String(textPayload || '').trim();
    if (!text) return false;

    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', 'readonly');
    helper.style.position = 'fixed';
    helper.style.top = '-9999px';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
    return true;
}

function closeMessageActionMenu() {
    activeMessageActionTarget = null;
    if (messageActionMenu) {
        messageActionMenu.classList.add('hidden');
        messageActionMenu.style.left = '';
        messageActionMenu.style.top = '';
    }
}

function openMessageActionMenu(message, options = {}) {
    if (!messageActionMenu || !message?.id) return;

    const canReply = !!selectedUserId;
    const canCopy = canCopyMessageText(message);
    const canEdit = canEditMessage(message);
    const canDelete = canManageMessageAction(message);

    if (!canReply && !canCopy && !canEdit && !canDelete) {
        closeMessageActionMenu();
        return;
    }

    activeMessageActionTarget = message;

    if (messageActionReply) messageActionReply.classList.toggle('hidden', !canReply);
    if (messageActionCopy) messageActionCopy.classList.toggle('hidden', !canCopy);
    if (messageActionEdit) messageActionEdit.classList.toggle('hidden', !canEdit);
    if (messageActionDelete) messageActionDelete.classList.toggle('hidden', !canDelete);

    messageActionMenu.classList.remove('hidden');

    const margin = 12;
    const rect = options.anchorEl?.getBoundingClientRect?.() || null;
    const menuWidth = messageActionMenu.offsetWidth || 190;
    const menuHeight = messageActionMenu.offsetHeight || 196;

    let left = typeof options.clientX === 'number'
        ? options.clientX
        : (rect ? rect.left + (rect.width / 2) - (menuWidth / 2) : window.innerWidth / 2 - menuWidth / 2);
    let top = typeof options.clientY === 'number'
        ? options.clientY
        : (rect ? rect.bottom + 8 : window.innerHeight / 2 - menuHeight / 2);

    left = Math.max(margin, Math.min(window.innerWidth - menuWidth - margin, left));
    top = Math.max(margin, Math.min(window.innerHeight - menuHeight - margin, top));

    messageActionMenu.style.left = `${left}px`;
    messageActionMenu.style.top = `${top}px`;
}

async function deleteMessagesByRecords(messagesToDelete) {
    if (!Array.isArray(messagesToDelete) || messagesToDelete.length === 0) return false;

    const deleteScope = await askDeleteScope(messagesToDelete);
    if (!deleteScope) return false;

    const ids = messagesToDelete.map((msg) => msg.id).filter(Boolean);
    if (!ids.length) return false;

    if (deleteScope === 'all') {
        await deleteMessagesForEveryone(ids);
    } else {
        await deleteMessagesOnlyForCurrentUser(ids);
    }

    return true;
}

function syncComposerEditModeUI() {
    const isEditing = !!editingMessage;
    const disableComposerTools = !!messageInput?.disabled || isEditing;

    if (btnAttach) btnAttach.disabled = disableComposerTools;
    if (btnVoice) btnVoice.disabled = disableComposerTools;
    if (btnCameraQuick) btnCameraQuick.disabled = disableComposerTools;
    if (messageInput) {
        messageInput.placeholder = isEditing ? 'Corrija sua mensagem...' : DEFAULT_MESSAGE_INPUT_PLACEHOLDER;
    }
    if (editPreview) {
        editPreview.classList.toggle('hidden', !isEditing);
    }
    if (editPreviewLabel) {
        editPreviewLabel.textContent = 'Editando mensagem';
    }
    if (editPreviewText) {
        editPreviewText.textContent = isEditing ? String(editingMessage?.text || '') : '';
    }
}

function clearEditingMessage(options = {}) {
    const shouldClearInput = options.clearInput !== false;
    editingMessage = null;

    if (editPreview) editPreview.classList.add('hidden');
    if (editPreviewText) editPreviewText.textContent = '';
    if (messageInput) {
        messageInput.placeholder = DEFAULT_MESSAGE_INPUT_PLACEHOLDER;
        if (shouldClearInput) {
            messageInput.value = '';
        }
    }
    if (shouldClearInput) {
        updateTypingState(null, true);
    }

    syncComposerEditModeUI();
    updateComposerPrimaryAction();
}

function setEditingMessage(message) {
    if (!canEditMessage(message)) {
        alert('Esta mensagem não pode mais ser editada.');
        return false;
    }

    clearReplyTargetMessage();
    editingMessage = { ...message };

    if (messageInput) {
        messageInput.value = String(message.text || '');
        messageInput.focus();
        const textLength = messageInput.value.length;
        if (typeof messageInput.setSelectionRange === 'function') {
            messageInput.setSelectionRange(textLength, textLength);
        }
    }

    syncComposerEditModeUI();
    updateComposerPrimaryAction();
    return true;
}

function updateMessageSelectionUI() {
    const hasConversationSelected = !!selectedUserId;
    const selectedCount = selectedMessageIds.size;
    const hasSelection = hasConversationSelected && selectedCount > 0;
    const selectedMessages = hasSelection ? getSelectedMessagesData() : [];
    const canCopyText = hasSelection
        && selectedMessages.length > 0
        && selectedMessages.every((msg) => getMessageType(msg) === 'text');
    const editableMessage = hasSelection ? getSelectedEditableMessageData() : null;
    const canEditSelection = !!editableMessage;
    if (btnEditSelected) {
        btnEditSelected.classList.toggle('hidden', !canEditSelection);
        btnEditSelected.disabled = !canEditSelection;
        btnEditSelected.title = canEditSelection
            ? 'Editar mensagem selecionada'
            : 'Editar mensagem selecionada';
    }
    if (btnDeleteSelected) {
        btnDeleteSelected.classList.toggle('hidden', !hasSelection);
        btnDeleteSelected.disabled = !hasSelection;
        btnDeleteSelected.title = selectedCount > 0
            ? `Excluir selecionadas (${selectedCount})`
            : 'Excluir selecionadas';
    }
    if (btnCopySelected) {
        btnCopySelected.classList.toggle('hidden', !canCopyText);
        btnCopySelected.disabled = !canCopyText;
        btnCopySelected.title = selectedCount > 0
            ? `Copiar selecionadas (${selectedCount})`
            : 'Copiar selecionadas';
    }
    if (btnShareSelected) {
        btnShareSelected.classList.toggle('hidden', !hasSelection);
        btnShareSelected.disabled = !hasSelection;
        btnShareSelected.title = selectedCount > 0
            ? `Compartilhar selecionadas (${selectedCount})`
            : 'Compartilhar selecionadas';
    }
    updateChatSelectionSummary();
}

function setMessageSelectionMode(enabled) {
    const shouldEnable = !!enabled && !!selectedUserId;
    if (shouldEnable && editingMessage) {
        clearEditingMessage();
    }
    isMessageSelectionMode = shouldEnable;
    if (!shouldEnable) {
        selectedMessageIds = new Set();
        closeShareMessageModal();
        closeMessageActionMenu();
    }
    updateMessageSelectionUI();
    renderMessages(currentConversationMessages || [], { preserveScroll: true });
}

function toggleMessageSelection(messageId) {
    if (!messageId) return;
    if (!isMessageSelectionMode) {
        setMessageSelectionMode(true);
    }
    closeMessageActionMenu();
    if (selectedMessageIds.has(messageId)) {
        selectedMessageIds.delete(messageId);
    } else {
        selectedMessageIds.add(messageId);
    }
    if (selectedMessageIds.size === 0) {
        setMessageSelectionMode(false);
        return;
    }
    updateMessageSelectionUI();
    renderMessages(currentConversationMessages || [], { preserveScroll: true });
}

function activateMessageSelectionByLongPress(messageId, options = {}) {
    if (!messageId) return;
    const shouldShowQuickMenu = !!options.showQuickMenu && !isMessageSelectionMode && options.message;
    if (!isMessageSelectionMode) {
        isMessageSelectionMode = true;
        selectedMessageIds = new Set([messageId]);
    } else {
        selectedMessageIds.add(messageId);
    }
    closeMessageActionMenu();
    suppressMediaOpenUntil = Date.now() + 900;
    updateMessageSelectionUI();
    renderMessages(currentConversationMessages || [], { preserveScroll: true });
    if (shouldShowQuickMenu) {
        window.setTimeout(() => {
            if (selectedMessageIds.size === 1 && selectedMessageIds.has(messageId)) {
                openMessageActionMenu(options.message, {
                    clientX: options.clientX,
                    clientY: options.clientY
                });
            }
        }, 0);
    }
}

function isMessageHiddenForCurrentUser(msg) {
    if (!msg || !currentUser) return false;
    const deletedFor = Array.isArray(msg.deletedFor) ? msg.deletedFor : [];
    return deletedFor.includes(currentUser.uid);
}

function getSelectedMessagesData() {
    if (!Array.isArray(currentConversationMessages) || !currentConversationMessages.length) return [];
    if (!selectedMessageIds.size) return [];
    return currentConversationMessages.filter((msg) => selectedMessageIds.has(msg.id));
}

function canDeleteMessageForAll(msg) {
    if (!msg || !currentUser) return false;
    if (msg.senderId !== currentUser.uid) return false;
    if (msg.read === true) return false;
    if (isMessageHiddenForCurrentUser(msg)) return false;
    return true;
}

function closeDeleteMessageModal() {
    if (deleteMessageModal) {
        deleteMessageModal.classList.remove('show');
    }
    if (deleteMessageModalResolver) {
        deleteMessageModalResolver(null);
        deleteMessageModalResolver = null;
    }
}

function closeShareMessageModal() {
    if (shareMessageModal) {
        shareMessageModal.classList.remove('show');
    }
    if (shareMessageFriendsList) {
        shareMessageFriendsList.innerHTML = '';
    }
    if (shareMessageModalResolver) {
        shareMessageModalResolver(null);
        shareMessageModalResolver = null;
    }
}

function getShareableFriends() {
    if (!Array.isArray(allUsersCache) || !Array.isArray(currentFriends)) return [];
    const friendSet = new Set(currentFriends);
    const blockedSet = new Set(currentUserProfile?.blocked || []);

    const shareable = allUsersCache.filter((user) => {
        if (!user?.uid) return false;
        if (!friendSet.has(user.uid)) return false;
        if (user.disabled) return false;
        if (blockedSet.has(user.uid)) return false;
        if (user.uid === selectedUserId) return false;
        return true;
    });

    shareable.sort((a, b) => {
        const aOnline = isUserPresenceVisible(a) && isUserEffectivelyOnline(a);
        const bOnline = isUserPresenceVisible(b) && isUserEffectivelyOnline(b);
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
        return (b.lastSeen?.seconds || 0) - (a.lastSeen?.seconds || 0);
    });

    return shareable;
}

function buildShareFriendItem(user) {
    const li = document.createElement('li');
    li.className = 'share-message-friend-item';
    li.dataset.uid = user.uid;
    const safeName = escapeHtml(user.name || 'Usuário');
    const safeStatus = escapeHtml(getUserPresenceStatusText(user));

    li.innerHTML = `
        <img src="https://via.placeholder.com/40/cccccc/666666?text=User" alt="avatar">
        <div class="share-message-friend-info">
            <strong>${safeName}</strong>
            <small>${safeStatus}</small>
        </div>
        <button type="button" class="btn-primary share-message-pick-btn">Selecionar</button>
    `;

    const avatar = li.querySelector('img');
    if (avatar) {
        applyProfilePhoto(avatar, user, 'https://via.placeholder.com/40/cccccc/666666?text=User');
    }

    return li;
}

async function askShareTargetUser() {
    const shareableFriends = getShareableFriends();
    if (!shareableFriends.length) {
        alert('Você precisa ter outro amigo disponível para compartilhar.');
        return null;
    }

    if (!shareMessageModal || !shareMessageFriendsList) {
        return shareableFriends[0].uid;
    }

    shareMessageFriendsList.innerHTML = '';
    shareableFriends.forEach((friend) => {
        const item = buildShareFriendItem(friend);
        const choose = () => {
            if (shareMessageModalResolver) {
                const resolve = shareMessageModalResolver;
                shareMessageModalResolver = null;
                shareMessageModal.classList.remove('show');
                shareMessageFriendsList.innerHTML = '';
                resolve(friend.uid);
            }
        };
        item.addEventListener('click', (event) => {
            if (event.target.closest('.share-message-pick-btn') || event.target === item || event.target.closest('.share-message-friend-info') || event.target.tagName === 'IMG') {
                choose();
            }
        });
        shareMessageFriendsList.appendChild(item);
    });

    shareMessageModal.classList.add('show');
    return await new Promise((resolve) => {
        shareMessageModalResolver = resolve;
    });
}

async function askDeleteScope(messagesToDelete) {
    if (!Array.isArray(messagesToDelete) || messagesToDelete.length === 0) return null;
    const allowDeleteForAll = messagesToDelete.every((msg) => canDeleteMessageForAll(msg));
    const total = messagesToDelete.length;
    const noun = total === 1 ? 'item' : 'itens';

    if (!deleteMessageModal || !deleteMessageModalText || !btnDeleteMessageMe || !btnDeleteMessageAll) {
        if (allowDeleteForAll) {
            const confirmedAll = confirm(`Excluir ${total} ${noun} para todos?\n\nOK = Excluir para todos\nCancelar = Excluir só para mim`);
            return confirmedAll ? 'all' : 'me';
        }
        const confirmedMine = confirm(`Excluir ${total} ${noun} selecionado(s) só para você?`);
        return confirmedMine ? 'me' : null;
    }

    deleteMessageModalText.textContent = allowDeleteForAll
        ? `Você selecionou ${total} ${noun}. Escolha como deseja excluir:`
        : `Você selecionou ${total} ${noun}. Esse conteúdo só pode ser excluído para você.`;
    btnDeleteMessageAll.classList.toggle('hidden', !allowDeleteForAll);

    deleteMessageModal.classList.add('show');

    return await new Promise((resolve) => {
        deleteMessageModalResolver = resolve;
    });
}

async function deleteMessagesForEveryone(messageIds) {
    if (!currentConversationId || !Array.isArray(messageIds) || messageIds.length === 0) return;

    const uniqueIds = Array.from(new Set(messageIds.filter(Boolean)));
    if (!uniqueIds.length) return;

    const chunkSize = 400;
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
        const batch = db.batch();
        const chunk = uniqueIds.slice(i, i + chunkSize);
        chunk.forEach((id) => {
            const ref = db.collection('conversations')
                .doc(currentConversationId)
                .collection('messages')
                .doc(id);
            batch.delete(ref);
        });
        await batch.commit();
    }
}

async function deleteMessagesOnlyForCurrentUser(messageIds) {
    if (!currentConversationId || !currentUser || !Array.isArray(messageIds) || !messageIds.length) return;
    const uniqueIds = Array.from(new Set(messageIds.filter(Boolean)));
    if (!uniqueIds.length) return;

    const chunkSize = 300;
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
        const batch = db.batch();
        const chunk = uniqueIds.slice(i, i + chunkSize);
        chunk.forEach((id) => {
            const ref = db.collection('conversations')
                .doc(currentConversationId)
                .collection('messages')
                .doc(id);
            batch.update(ref, {
                deletedFor: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        await batch.commit();
    }
}

async function deleteSelectedMessages() {
    if (!isMessageSelectionMode || selectedMessageIds.size === 0) return;

    const selectedMessages = getSelectedMessagesData();
    if (!selectedMessages.length) {
        resetMessageSelectionState();
        renderMessages(currentConversationMessages || []);
        return;
    }

    try {
        const deleted = await deleteMessagesByRecords(selectedMessages);
        if (!deleted) return;
        resetMessageSelectionState();
        renderMessages(currentConversationMessages || []);
    } catch (error) {
        alert('Não foi possível excluir os itens selecionados.');
    }
}

function getMessageTimestampMs(message) {
    const date = timestampToDate(message?.timestamp);
    return date ? date.getTime() : 0;
}

function buildForwardMessagePayload(msg, targetUid, delivered) {
    const messageType = msg?.type || (msg?.imageUrl ? 'image' : 'text');
    const payload = {
        senderId: currentUser.uid,
        receiverId: targetUid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: messageType,
        read: false,
        delivered: delivered,
        deliveredAt: delivered ? firebase.firestore.FieldValue.serverTimestamp() : null,
        forwarded: true,
        forwardedFromUid: msg?.senderId || null,
        forwardedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (messageType === 'text') {
        payload.text = msg?.text || '';
        return payload;
    }

    payload.fileUrl = msg?.fileUrl || msg?.imageUrl || null;
    payload.imageUrl = messageType === 'image'
        ? (msg?.imageUrl || msg?.fileUrl || null)
        : null;
    payload.fileName = msg?.fileName || null;
    payload.fileType = msg?.fileType || null;
    payload.fileSize = Number(msg?.fileSize || 0) || null;
    return payload;
}

async function forwardMessagesToFriend(messagesToForward, targetUid) {
    if (!currentUser || !targetUid || !Array.isArray(messagesToForward) || !messagesToForward.length) return;
    const conversationId = getConversationId(currentUser.uid, targetUid);
    const targetFriend = allUsersCache.find((user) => user.uid === targetUid) || null;
    const delivered = isUserEffectivelyOnline(targetFriend);
    const sorted = [...messagesToForward].sort((a, b) => getMessageTimestampMs(a) - getMessageTimestampMs(b));

    const chunkSize = 250;
    for (let i = 0; i < sorted.length; i += chunkSize) {
        const batch = db.batch();
        const chunk = sorted.slice(i, i + chunkSize);
        chunk.forEach((msg) => {
            const ref = db.collection('conversations')
                .doc(conversationId)
                .collection('messages')
                .doc();
            const payload = buildForwardMessagePayload(msg, targetUid, delivered);
            batch.set(ref, payload);
        });
        await batch.commit();
    }
}

async function shareSelectedMessages() {
    if (!isMessageSelectionMode || selectedMessageIds.size === 0) return;
    const selectedMessages = getSelectedMessagesData();
    if (!selectedMessages.length) {
        resetMessageSelectionState();
        renderMessages(currentConversationMessages || []);
        return;
    }

    const targetUid = await askShareTargetUser();
    if (!targetUid) return;
    if (isFriendBlocked(targetUid)) {
        alert('Você bloqueou este usuário. Desbloqueie para compartilhar.');
        return;
    }

    try {
        const targetFriend = getCachedUserByUid(targetUid);
        await forwardMessagesToFriend(selectedMessages, targetUid);
        resetMessageSelectionState();
        if (targetFriend) {
            await selectUser(targetFriend);
        } else {
            renderMessages(currentConversationMessages || []);
        }
    } catch (error) {
        alert('Não foi possível compartilhar as mensagens selecionadas.');
    }
}

async function copySelectedTextMessages() {
    if (!isMessageSelectionMode || selectedMessageIds.size === 0) return;
    const selectedTextMessages = getSelectedTextMessagesData();
    if (!selectedTextMessages.length) {
        return;
    }

    const textPayload = selectedTextMessages
        .map((msg) => String(msg?.text || '').trim())
        .filter(Boolean)
        .join('\n');

    if (!textPayload) return;

    try {
        await copyTextToClipboard(textPayload);
    } catch (error) {
        alert('Não foi possível copiar as mensagens selecionadas.');
    }
}

async function editSelectedMessage() {
    const editableMessage = getSelectedEditableMessageData();
    if (!editableMessage) {
        alert('Selecione apenas uma mensagem de texto enviada por você nos últimos 30 minutos.');
        return;
    }

    closeMessageActionMenu();
    setMessageSelectionMode(false);
    setEditingMessage(editableMessage);
}

async function handleMessageActionReply() {
    if (!activeMessageActionTarget) return;
    const targetMessage = activeMessageActionTarget;
    closeMessageActionMenu();
    setMessageSelectionMode(false);
    setReplyTargetMessage(targetMessage);
}

async function handleMessageActionCopy() {
    if (!activeMessageActionTarget || !canCopyMessageText(activeMessageActionTarget)) return;
    try {
        await copyTextToClipboard(String(activeMessageActionTarget.text || ''));
        closeMessageActionMenu();
    } catch (error) {
        alert('Não foi possível copiar esta mensagem.');
    }
}

async function handleMessageActionEdit() {
    if (!activeMessageActionTarget || !canEditMessage(activeMessageActionTarget)) return;
    const targetMessage = activeMessageActionTarget;
    closeMessageActionMenu();
    setSingleSelectedMessage(targetMessage.id);
    await editSelectedMessage();
}

async function handleMessageActionDelete() {
    if (!activeMessageActionTarget || !canManageMessageAction(activeMessageActionTarget)) return;
    const targetMessage = activeMessageActionTarget;
    closeMessageActionMenu();
    try {
        const deleted = await deleteMessagesByRecords([targetMessage]);
        if (!deleted) return;
        resetMessageSelectionState();
        renderMessages(currentConversationMessages || []);
    } catch (error) {
        alert('Não foi possível excluir esta mensagem.');
    }
}

function shouldBlockMessagePrimaryAction(event) {
    if (Date.now() < suppressMediaOpenUntil || isMessageSelectionMode) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        return true;
    }
    return false;
}

function bindMessageSelectionInteractions(rowEl, messageId, options = {}) {
    if (!rowEl || !messageId) return;

    const bubbleEl = options.bubbleEl || rowEl;
    const message = options.message || null;
    let longPressTimer = null;
    let longPressTriggered = false;
    let pressClientX = 0;
    let pressClientY = 0;
    let startedFromTouch = false;

    const clearTimer = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    const shouldIgnoreStart = (target) => {
        return !!target?.closest?.('a,video,audio,button,input,textarea,iframe');
    };

    const startLongPress = (event) => {
        if (event && typeof event.button === 'number' && event.button !== 0) return;
        if (shouldIgnoreStart(event?.target)) return;
        clearTimer();
        longPressTriggered = false;
        startedFromTouch = event?.type?.startsWith('touch') || false;

        if (event?.touches?.[0]) {
            pressClientX = event.touches[0].clientX;
            pressClientY = event.touches[0].clientY;
        } else {
            pressClientX = event?.clientX ?? 0;
            pressClientY = event?.clientY ?? 0;
        }

        longPressTimer = setTimeout(() => {
            longPressTriggered = true;
            activateMessageSelectionByLongPress(messageId, {
                showQuickMenu: startedFromTouch,
                message,
                clientX: pressClientX,
                clientY: pressClientY
            });
        }, MESSAGE_LONG_PRESS_MS);
    };

    const cancelLongPressOnMove = (event) => {
        if (event?.touches?.[0]) {
            const deltaX = Math.abs(event.touches[0].clientX - pressClientX);
            const deltaY = Math.abs(event.touches[0].clientY - pressClientY);
            if (deltaX > 12 || deltaY > 12) {
                clearTimer();
            }
            return;
        }
        clearTimer();
    };

    rowEl.addEventListener('mousedown', startLongPress);
    rowEl.addEventListener('touchstart', startLongPress, { passive: true });
    rowEl.addEventListener('mousemove', cancelLongPressOnMove);
    rowEl.addEventListener('mouseup', clearTimer);
    rowEl.addEventListener('mouseleave', clearTimer);
    rowEl.addEventListener('touchend', clearTimer);
    rowEl.addEventListener('touchmove', cancelLongPressOnMove, { passive: true });
    rowEl.addEventListener('touchcancel', clearTimer);

    rowEl.addEventListener('contextmenu', (event) => {
        if (Date.now() < suppressMediaOpenUntil || !message) {
            event.preventDefault();
            return;
        }
        if (shouldIgnoreStart(event.target)) return;
        event.preventDefault();
        setSingleSelectedMessage(messageId);
        openMessageActionMenu(message, {
            clientX: event.clientX,
            clientY: event.clientY
        });
    });

    rowEl.addEventListener('click', (event) => {
        if (longPressTriggered) {
            event.preventDefault();
            event.stopPropagation();
            longPressTriggered = false;
            return;
        }
        if (!isMessageSelectionMode) return;
        if (event.target.closest('.message-action-menu')) return;
        if (event.target.closest('audio') || event.target.closest('video')) {
            return;
        }
        if (event.target.closest('a')) {
            event.preventDefault();
        }
        toggleMessageSelection(messageId);
    });
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeExternalLink(rawUrl) {
    let value = String(rawUrl || '').trim();
    if (!value) return '';
    if (/^www\./i.test(value)) {
        value = `https://${value}`;
    }
    try {
        const parsed = new URL(value);
        if (!['http:', 'https:'].includes(parsed.protocol)) return '';
        return parsed.href;
    } catch (error) {
        return '';
    }
}

function extractMessageLinks(text) {
    const source = String(text || '');
    const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/gi;
    const links = [];
    let match = null;

    while ((match = urlRegex.exec(source)) !== null) {
        let candidate = match[0];
        while (candidate && /[),.;!?]$/.test(candidate)) {
            candidate = candidate.slice(0, -1);
        }
        const normalized = normalizeExternalLink(candidate);
        if (normalized && !links.includes(normalized)) {
            links.push(normalized);
        }
    }

    return links;
}

function linkifyMessageText(text) {
    const source = String(text || '');
    const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/gi;
    let lastIndex = 0;
    let output = '';
    let match = null;

    while ((match = urlRegex.exec(source)) !== null) {
        const fullMatch = match[0];
        const start = match.index;
        const end = start + fullMatch.length;
        output += escapeHtml(source.slice(lastIndex, start));

        let candidate = fullMatch;
        let trailing = '';
        while (candidate && /[),.;!?]$/.test(candidate)) {
            trailing = candidate.slice(-1) + trailing;
            candidate = candidate.slice(0, -1);
        }

        const normalizedUrl = normalizeExternalLink(candidate);
        if (normalizedUrl) {
            output += `<a class="chat-text-link" href="${escapeHtml(normalizedUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(candidate)}</a>${escapeHtml(trailing)}`;
        } else {
            output += escapeHtml(fullMatch);
        }
        lastIndex = end;
    }

    output += escapeHtml(source.slice(lastIndex));
    return output;
}

function extractYouTubeId(url) {
    try {
        const parsed = new URL(url);
        const host = (parsed.hostname || '').toLowerCase();
        if (host.includes('youtu.be')) {
            return parsed.pathname.split('/').filter(Boolean)[0] || '';
        }
        if (host.includes('youtube.com')) {
            return parsed.searchParams.get('v') || '';
        }
    } catch (error) {
        return '';
    }
    return '';
}

function buildLinkPreviewData(url) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./i, '');
        const path = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : '';
        const title = `${host}${path}`;
        const youtubeId = extractYouTubeId(url);

        if (youtubeId) {
            return {
                url,
                host,
                title,
                description: 'Pré-visualização do link',
                thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
            };
        }

        const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(host)}`;
        const screenshotUrl = `https://image.thum.io/get/width/700/crop/360/noanimate/${url}`;
        return {
            url,
            host,
            title,
            description: 'Pré-visualização do link',
            thumbnailUrl: screenshotUrl,
            fallbackIconUrl: faviconUrl
        };
    } catch (error) {
        return null;
    }
}

function renderLinkPreviewHtml(text) {
    const links = extractMessageLinks(text);
    if (!links.length) return '';
    const preview = buildLinkPreviewData(links[0]);
    if (!preview) return '';

    const safeUrl = escapeHtml(preview.url);
    const safeTitle = escapeHtml(preview.title || preview.host || preview.url);
    const safeHost = escapeHtml(preview.host || preview.url);
    const safeDescription = escapeHtml(preview.description || '');
    const thumb = preview.thumbnailUrl
        ? `<img class="message-link-preview-thumb-image" src="${escapeHtml(preview.thumbnailUrl)}" alt="Prévia do link" loading="lazy" referrerpolicy="no-referrer">`
        : '';
    const icon = preview.fallbackIconUrl
        ? `<img class="message-link-preview-favicon" src="${escapeHtml(preview.fallbackIconUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer">`
        : '<span class="message-link-preview-favicon message-link-preview-favicon-placeholder">&#128279;</span>';

    return `
        <a class="message-link-preview" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
            <div class="message-link-preview-thumb ${thumb ? '' : 'no-thumb'}">
                ${thumb}
            </div>
            <div class="message-link-preview-info">
                <strong>${safeTitle}</strong>
                <span>${safeDescription}</span>
                <small>${icon}<em>${safeHost}</em></small>
            </div>
        </a>
    `;
}

function getReplySnippetTextFromMessage(message) {
    const type = getMessageType(message);
    if (type === 'text') return String(message?.text || '').trim() || 'Mensagem';
    if (type === 'image') return message?.fileName ? `Foto: ${message.fileName}` : 'Foto';
    if (type === 'video') return message?.fileName ? `Vídeo: ${message.fileName}` : 'Vídeo';
    if (type === 'audio') return message?.fileName ? `Áudio: ${message.fileName}` : 'Áudio';
    if (type === 'file') return message?.fileName ? `Arquivo: ${message.fileName}` : 'Arquivo';
    return 'Mensagem';
}

function getReplyThumbnailUrl(message) {
    const type = getMessageType(message);
    if (type === 'image') {
        return message?.imageUrl || message?.fileUrl || getAttachmentDownloadUrl(message);
    }
    return '';
}

function getDisplayNameByUid(uid) {
    if (!uid || !currentUser) return 'Usuário';
    if (uid === currentUser.uid) return 'Você';
    return getCachedUserByUid(uid)?.name || selectedFriendData?.name || 'Usuário';
}

function normalizeReplyReferencePayload(sourceMessage) {
    if (!sourceMessage?.id) return null;
    const type = getMessageType(sourceMessage);
    const fileUrl = sourceMessage?.fileUrl || sourceMessage?.imageUrl || getAttachmentDownloadUrl(sourceMessage) || '';

    return {
        id: sourceMessage.id,
        senderId: sourceMessage.senderId || null,
        type,
        text: type === 'text' ? String(sourceMessage.text || '').slice(0, 1000) : '',
        fileName: sourceMessage.fileName || '',
        fileType: sourceMessage.fileType || '',
        fileUrl: fileUrl || '',
        imageUrl: sourceMessage.imageUrl || '',
        previewText: getReplySnippetTextFromMessage(sourceMessage).slice(0, 180)
    };
}

function clearReplyTargetMessage() {
    replyToMessage = null;
    if (replyPreview) replyPreview.classList.add('hidden');
    if (replyPreviewText) replyPreviewText.textContent = '';
    if (replyPreviewLabel) replyPreviewLabel.textContent = 'Respondendo';
    if (replyPreviewThumb) {
        replyPreviewThumb.classList.add('hidden');
        replyPreviewThumb.innerHTML = '';
    }
}

function setReplyTargetMessage(message) {
    if (!message?.id || !selectedUserId) return;
    if (editingMessage) {
        clearEditingMessage();
    }
    replyToMessage = message;

    if (!replyPreview || !replyPreviewLabel || !replyPreviewText || !replyPreviewThumb) {
        return;
    }

    replyPreviewLabel.textContent = `Respondendo a ${getDisplayNameByUid(message.senderId)}`;
    replyPreviewText.textContent = getReplySnippetTextFromMessage(message);

    const thumbUrl = getReplyThumbnailUrl(message);
    replyPreviewThumb.innerHTML = '';
    if (thumbUrl) {
        const img = document.createElement('img');
        img.src = thumbUrl;
        img.alt = 'Mídia respondida';
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', () => {
            replyPreviewThumb.classList.add('hidden');
        });
        replyPreviewThumb.appendChild(img);
        replyPreviewThumb.classList.remove('hidden');
    } else {
        const icon = document.createElement('span');
        icon.className = 'reply-preview-thumb-fallback';
        icon.textContent = getMessageType(message) === 'text' ? '#' : '↪';
        replyPreviewThumb.appendChild(icon);
        replyPreviewThumb.classList.remove('hidden');
    }

    replyPreview.classList.remove('hidden');
    messageInput?.focus();
}

function getPendingReplyPayload() {
    return normalizeReplyReferencePayload(replyToMessage);
}

function getReplySummaryText(replyTo) {
    if (!replyTo) return '';
    const type = getMessageType(replyTo);
    if (type === 'text') return String(replyTo.text || replyTo.previewText || 'Mensagem').trim() || 'Mensagem';
    if (replyTo.previewText) return String(replyTo.previewText);
    if (type === 'image') return replyTo.fileName ? `Foto: ${replyTo.fileName}` : 'Foto';
    if (type === 'video') return replyTo.fileName ? `Vídeo: ${replyTo.fileName}` : 'Vídeo';
    if (type === 'audio') return replyTo.fileName ? `Áudio: ${replyTo.fileName}` : 'Áudio';
    if (type === 'file') return replyTo.fileName ? `Arquivo: ${replyTo.fileName}` : 'Arquivo';
    return 'Mensagem';
}

function renderReplyReferenceHtml(replyTo) {
    if (!replyTo || typeof replyTo !== 'object') return '';

    const senderLabel = escapeHtml(getDisplayNameByUid(replyTo.senderId));
    const summary = escapeHtml(getReplySummaryText(replyTo));
    const thumbUrl = replyTo.imageUrl || (getMessageType(replyTo) === 'image' ? replyTo.fileUrl : '');
    const thumbHtml = thumbUrl
        ? `<img class="message-reply-thumb" src="${escapeHtml(thumbUrl)}" alt="Mídia respondida" loading="lazy" referrerpolicy="no-referrer">`
        : '';

    return `
        <div class="message-reply-reference">
            <div class="message-reply-accent"></div>
            <div class="message-reply-body">
                <strong>${senderLabel}</strong>
                <span>${summary}</span>
            </div>
            ${thumbHtml}
        </div>
    `;
}

function bindMessageSwipeToReply(messageEl, msg) {
    if (!messageEl || !msg?.id) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    let canTrack = false;
    let swipeTriggered = false;

    const SWIPE_TRIGGER_PX = 68;
    const SWIPE_MAX_SHIFT_PX = 64;

    const resetVisual = () => {
        messageEl.style.transform = '';
        messageEl.style.transition = '';
        messageEl.classList.remove('message-swipe-active');
    };

    const finish = () => {
        if (!tracking) return;
        tracking = false;
        if (swipeTriggered && !isMessageSelectionMode) {
            setReplyTargetMessage(msg);
        }
        swipeTriggered = false;
        canTrack = false;
        messageEl.style.transition = 'transform 0.18s ease';
        resetVisual();
    };

    const onStart = (clientX, clientY, eventTarget) => {
        if (isMessageSelectionMode) return;
        if (eventTarget?.closest?.('a,video,audio,button,input,textarea,iframe')) return;
        tracking = true;
        canTrack = true;
        swipeTriggered = false;
        startX = clientX;
        startY = clientY;
        messageEl.style.transition = 'none';
    };

    const onMove = (clientX, clientY, event) => {
        if (!tracking || !canTrack) return;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        if (deltaX < -8) {
            canTrack = false;
            finish();
            return;
        }

        if (Math.abs(deltaY) > 24 && Math.abs(deltaY) > deltaX) {
            canTrack = false;
            finish();
            return;
        }

        if (deltaX <= 6) {
            messageEl.classList.remove('message-swipe-active');
            messageEl.style.transform = '';
            return;
        }

        const visualShift = Math.min(SWIPE_MAX_SHIFT_PX, deltaX * 0.35);
        messageEl.classList.add('message-swipe-active');
        messageEl.style.transform = `translateX(${visualShift}px)`;
        swipeTriggered = deltaX >= SWIPE_TRIGGER_PX;

        if (event?.cancelable) {
            event.preventDefault();
        }
    };

    messageEl.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return;
        onStart(event.clientX, event.clientY, event.target);
    });
    messageEl.addEventListener('mousemove', (event) => {
        onMove(event.clientX, event.clientY, event);
    });
    messageEl.addEventListener('mouseup', finish);
    messageEl.addEventListener('mouseleave', finish);

    messageEl.addEventListener('touchstart', (event) => {
        if (!event.touches || event.touches.length !== 1) return;
        const touch = event.touches[0];
        onStart(touch.clientX, touch.clientY, event.target);
    }, { passive: true });
    messageEl.addEventListener('touchmove', (event) => {
        if (!event.touches || event.touches.length !== 1) return;
        const touch = event.touches[0];
        onMove(touch.clientX, touch.clientY, event);
    }, { passive: false });
    messageEl.addEventListener('touchend', finish);
    messageEl.addEventListener('touchcancel', finish);
}

// Renderizar mensagens
function renderMessages(messages, options = {}) {
    const previousScrollTop = messagesContainer.scrollTop;
    const previousScrollHeight = messagesContainer.scrollHeight;
    const preserveScroll = !!options.preserveScroll;
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <img src="images/camechat_logo.png" alt="Logo do CameChat" class="welcome-logo">
                <p>Inicie uma conversa com ${chatPartnerName.textContent}!</p>
            </div>
        `;
        ensureVoiceRecordingBanner();
        return;
    }

    const isSelectionMode = isMessageSelectionMode;

    messages.forEach(msg => {
        const isSent = msg.senderId === currentUser.uid;
        const row = document.createElement('div');
        row.className = `message-row ${isSent ? 'sent' : 'received'}`;
        row.dataset.messageId = msg.id || '';
        const div = document.createElement('div');
        div.className = `message ${isSent ? 'sent' : 'received'}`;
        div.dataset.messageId = msg.id || '';
        const canManageMessage = !!msg.id
            && !!currentUser
            && (msg.senderId === currentUser.uid || msg.receiverId === currentUser.uid);
        if (isSelectionMode && canManageMessage) {
            row.classList.toggle('message-row-selected', selectedMessageIds.has(msg.id));
            div.classList.add('message-select-mode');
            div.classList.toggle('message-selected', selectedMessageIds.has(msg.id));
        }
        const meta = buildMessageMeta(msg, isSent);
        const replyReference = renderReplyReferenceHtml(msg.replyTo);
        
        const messageType = getMessageType(msg);
        if (messageType === 'image') {
            const imageUrl = getAttachmentDownloadUrl(msg);
            if (imageUrl) {
                div.innerHTML = `
                    ${replyReference}
                    <img class="chat-media-image" src="${imageUrl}" alt="imagem" style="max-width: 200px;">
                    ${meta}
                `;
                const imageEl = div.querySelector('.chat-media-image');
                if (imageEl) {
                    attachMediaFallbackHandlers(imageEl, msg);
                    if (!isSelectionMode) {
                        imageEl.addEventListener('click', (event) => {
                            if (shouldBlockMessagePrimaryAction(event)) return;
                            openAttachmentInNewTab(msg, imageEl.currentSrc || imageEl.src);
                        });
                    }
                }
            } else {
                div.innerHTML = `
                    ${replyReference}
                    <p>Imagem indisponível.</p>
                    ${meta}
                `;
            }
        } else if (messageType === 'video') {
            const videoUrl = getAttachmentDownloadUrl(msg);
            if (videoUrl) {
                div.innerHTML = `
                    ${replyReference}
                    <video class="chat-media-video" src="${videoUrl}" controls playsinline preload="metadata" style="max-width: 240px; border-radius: 10px;"></video>
                    ${meta}
                `;
                const videoEl = div.querySelector('.chat-media-video');
                if (videoEl) {
                    attachMediaFallbackHandlers(videoEl, msg);
                }
            } else {
                div.innerHTML = `
                    ${replyReference}
                    <p>Vídeo indisponível.</p>
                    ${meta}
                `;
            }
        } else if (messageType === 'audio') {
            const audioUrl = getAttachmentDownloadUrl(msg);
            if (audioUrl) {
                div.innerHTML = `
                    ${replyReference}
                    <audio class="chat-media-audio" src="${audioUrl}" controls preload="metadata" style="width: 220px;"></audio>
                    ${meta}
                `;
                const audioEl = div.querySelector('.chat-media-audio');
                if (audioEl) {
                    attachMediaFallbackHandlers(audioEl, msg);
                }
            } else {
                div.innerHTML = `
                    ${replyReference}
                    <p>Áudio indisponível.</p>
                    ${meta}
                `;
            }
        } else if (messageType === 'file') {
            const fileUrl = getAttachmentDownloadUrl(msg) || '#';
            const fileName = escapeHtml(msg.fileName || 'Arquivo');
            const fileSize = msg.fileSize ? formatFileSize(msg.fileSize) : '';
            div.innerHTML = `
                ${replyReference}
                <div class="file-attachment">
                    <span class="file-icon">&#128206;</span>
                    <div class="file-info">
                        <a class="chat-media-file-link" href="${fileUrl}" target="_self" rel="noopener">${fileName}</a>
                        <small>${fileSize}</small>
                    </div>
                </div>
                ${meta}
            `;
            const fileLink = div.querySelector('.chat-media-file-link');
            if (fileLink) {
                if (!isSelectionMode) {
                    fileLink.addEventListener('click', (event) => {
                        if (shouldBlockMessagePrimaryAction(event)) return;
                        event.preventDefault();
                        openAttachmentInNewTab(msg, fileLink.href);
                    });
                }
            }
        } else {
            const linkPreviewHtml = renderLinkPreviewHtml(msg.text || '');
            div.innerHTML = `
                ${replyReference}
                <p>${linkifyMessageText(msg.text || '')}</p>
                ${linkPreviewHtml}
                ${meta}
            `;
            const textLinks = div.querySelectorAll('.chat-text-link');
            textLinks.forEach((link) => {
                link.addEventListener('click', (event) => {
                    if (shouldBlockMessagePrimaryAction(event)) return;
                    event.stopPropagation();
                });
            });
            const previewLink = div.querySelector('.message-link-preview');
            if (previewLink) {
                previewLink.addEventListener('click', (event) => {
                    if (shouldBlockMessagePrimaryAction(event)) return;
                    event.stopPropagation();
                });
            }
            const previewThumbImage = div.querySelector('.message-link-preview-thumb-image');
            if (previewThumbImage) {
                previewThumbImage.addEventListener('error', () => {
                    const thumbWrap = previewThumbImage.closest('.message-link-preview-thumb');
                    if (thumbWrap) {
                        thumbWrap.classList.add('no-thumb');
                        thumbWrap.innerHTML = '';
                    }
                });
            }
        }

        if (canManageMessage) {
            bindMessageSelectionInteractions(row, msg.id, { message: msg, bubbleEl: div });
        }
        bindMessageSwipeToReply(div, msg);

        row.appendChild(div);
        messagesContainer.appendChild(row);
    });
    
    ensureVoiceRecordingBanner();

    // Scroll para o final
    if (preserveScroll || isMessageSelectionMode) {
        const scrollDelta = messagesContainer.scrollHeight - previousScrollHeight;
        messagesContainer.scrollTop = Math.max(0, previousScrollTop + scrollDelta);
    } else {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
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

function setOnlineStatusClass(element, isOnline) {
    if (!element) return;
    element.classList.toggle('status-online-text', !!isOnline);
}

async function saveEditedMessage(text) {
    if (!editingMessage?.id || !currentUser || !selectedUserId) return;

    const latestMessage = currentConversationMessages.find((msg) => msg.id === editingMessage.id) || editingMessage;
    if (!canEditMessage(latestMessage)) {
        clearEditingMessage();
        alert('O prazo de 30 minutos para editar essa mensagem já expirou.');
        return;
    }

    const normalizedText = String(text || '').trim();
    const originalText = String(latestMessage.text || '').trim();
    if (!normalizedText) return;

    if (normalizedText === originalText) {
        clearEditingMessage();
        return;
    }

    const conversationId = currentConversationId || getConversationId(currentUser.uid, selectedUserId);

    await db.collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .doc(latestMessage.id)
        .update({
            text: normalizedText,
            edited: true,
            editedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

    clearEditingMessage();
}

async function submitTextComposerMessage() {
    const text = messageInput.value.trim();
    if (!text || !selectedUserId) return;
    if (isFriendBlocked(selectedUserId)) {
        alert('Você bloqueou este usuário.');
        return;
    }

    if (editingMessage) {
        try {
            await saveEditedMessage(text);
        } catch (error) {
            alert('Erro ao editar mensagem: ' + error.message);
        }
        return;
    }

    const conversationId = getConversationId(currentUser.uid, selectedUserId);
    const delivered = isUserEffectivelyOnline(selectedFriendData);
    const replyPayload = getPendingReplyPayload();

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
                read: false,
                delivered: delivered,
                deliveredAt: delivered ? firebase.firestore.FieldValue.serverTimestamp() : null,
                replyTo: replyPayload || null
            });

        messageInput.value = '';
        clearReplyTargetMessage();
        updateTypingState(null, true);
        updateComposerPrimaryAction();
    } catch (error) {
        alert('Erro ao enviar mensagem: ' + error.message);
    }
}

function getDefaultChatPartnerStatus() {
    if (!selectedFriendData) return '';
    if (isFriendBlocked(selectedFriendData.uid)) return getUiText('presenceBlocked');
    return getUserPresenceStatusText(selectedFriendData);
}

function getChatPartnerActivityLabel(state) {
    const displayName = selectedFriendData?.name || chatPartnerName?.textContent || 'Usu\u00e1rio';
    if (state === 'recording') {
        return formatUiText('recordingActivity', { name: displayName });
    }
    if (state === 'typing') {
        return formatUiText('typingActivity', { name: displayName });
    }
    return '';
}

function renderChatPartnerStatus() {
    if (!chatPartnerStatus) return;

    if (chatPartnerActivity) {
        chatPartnerActivity.textContent = '';
        chatPartnerActivity.classList.add('hidden');
    }

    if (!selectedFriendData || selectedUserId !== selectedFriendData.uid) {
        chatPartnerStatus.textContent = '';
        chatPartnerStatus.classList.remove('chat-partner-status-activity');
        setOnlineStatusClass(chatPartnerStatus, false);
        return;
    }

    const effectiveRemoteActivity = remoteTypingState || remoteUserActivityState;
    const showActivity = !!effectiveRemoteActivity
        && !isFriendBlocked(selectedFriendData.uid);

    if (showActivity) {
        chatPartnerStatus.textContent = getChatPartnerActivityLabel(effectiveRemoteActivity);
        chatPartnerStatus.classList.add('chat-partner-status-activity');
        setOnlineStatusClass(chatPartnerStatus, false);
        return;
    }

    const defaultStatus = getDefaultChatPartnerStatus();
    chatPartnerStatus.textContent = defaultStatus;
    chatPartnerStatus.classList.remove('chat-partner-status-activity');
    setOnlineStatusClass(chatPartnerStatus, defaultStatus === 'Online');
}

function setChatPartnerActivity(state) {
    remoteTypingState = state === 'typing' || state === 'recording' ? state : null;
    renderChatPartnerStatus();
}

function setRemoteUserActivity(activity) {
    const state = activity?.state;
    const targetUid = activity?.targetUid;
    const updatedAt = activity?.updatedAt?.toDate ? activity.updatedAt.toDate() : null;
    const isFresh = updatedAt ? (Date.now() - updatedAt.getTime() <= 8000) : true;
    const isValidState = state === 'typing' || state === 'recording';

    if (!currentUser || targetUid !== currentUser.uid || !isValidState || !isFresh) {
        remoteUserActivityState = null;
    } else {
        remoteUserActivityState = state;
    }
    renderChatPartnerStatus();
}

function stopRecordingHeartbeat() {
    if (recordingHeartbeatInterval) {
        clearInterval(recordingHeartbeatInterval);
        recordingHeartbeatInterval = null;
    }
}

function startRecordingHeartbeat() {
    stopRecordingHeartbeat();
    updateTypingState('recording', true);
    recordingHeartbeatInterval = setInterval(() => {
        updateTypingState('recording', true);
    }, RECORDING_HEARTBEAT_MS);
}

function clearTypingIdleTimer() {
    if (typingIdleTimeout) {
        clearTimeout(typingIdleTimeout);
        typingIdleTimeout = null;
    }
}

function clearRemoteTypingTimer() {
    if (typingRemoteTimeout) {
        clearTimeout(typingRemoteTimeout);
        typingRemoteTimeout = null;
    }
}

function listenTypingStatus(otherUid) {
    if (typingUnsubscribe) typingUnsubscribe();
    clearRemoteTypingTimer();
    setChatPartnerActivity(null);
    remoteUserActivityState = null;
    if (!currentUser || !otherUid) return;
    const conversationId = getConversationId(currentUser.uid, otherUid);
    typingUnsubscribe = db.collection('conversations')
        .doc(conversationId)
        .onSnapshot((doc) => {
            const data = doc.data() || {};
            const entry = data.typing && data.typing[otherUid];
            const state = entry?.state || null;
            const updatedAt = entry?.updatedAt?.toDate ? entry.updatedAt.toDate() : null;
            const isStale = updatedAt ? (Date.now() - updatedAt.getTime() > 8000) : false;
            if (!state || isStale) {
                setChatPartnerActivity(null);
                return;
            }
            setChatPartnerActivity(state);
            clearRemoteTypingTimer();
            typingRemoteTimeout = setTimeout(() => {
                setChatPartnerActivity(null);
            }, 6000);
        });
}

function updateTypingState(state, force = false) {
    if (!currentUser || !selectedUserId) return;
    if (isFriendBlocked(selectedUserId)) return;
    const now = Date.now();
    if (!force && state === localTypingState) {
        if (!state) return;
        if (now - lastTypingSentAt < 2000) return;
    }
    localTypingState = state;
    lastTypingSentAt = now;
    const conversationId = currentConversationId || getConversationId(currentUser.uid, selectedUserId);
    const payload = {};
    const path = `typing.${currentUser.uid}`;
    if (!state) {
        payload[path] = firebase.firestore.FieldValue.delete();
    } else {
        payload[path] = { state, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    }
    db.collection('conversations')
        .doc(conversationId)
        .set(payload, { merge: true })
        .catch((error) => {
            console.warn('Falha ao atualizar status de digitação.', error);
        });

    const activityPayload = {};
    if (!state) {
        activityPayload.activity = firebase.firestore.FieldValue.delete();
    } else {
        activityPayload.activity = {
            state,
            targetUid: selectedUserId,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
    }
    db.collection('users')
        .doc(currentUser.uid)
        .set(activityPayload, { merge: true })
        .catch((error) => {
            console.warn('Falha ao atualizar atividade do usuário.', error);
        });

}

function subscribeToFriendDoc(uid) {
    if (friendDocUnsubscribe) {
        friendDocUnsubscribe();
        friendDocUnsubscribe = null;
    }
    if (!uid) return;

    friendDocUnsubscribe = db.collection('users')
        .doc(uid)
        .onSnapshot((doc) => {
            if (!doc.exists) return;
            const data = { id: doc.id, ...doc.data() };
            if (selectedUserId !== data.uid) return;
            selectedFriendData = data;

            if (chatPartnerName) {
                chatPartnerName.textContent = data.name || 'Usuário';
            }

            if (chatPartnerPhoto) {
                applyProfilePhoto(chatPartnerPhoto, data, 'https://via.placeholder.com/45/cccccc/666666?text=User');
            }

            setRemoteUserActivity(data.activity || null);
            renderChatPartnerStatus();

        });
}

function handleTypingInput() {
    if (!messageInput) return;
    updateComposerPrimaryAction();
    if (messageInput.disabled || !selectedUserId) return;
    if (isRecordingAudio) return;
    const hasText = messageInput.value.trim().length > 0;
    if (!hasText) {
        clearTypingIdleTimer();
        if (localTypingState) updateTypingState(null, true);
        return;
    }
    updateTypingState('typing');
    clearTypingIdleTimer();
    typingIdleTimeout = setTimeout(() => {
        updateTypingState(null, true);
    }, 2500);
}

function clearLocalTypingState() {
    clearTypingIdleTimer();
    stopRecordingHeartbeat();
    if (localTypingState) {
        updateTypingState(null, true);
        localTypingState = null;
    }
}


function buildMessageMeta(msg, isSent) {
    const time = formatTime(msg.timestamp);
    const editedLabel = isMessageEdited(msg)
        ? '<span class="message-edited">editada</span>'
        : '';
    if (!isSent) {
        return `
            <small class="message-meta">
                ${editedLabel}
                <span class="message-time">${time}</span>
            </small>
        `;
    }
    let statusClass = 'status-sent';
    let ticks = '✓';
    let title = 'Enviado';
    if (msg.read) {
        statusClass = 'status-read';
        ticks = '✓✓';
        title = 'Lido';
    } else if (msg.delivered) {
        statusClass = 'status-delivered';
        ticks = '✓✓';
        title = 'Entregue';
    }
    return `
        <small class="message-meta">
            ${editedLabel}
            <span class="message-time">${time}</span>
            <span class="message-status ${statusClass}" title="${title}">${ticks}</span>
        </small>
    `;
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
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
}

function closeAttachMenu() {
    if (attachMenu) {
        attachMenu.classList.add('hidden');
    }
}

function toggleAttachMenu() {
    if (!attachMenu) return;
    const willOpen = attachMenu.classList.contains('hidden');
    if (willOpen) {
        if (emojiPicker) emojiPicker.classList.add('hidden');
        closeCameraModal();
    }
    attachMenu.classList.toggle('hidden', !willOpen);
}

function openAttachInput(input) {
    if (!input) return;
    closeAttachMenu();
    input.click();
}

async function openCameraModal() {
    if (!cameraModal) return;
    if (!selectedUserId) {
        alert('Selecione um usuário para conversar.');
        return;
    }
    if (isFriendBlocked(selectedUserId)) {
        alert('Você bloqueou este usuário.');
        return;
    }
    closeAttachMenu();
    if (emojiPicker) emojiPicker.classList.add('hidden');
    cameraModal.classList.add('show');
    cancelCameraRecording = false;
    currentCameraFacing = 'environment';
    updateCameraSwitchVisibility();
    if (cameraStatus) cameraStatus.textContent = 'Abrindo câmera...';
    await startCameraStream();
}

function closeCameraModal() {
    if (cameraModal) cameraModal.classList.remove('show');
    cancelCameraRecording = true;
    stopCameraStream();
    resetCameraState();
}

function resetCameraState() {
    if (cameraStatus) cameraStatus.textContent = 'Pronto para capturar.';
    if (btnCameraRecord) {
        btnCameraRecord.textContent = 'Gravar vídeo';
    }
    isCameraRecording = false;
    cameraRecorderChunks = [];
    cancelCameraRecording = false;
}

function shouldShowCameraSwitch() {
    if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) return true;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function updateCameraSwitchVisibility() {
    if (!btnCameraSwitch) return;
    btnCameraSwitch.classList.toggle('hidden', !shouldShowCameraSwitch());
}

async function switchCameraFacing() {
    if (isCameraRecording) return;
    currentCameraFacing = currentCameraFacing === 'user' ? 'environment' : 'user';
    stopCameraStream();
    if (cameraStatus) cameraStatus.textContent = 'Alternando câmera...';
    await startCameraStream();
}

async function startCameraStream() {
    if (!cameraPreview || !navigator.mediaDevices?.getUserMedia) {
        if (cameraStatus) cameraStatus.textContent = 'Câmera não suportada.';
        return;
    }
    if (cameraStream) return;
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: currentCameraFacing } },
            audio: true
        });
    } catch (error) {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: currentCameraFacing } },
                audio: false
            });
            if (cameraStatus) {
                cameraStatus.textContent = 'Câmera aberta (sem áudio).';
            }
        } catch (fallbackError) {
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
            } catch (finalError) {
                if (cameraStatus) cameraStatus.textContent = 'Não foi possível acessar a câmera.';
                alert('Não foi possível acessar a câmera.');
                closeCameraModal();
                return;
            }
        }
    }
    cameraPreview.srcObject = cameraStream;
    if (cameraStatus && cameraStatus.textContent === 'Abrindo câmera...') {
        cameraStatus.textContent = 'Pronto para capturar.';
    }
}

function stopCameraStream() {
    if (!cameraStream) return;
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    if (cameraPreview) cameraPreview.srcObject = null;
    if (cameraRecorder) {
        try {
            cameraRecorder.stop();
        } catch (error) {
            // ignore
        }
    }
    cameraRecorder = null;
    isCameraRecording = false;
}

async function capturePhotoFromCamera() {
    if (!cameraPreview || !cameraStream) return;
    const videoWidth = cameraPreview.videoWidth || 640;
    const videoHeight = cameraPreview.videoHeight || 480;
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraPreview, 0, 0, videoWidth, videoHeight);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    if (!blob) return;
    const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });
    await handleChatFile(file);
    closeCameraModal();
}

async function toggleCameraRecording() {
    if (!cameraStream) return;
    if (isCameraRecording) {
        cancelCameraRecording = false;
        if (cameraRecorder) cameraRecorder.stop();
        return;
    }
    const mimeTypeCandidates = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
    ];
    let mimeType = '';
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
        mimeType = mimeTypeCandidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
    }
    try {
        cameraRecorder = mimeType ? new MediaRecorder(cameraStream, { mimeType }) : new MediaRecorder(cameraStream);
    } catch (error) {
        cameraRecorder = new MediaRecorder(cameraStream);
    }
    cameraRecorderChunks = [];
    cameraRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            cameraRecorderChunks.push(event.data);
        }
    };
    cameraRecorder.onstop = async () => {
        const blob = new Blob(cameraRecorderChunks, { type: cameraRecorder.mimeType || mimeType || 'video/webm' });
        cameraRecorderChunks = [];
        isCameraRecording = false;
        if (btnCameraRecord) btnCameraRecord.textContent = 'Gravar vídeo';
        if (cameraStatus) cameraStatus.textContent = 'Pronto para capturar.';
        if (cancelCameraRecording) {
            cancelCameraRecording = false;
            return;
        }
        if (!blob.size) return;
        const file = new File([blob], `video_${Date.now()}.webm`, { type: blob.type });
        await handleChatFile(file);
        closeCameraModal();
    };
    cameraRecorder.start();
    isCameraRecording = true;
    if (btnCameraRecord) btnCameraRecord.textContent = 'Parar vídeo';
    if (cameraStatus) cameraStatus.textContent = 'Gravando vídeo...';
}

function getPreferredAudioMimeType() {
    const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/mp4',
        'audio/mpeg'
    ];
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
}

function getAudioFileExtension(mimeType) {
    if (!mimeType) return 'webm';
    if (mimeType.includes('ogg')) return 'ogg';
    if (mimeType.includes('mp4')) return 'm4a';
    if (mimeType.includes('mpeg')) return 'mp3';
    return 'webm';
}

function ensureVoiceRecordingBanner() {
    if (!voiceRecordingBanner || !messagesContainer) return;
    if (!messagesContainer.contains(voiceRecordingBanner)) {
        messagesContainer.appendChild(voiceRecordingBanner);
    }
}

function updateComposerPrimaryAction() {
    if (!btnSend || !btnVoice || !messageInput) return;

    const hasText = messageInput.value.trim().length > 0;
    const isEditing = !!editingMessage;
    const canUseSendButton = !messageInput.disabled && !!selectedUserId && !isRecordingAudio && (hasText || isEditing);
    const canSendText = !messageInput.disabled && !!selectedUserId && hasText && !isRecordingAudio;

    btnSend.classList.toggle('hidden', !canUseSendButton);
    btnSend.disabled = !canSendText;
    btnVoice.classList.toggle('hidden', canUseSendButton);
    btnVoice.disabled = !!messageInput.disabled || isEditing;
    if (btnAttach) btnAttach.disabled = !!messageInput.disabled || isEditing;
    if (btnCameraQuick) btnCameraQuick.disabled = !!messageInput.disabled || isEditing;
    if (btnEmoji) btnEmoji.disabled = !!messageInput.disabled;
}

function updateVoiceButtonUI() {
    if (!btnVoice) return;
    btnVoice.classList.toggle('recording', isRecordingAudio);
    btnVoice.title = isRecordingAudio ? 'Parar gravação' : 'Enviar áudio';
    btnVoice.innerHTML = isRecordingAudio ? VOICE_ICON_RECORDING : VOICE_ICON_IDLE;
    if (voiceRecordingStatus) {
        voiceRecordingStatus.classList.toggle('hidden', !isRecordingAudio);
    }
    if (voiceRecordingBanner) {
        voiceRecordingBanner.classList.toggle('hidden', !isRecordingAudio);
    }
    if (btnVoiceCancel) {
        btnVoiceCancel.disabled = !isRecordingAudio;
    }
    ensureVoiceRecordingBanner();
    updateComposerPrimaryAction();
}

function formatVoiceDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function startVoiceTimer() {
    voiceRecordingStartedAt = Date.now();
    if (voiceRecordingStatus) {
        voiceRecordingStatus.textContent = '00:00';
        voiceRecordingStatus.classList.remove('hidden');
    }
    if (voiceRecordingText) {
        voiceRecordingText.textContent = 'Gravando... 00:00';
    }
    if (voiceRecordingTimer) clearInterval(voiceRecordingTimer);
    voiceRecordingTimer = setInterval(() => {
        if (!voiceRecordingStartedAt) return;
        const elapsed = Date.now() - voiceRecordingStartedAt;
        if (voiceRecordingStatus) {
            voiceRecordingStatus.textContent = formatVoiceDuration(elapsed);
        }
        if (voiceRecordingText) {
            voiceRecordingText.textContent = `Gravando... ${formatVoiceDuration(elapsed)}`;
        }
    }, 500);
}

function stopVoiceTimer() {
    if (voiceRecordingTimer) {
        clearInterval(voiceRecordingTimer);
    }
    voiceRecordingTimer = null;
    voiceRecordingStartedAt = null;
    if (voiceRecordingStatus) {
        voiceRecordingStatus.classList.add('hidden');
    }
    if (voiceRecordingBanner) {
        voiceRecordingBanner.classList.add('hidden');
    }
}

async function stopAudioRecording(sendAfterStop = true) {
    if (!audioRecorder) return;
    audioRecorderSend = sendAfterStop;
    try {
        audioRecorder.stop();
    } catch (error) {
        // ignore
    }
}

async function startAudioRecording() {
    if (!selectedUserId) {
        alert('Selecione um usuário para conversar.');
        return;
    }
    if (isFriendBlocked(selectedUserId)) {
        alert('Você bloqueou este usuário.');
        return;
    }
    if (!window.isSecureContext) {
        alert('A gravação de áudio requer HTTPS.');
        return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        alert('Seu navegador não suporta gravação de áudio.');
        return;
    }
    if (isRecordingAudio) {
        await stopAudioRecording(true);
        return;
    }

    stopRecordingHeartbeat();

    try {
        audioRecorderStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
        alert('Não foi possível acessar o microfone.');
        return;
    }

    const mimeType = getPreferredAudioMimeType();
    try {
        audioRecorder = mimeType ? new MediaRecorder(audioRecorderStream, { mimeType }) : new MediaRecorder(audioRecorderStream);
    } catch (error) {
        try {
            audioRecorder = new MediaRecorder(audioRecorderStream);
        } catch (finalError) {
            alert('Não foi possível iniciar a gravação.');
            audioRecorderStream.getTracks().forEach(track => track.stop());
            audioRecorderStream = null;
            return;
        }
    }
    audioRecorderChunks = [];
    audioRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            audioRecorderChunks.push(event.data);
        }
    };
    audioRecorder.onstop = async () => {
        const recorder = audioRecorder;
        const stream = audioRecorderStream;
        audioRecorder = null;
        audioRecorderStream = null;
        isRecordingAudio = false;
        updateVoiceButtonUI();
        stopVoiceTimer();
        stopRecordingHeartbeat();
        updateTypingState(null, true);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (!audioRecorderSend) {
            audioRecorderChunks = [];
            return;
        }
        const blob = new Blob(audioRecorderChunks, { type: recorder?.mimeType || mimeType || 'audio/webm' });
        audioRecorderChunks = [];
        if (!blob.size) return;
        const extension = getAudioFileExtension(blob.type);
        const file = new File([blob], `voz_${Date.now()}.${extension}`, { type: blob.type });
        await handleChatFile(file);
    };
    try {
        audioRecorder.start();
    } catch (error) {
        alert('Não foi possível iniciar a gravação.');
        audioRecorderStream.getTracks().forEach(track => track.stop());
        audioRecorderStream = null;
        audioRecorder = null;
        return;
    }
    isRecordingAudio = true;
    audioRecorderSend = true;
    updateVoiceButtonUI();
    startVoiceTimer();
    clearTypingIdleTimer();
    startRecordingHeartbeat();
}

async function handleChatFile(file) {
    if (!file || !selectedUserId) return;
    if (isFriendBlocked(selectedUserId)) {
        alert('Você bloqueou este usuário.');
        return;
    }

    const maxSize = MAX_CHAT_FILE_SIZE_BYTES;
    if (file.size > maxSize) {
        alert(`O arquivo deve ter no máximo ${MAX_CHAT_FILE_SIZE_MB}MB.`);
        return;
    }

    const fileType = file.type || '';
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');
    const isAudio = fileType.startsWith('audio/');
    let messageType = 'file';
    if (isImage) messageType = 'image';
    if (isVideo) messageType = 'video';
    if (isAudio) messageType = 'audio';
    const delivered = isUserEffectivelyOnline(selectedFriendData);
    const replyPayload = getPendingReplyPayload();

    try {
        const fileUrl = await uploadChatFile(file, { uid: currentUser.uid });

        const conversationId = getConversationId(currentUser.uid, selectedUserId);
        const messageRef = db.collection('conversations')
            .doc(conversationId)
            .collection('messages')
            .doc();
        const messagePayload = {
            fileUrl: fileUrl,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            fileSize: file.size,
            imageUrl: isImage ? fileUrl : null,
            senderId: currentUser.uid,
            receiverId: selectedUserId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: messageType,
            read: false,
            delivered: delivered,
            deliveredAt: delivered ? firebase.firestore.FieldValue.serverTimestamp() : null,
            replyTo: replyPayload || null
        };

        await messageRef.set(messagePayload);
        await autoSaveOutgoingAttachment({ id: messageRef.id, ...messagePayload }, file);
        clearReplyTargetMessage();
    } catch (error) {
        alert('Erro ao enviar arquivo: ' + error.message);
    }
}

async function handleFileInputChange(input) {
    const files = Array.from(input?.files || []);
    if (input) input.value = '';
    if (!files.length) return;
    await Promise.allSettled(files.map(file => handleChatFile(file)));
}

function clearActiveConversation() {
    clearLocalTypingState();
    clearEditingMessage();
    clearReplyTargetMessage();
    closeMessageActionMenu();

    if (messagesUnsubscribe) {
        messagesUnsubscribe();
        messagesUnsubscribe = null;
    }
    if (typingUnsubscribe) {
        typingUnsubscribe();
        typingUnsubscribe = null;
    }
    if (friendDocUnsubscribe) {
        friendDocUnsubscribe();
        friendDocUnsubscribe = null;
    }

    clearRemoteTypingTimer();
    remoteUserActivityState = null;
    setChatPartnerActivity(null);

    if (isRecordingAudio) {
        stopAudioRecording(false);
    }
    stopVoiceTimer();
    stopRecordingHeartbeat();

    selectedUserId = null;
    selectedFriendData = null;
    currentConversationId = null;
    currentConversationMessages = [];

    document.querySelectorAll('.user-item').forEach((item) => {
        item.classList.remove('active');
    });

    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <img src="images/camechat_logo.png" alt="Logo do CameChat" class="welcome-logo">
                <h3>Bem-vindo ao CameChat! 👋</h3>
                <p>Selecione um usuário para começar a conversar.</p>
            </div>
        `;
    }

    ensureVoiceRecordingBanner();
    resetMessageSelectionState();

    if (chatPartnerName) chatPartnerName.textContent = 'Selecione um usuário';
    if (chatPartnerStatus) {
        chatPartnerStatus.textContent = '';
        chatPartnerStatus.classList.remove('chat-partner-status-activity');
        setOnlineStatusClass(chatPartnerStatus, false);
    }
    if (callIndicator) callIndicator.classList.add('hidden');
    if (defaultChatPartnerPhoto && chatPartnerPhoto) {
        chatPartnerPhoto.src = defaultChatPartnerPhoto;
    }

    if (messageInput) {
        messageInput.value = '';
        messageInput.disabled = true;
    }
    if (btnSend) btnSend.disabled = true;
    if (btnAttach) btnAttach.disabled = true;
    if (btnEmoji) btnEmoji.disabled = true;
    if (btnVoice) btnVoice.disabled = true;
    if (btnCameraQuick) btnCameraQuick.disabled = true;
    if (btnCall) btnCall.disabled = true;
    if (btnVideoCall) btnVideoCall.disabled = true;

    if (emojiPicker) emojiPicker.classList.add('hidden');
    closeAttachMenu();
    closeCameraModal();
    closeDeleteMessageModal();
    closeShareMessageModal();
    closeUserTagMatchModal();
    closeMediaViewer();
    updateComposerPrimaryAction();
}

function handleAndroidBackPress() {
    if (mediaViewerModal && !mediaViewerModal.classList.contains('hidden')) {
        closeMediaViewer();
        return true;
    }
    if (cameraModal && cameraModal.classList.contains('show')) {
        closeCameraModal();
        return true;
    }
    if (deleteMessageModal && deleteMessageModal.classList.contains('show')) {
        closeDeleteMessageModal();
        return true;
    }
    if (shareMessageModal && shareMessageModal.classList.contains('show')) {
        closeShareMessageModal();
        return true;
    }
    if (userTagMatchModal && userTagMatchModal.classList.contains('show')) {
        closeUserTagMatchModal();
        return true;
    }
    if (messageActionMenu && !messageActionMenu.classList.contains('hidden')) {
        closeMessageActionMenu();
        return true;
    }
    if (settingsMenu && !settingsMenu.classList.contains('hidden')) {
        setLogoutButtonVisible(false);
        return true;
    }
    if (selectedUserId || selectedFriendData || currentConversationId) {
        clearActiveConversation();
        return true;
    }
    if (isFriendSelectionMode) {
        resetFriendSelectionState();
        return true;
    }
    if (app?.classList.contains('sidebar-open')) {
        setSidebarOpen(false);
        return true;
    }
    return false;
}

window.CameChatApp = window.CameChatApp || {};
window.CameChatApp.handleAndroidBackPress = handleAndroidBackPress;

function resetChatUI() {
    selectedUserId = null;
    selectedFriendData = null;
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <img src="images/camechat_logo.png" alt="Logo do CameChat" class="welcome-logo">
                <h3>Bem-vindo ao CameChat! 👋</h3>
                <p>Selecione um usuário para começar a conversar.</p>
            </div>
        `;
    }
    ensureVoiceRecordingBanner();
    remoteUserActivityState = null;
    setChatPartnerActivity(null);
    clearReplyTargetMessage();
    clearLocalTypingState();
    clearEditingMessage();
    if (typingUnsubscribe) {
        typingUnsubscribe();
        typingUnsubscribe = null;
    }
    clearRemoteTypingTimer();
    if (friendDocUnsubscribe) {
        friendDocUnsubscribe();
        friendDocUnsubscribe = null;
    }
    if (usersList) usersList.innerHTML = '';
    if (adminUsersList) adminUsersList.innerHTML = '';
    if (messageInput) messageInput.value = '';
    if (searchUser) searchUser.value = '';
    if (friendEmailInput) friendEmailInput.value = '';
    if (chatPartnerName) chatPartnerName.textContent = 'Selecione um usuário';
    if (chatPartnerStatus) {
        chatPartnerStatus.textContent = '';
        chatPartnerStatus.classList.remove('chat-partner-status-activity');
        setOnlineStatusClass(chatPartnerStatus, false);
    }
    if (callIndicator) callIndicator.classList.add('hidden');
    if (defaultChatPartnerPhoto) {
        chatPartnerPhoto.src = defaultChatPartnerPhoto;
    }
    if (emojiPicker) emojiPicker.classList.add('hidden');
    if (attachMenu) attachMenu.classList.add('hidden');
    if (uploadProgressList) {
        uploadProgressList.classList.add('hidden');
        uploadProgressList.innerHTML = '';
    }
    closeCameraModal();
    if (isRecordingAudio) {
        stopAudioRecording(false);
    }
    stopVoiceTimer();
    stopRecordingHeartbeat();
    updateComposerPrimaryAction();
    closeDeleteMessageModal();
    closeShareMessageModal();
    closeUserTagMatchModal();
    closeMediaViewer();
    currentConversationId = null;
    currentConversationMessages = [];
    resetMessageSelectionState();
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
    renderCurrentUserIdentity(currentUserProfile);
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
    if (friendPreviewImage) {
        applyProfilePhoto(friendPreviewImage, selectedFriendData, 'https://via.placeholder.com/120/cccccc/666666?text=User');
    }
    if (friendDetailName) friendDetailName.textContent = selectedFriendData.name || 'Usuário';
    if (friendDetailHandle) friendDetailHandle.textContent = getUserTagValue(selectedFriendData);
    if (friendDetailEmail) friendDetailEmail.textContent = selectedFriendData.email || '';
    renderFriendDetailStatus(selectedFriendData);
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
    return getUserPresenceStatusText(friend);
}

function renderFriendDetailStatus(friend) {
    if (!friendDetailStatus) return;
    const statusText = getFriendStatusText(friend);
    friendDetailStatus.textContent = statusText;
    setOnlineStatusClass(friendDetailStatus, statusText === 'Online');
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
    await submitTextComposerMessage();
});

if (messageInput) {
    messageInput.addEventListener('input', handleTypingInput);
    messageInput.addEventListener('blur', () => updateTypingState(null, true));
}

// Anexar arquivo
if (btnAttach) {
    btnAttach.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleAttachMenu();
    });
}

if (btnCameraQuick) {
    btnCameraQuick.addEventListener('click', (event) => {
        event.stopPropagation();
        openCameraModal();
    });
}

if (attachMenu) {
    attachMenu.addEventListener('click', (event) => {
        const button = event.target.closest('.attach-option');
        if (!button) return;
        const action = button.dataset.attach;
        if (action === 'gallery') openAttachInput(fileUploadGallery || fileUpload);
        if (action === 'camera-photo') openAttachInput(fileUploadCameraPhoto || fileUpload);
        if (action === 'camera-video') openAttachInput(fileUploadCameraVideo || fileUpload);
        if (action === 'audio') openAttachInput(fileUploadAudio || fileUpload);
        if (action === 'document') openAttachInput(fileUploadDocument || fileUpload);
    });
}

document.addEventListener('click', (event) => {
    if (!attachMenu || attachMenu.classList.contains('hidden')) return;
    if (attachMenu.contains(event.target)) return;
    if (btnAttach && btnAttach.contains(event.target)) return;
    closeAttachMenu();
});

if (fileUpload) {
    fileUpload.addEventListener('change', () => handleFileInputChange(fileUpload));
}
if (fileUploadGallery) {
    fileUploadGallery.addEventListener('change', () => handleFileInputChange(fileUploadGallery));
}
if (fileUploadCameraPhoto) {
    fileUploadCameraPhoto.addEventListener('change', () => handleFileInputChange(fileUploadCameraPhoto));
}
if (fileUploadCameraVideo) {
    fileUploadCameraVideo.addEventListener('change', () => handleFileInputChange(fileUploadCameraVideo));
}
if (fileUploadAudio) {
    fileUploadAudio.addEventListener('change', () => handleFileInputChange(fileUploadAudio));
}
if (fileUploadDocument) {
    fileUploadDocument.addEventListener('change', () => handleFileInputChange(fileUploadDocument));
}

if (btnEmoji) {
    btnEmoji.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!emojiPicker) return;
        closeAttachMenu();
        closeCameraModal();
        emojiPicker.classList.toggle('hidden');
    });
}

if (btnVoice) {
    btnVoice.addEventListener('click', () => {
        startAudioRecording();
    });
}

if (btnVoiceCancel) {
    btnVoiceCancel.addEventListener('click', () => {
        if (!isRecordingAudio) return;
        stopAudioRecording(false);
    });
}

updateVoiceButtonUI();
updateMessageSelectionUI();

if (messageActionReply) {
    messageActionReply.addEventListener('click', async () => {
        await handleMessageActionReply();
    });
}

if (messageActionCopy) {
    messageActionCopy.addEventListener('click', async () => {
        await handleMessageActionCopy();
    });
}

if (messageActionEdit) {
    messageActionEdit.addEventListener('click', async () => {
        await handleMessageActionEdit();
    });
}

if (messageActionDelete) {
    messageActionDelete.addEventListener('click', async () => {
        await handleMessageActionDelete();
    });
}

if (btnFriendMuteSelected) {
    btnFriendMuteSelected.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMuteSelectedFriends();
    });
}

if (btnFriendBlockSelected) {
    btnFriendBlockSelected.addEventListener('click', async (event) => {
        event.stopPropagation();
        await blockSelectedFriends();
    });
}

if (btnFriendRemoveSelected) {
    btnFriendRemoveSelected.addEventListener('click', async (event) => {
        event.stopPropagation();
        await removeSelectedFriends();
    });
}

if (messagesContainer) {
    messagesContainer.addEventListener('click', (event) => {
        const clickedMessageRow = event.target.closest('.message-row');
        const clickedMenu = event.target.closest('#message-action-menu');
        if (clickedMessageRow || clickedMenu) return;

        if (isMessageSelectionMode) {
            setMessageSelectionMode(false);
        } else if (messageActionMenu && !messageActionMenu.classList.contains('hidden')) {
            closeMessageActionMenu();
        }
    });
    messagesContainer.addEventListener('scroll', () => {
        closeMessageActionMenu();
    });
}

if (usersList) {
    usersList.addEventListener('click', (event) => {
        const clickedFriend = event.target.closest('.user-item');
        if (clickedFriend || event.target.closest('#friend-selection-toolbar')) return;
        if (isFriendSelectionMode) {
            setFriendSelectionMode(false);
        }
    });
}

document.addEventListener('click', (event) => {
    if (!messageActionMenu || messageActionMenu.classList.contains('hidden')) return;
    if (event.target.closest('#message-action-menu')) return;
    if (event.target.closest('.message-row')) return;
    closeMessageActionMenu();
});

document.addEventListener('click', (event) => {
    if (!isFriendSelectionMode) return;
    if (event.target.closest('.user-item')) return;
    if (event.target.closest('#friend-selection-toolbar')) return;
    if (event.target.closest('#user-photo')) return;
    if (!event.target.closest('.sidebar')) {
        setFriendSelectionMode(false);
        return;
    }
    if (event.target.closest('.search-box') || event.target.closest('.add-friend-box') || event.target.closest('.users-header')) {
        setFriendSelectionMode(false);
    }
});

window.addEventListener('resize', () => {
    closeMessageActionMenu();
});

if (btnCameraCapture) {
    btnCameraCapture.addEventListener('click', () => {
        capturePhotoFromCamera();
    });
}

if (btnCameraRecord) {
    btnCameraRecord.addEventListener('click', () => {
        toggleCameraRecording();
    });
}

if (btnCameraSwitch) {
    btnCameraSwitch.addEventListener('click', () => {
        switchCameraFacing();
    });
}

if (btnCameraCancel) {
    btnCameraCancel.addEventListener('click', () => {
        closeCameraModal();
    });
}

if (cameraCloseModal) {
    cameraCloseModal.addEventListener('click', () => {
        closeCameraModal();
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
            alert('Digite o e-mail ou @primeironome do usuário.');
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

if (userTagMatchClose) {
    userTagMatchClose.addEventListener('click', () => {
        closeUserTagMatchModal();
    });
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
                renderChatPartnerStatus();
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
                renderChatPartnerStatus();
                messageInput.disabled = false;
                btnSend.disabled = false;
                btnAttach.disabled = false;
                if (btnEmoji) btnEmoji.disabled = false;
                if (btnVoice) btnVoice.disabled = false;
                if (btnCameraQuick) btnCameraQuick.disabled = false;
                if (btnCall) btnCall.disabled = false;
                if (btnVideoCall) btnVideoCall.disabled = false;
                updateComposerPrimaryAction();
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

if (btnDeleteSelected) {
    btnDeleteSelected.addEventListener('click', async () => {
        await deleteSelectedMessages();
    });
}

if (btnEditSelected) {
    btnEditSelected.addEventListener('click', async () => {
        await editSelectedMessage();
    });
}

if (btnCopySelected) {
    btnCopySelected.addEventListener('click', async () => {
        await copySelectedTextMessages();
    });
}

if (btnShareSelected) {
    btnShareSelected.addEventListener('click', async () => {
        await shareSelectedMessages();
    });
}

if (btnReplyCancel) {
    btnReplyCancel.addEventListener('click', () => {
        clearReplyTargetMessage();
    });
}

if (btnEditCancel) {
    btnEditCancel.addEventListener('click', () => {
        clearEditingMessage();
    });
}

if (btnDeleteMessageMe) {
    btnDeleteMessageMe.addEventListener('click', () => {
        if (deleteMessageModalResolver) {
            const resolve = deleteMessageModalResolver;
            deleteMessageModalResolver = null;
            if (deleteMessageModal) deleteMessageModal.classList.remove('show');
            resolve('me');
        }
    });
}

if (btnDeleteMessageAll) {
    btnDeleteMessageAll.addEventListener('click', () => {
        if (deleteMessageModalResolver) {
            const resolve = deleteMessageModalResolver;
            deleteMessageModalResolver = null;
            if (deleteMessageModal) deleteMessageModal.classList.remove('show');
            resolve('all');
        }
    });
}

if (btnDeleteMessageCancel) {
    btnDeleteMessageCancel.addEventListener('click', () => {
        closeDeleteMessageModal();
    });
}

if (deleteMessageModal) {
    deleteMessageModal.addEventListener('click', (event) => {
        if (event.target === deleteMessageModal) {
            closeDeleteMessageModal();
        }
    });
}

if (btnShareMessageCancel) {
    btnShareMessageCancel.addEventListener('click', () => {
        closeShareMessageModal();
    });
}

if (shareMessageModal) {
    shareMessageModal.addEventListener('click', (event) => {
        if (event.target === shareMessageModal) {
            closeShareMessageModal();
        }
    });
}

if (userTagMatchModal) {
    userTagMatchModal.addEventListener('click', (event) => {
        if (event.target === userTagMatchModal) {
            closeUserTagMatchModal();
        }
    });
}

if (btnMediaViewerClose) {
    btnMediaViewerClose.addEventListener('click', () => {
        closeMediaViewer();
    });
}

if (btnMediaViewerSave) {
    btnMediaViewerSave.addEventListener('click', async (event) => {
        event.stopPropagation();
        await saveCurrentMediaViewerAttachment();
    });
}

if (mediaViewerModal) {
    mediaViewerModal.addEventListener('click', (event) => {
        if (event.target === mediaViewerModal) {
            closeMediaViewer();
        }
    });
}

if (mediaViewerContent) {
    mediaViewerContent.addEventListener('click', (event) => {
        if (event.target === mediaViewerContent) {
            closeMediaViewer();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mediaViewerModal && !mediaViewerModal.classList.contains('hidden')) {
        closeMediaViewer();
    }
});

window.addEventListener('resize', () => {
    if (!mediaViewerModal || mediaViewerModal.classList.contains('hidden')) return;
    clampMediaViewerImageTranslate();
    applyMediaViewerImageTransform();
});

window.addEventListener('beforeunload', () => {
    attachmentCacheObjectUrls.forEach((url) => {
        try {
            URL.revokeObjectURL(url);
        } catch (error) {
            // ignore
        }
    });
    attachmentCacheObjectUrls = new Map();
});

if (btnCallMute) {
    btnCallMute.addEventListener('click', () => {
        toggleLocalAudio();
    });
}

if (btnCallVideoToggle) {
    btnCallVideoToggle.addEventListener('click', () => {
        toggleLocalVideo();
    });
}

if (btnCallMinimize) {
    btnCallMinimize.addEventListener('click', () => {
        minimizeCall();
    });
}

if (btnCallSpeaker) {
    btnCallSpeaker.addEventListener('click', () => {
        toggleSpeakerphone();
    });
}

if (btnCallSwitchVideo) {
    btnCallSwitchVideo.addEventListener('click', () => {
        switchCallType('video');
    });
}

if (btnCallSwitchAudio) {
    btnCallSwitchAudio.addEventListener('click', () => {
        switchCallType('audio');
    });
}

function canSwapFrom(target) {
    if (!callMedia) return false;
    if (Date.now() < suppressVideoSwapUntil) return false;
    const swapped = callMedia.classList.contains('swap');
    if (!swapped && target === localVideo) return true;
    if (swapped && target === remoteVideo) return true;
    return false;
}

function requestVideoSwap(videoElement, source = 'click') {
    if (source === 'click' && Date.now() - lastTouchSwapAt < 450) return;
    if (source === 'touch') {
        lastTouchSwapAt = Date.now();
    }
    if (canSwapFrom(videoElement)) {
        toggleVideoSwap();
    }
}

function findTouchById(touchList, touchId) {
    if (!touchList || touchId === null || touchId === undefined) return null;
    for (let index = 0; index < touchList.length; index += 1) {
        const touch = touchList[index];
        if (touch.identifier === touchId) return touch;
    }
    return null;
}

function bindVideoSwapAndMiniDrag(videoElement) {
    if (!videoElement) return;

    videoElement.addEventListener('click', () => {
        requestVideoSwap(videoElement, 'click');
    });

    videoElement.addEventListener('touchend', (event) => {
        if (!event.changedTouches || event.changedTouches.length !== 1) return;
        const isDraggingThisVideo = callPreviewDragging && callPreviewTarget === videoElement;
        if (isDraggingThisVideo && callPreviewDragMoved) return;
        event.preventDefault();
        requestVideoSwap(videoElement, 'touch');
    }, { passive: false });

    videoElement.addEventListener('pointerdown', (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        callPreviewDragPointerId = event.pointerId;
        startCallPreviewDrag(videoElement, event.clientX, event.clientY);
        if (!callPreviewDragging || callPreviewTarget !== videoElement) {
            callPreviewDragPointerId = null;
            return;
        }
        if (typeof videoElement.setPointerCapture === 'function') {
            try {
                videoElement.setPointerCapture(event.pointerId);
            } catch (error) {
                // ignore unsupported capture
            }
        }
    });

    if (!('PointerEvent' in window)) {
        videoElement.addEventListener('touchstart', (event) => {
            if (!event.touches || event.touches.length !== 1) return;
            const touch = event.touches[0];
            callPreviewDragTouchId = touch.identifier;
            startCallPreviewDrag(videoElement, touch.clientX, touch.clientY);
            if (!callPreviewDragging || callPreviewTarget !== videoElement) {
                callPreviewDragTouchId = null;
            }
        }, { passive: true });
    }
}

bindVideoSwapAndMiniDrag(localVideo);
bindVideoSwapAndMiniDrag(remoteVideo);

if (btnCallMiniHangup) {
    btnCallMiniHangup.addEventListener('click', () => {
        endCall('ended');
    });
}

if (callMini) {
    callMini.addEventListener('pointerdown', (event) => {
        if (callMini.classList.contains('hidden')) return;
        if (event.button !== undefined && event.button !== 0) return;
        if (event.target?.closest?.('button')) return;
        callMiniDragPointerId = event.pointerId;
        startCallMiniDrag(event.clientX, event.clientY);
        if (typeof callMini.setPointerCapture === 'function') {
            try {
                callMini.setPointerCapture(event.pointerId);
            } catch (error) {
                // ignore unsupported capture
            }
        }
    });

    if (!('PointerEvent' in window)) {
        callMini.addEventListener('touchstart', (event) => {
            if (callMini.classList.contains('hidden')) return;
            if (!event.touches || event.touches.length !== 1) return;
            if (event.target?.closest?.('button')) return;
            const touch = event.touches[0];
            callMiniDragTouchId = touch.identifier;
            startCallMiniDrag(touch.clientX, touch.clientY);
        }, { passive: true });
    }
}

document.addEventListener('pointermove', (event) => {
    if (callMiniDragPointerId !== null && event.pointerId === callMiniDragPointerId) {
        moveCallMini(event.clientX, event.clientY);
    }
    if (callPreviewDragPointerId !== null && event.pointerId === callPreviewDragPointerId) {
        moveCallPreviewDrag(event.clientX, event.clientY);
        event.preventDefault();
    }
});

document.addEventListener('pointerup', (event) => {
    if (callMiniDragPointerId !== null && event.pointerId === callMiniDragPointerId) {
        if (callMini && typeof callMini.releasePointerCapture === 'function') {
            try {
                callMini.releasePointerCapture(event.pointerId);
            } catch (error) {
                // ignore
            }
        }
        stopCallMiniDrag();
    }
    if (callPreviewDragPointerId !== null && event.pointerId === callPreviewDragPointerId) {
        if (callPreviewTarget && typeof callPreviewTarget.releasePointerCapture === 'function') {
            try {
                callPreviewTarget.releasePointerCapture(event.pointerId);
            } catch (error) {
                // ignore
            }
        }
        stopCallPreviewDrag();
    }
});

document.addEventListener('pointercancel', (event) => {
    if (callMiniDragPointerId !== null && event.pointerId === callMiniDragPointerId) {
        stopCallMiniDrag();
    }
    if (callPreviewDragPointerId !== null && event.pointerId === callPreviewDragPointerId) {
        stopCallPreviewDrag();
    }
});

if (!('PointerEvent' in window)) {
    document.addEventListener('touchmove', (event) => {
        let shouldPreventDefault = false;

        if (callMiniDragTouchId !== null) {
            const miniTouch = findTouchById(event.touches, callMiniDragTouchId);
            if (miniTouch) {
                moveCallMini(miniTouch.clientX, miniTouch.clientY);
                shouldPreventDefault = true;
            }
        }

        if (callPreviewDragTouchId !== null) {
            const previewTouch = findTouchById(event.touches, callPreviewDragTouchId);
            if (previewTouch) {
                moveCallPreviewDrag(previewTouch.clientX, previewTouch.clientY);
                shouldPreventDefault = true;
            }
        }

        if (shouldPreventDefault) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', (event) => {
        if (callMiniDragTouchId !== null && findTouchById(event.changedTouches, callMiniDragTouchId)) {
            stopCallMiniDrag();
        }
        if (callPreviewDragTouchId !== null && findTouchById(event.changedTouches, callPreviewDragTouchId)) {
            stopCallPreviewDrag();
        }
    });

    document.addEventListener('touchcancel', (event) => {
        if (callMiniDragTouchId !== null && findTouchById(event.changedTouches, callMiniDragTouchId)) {
            stopCallMiniDrag();
        }
        if (callPreviewDragTouchId !== null && findTouchById(event.changedTouches, callPreviewDragTouchId)) {
            stopCallPreviewDrag();
        }
    });
}

if (btnCallRestore) {
    btnCallRestore.addEventListener('click', () => {
        restoreCall();
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
        setLogoutButtonVisible(false);
        openProfileModal();
    });
}

if (userName) {
    userName.addEventListener('click', () => {
        if (!currentUser) return;
        setLogoutButtonVisible(false);
        openProfileModal();
    });
}

if (btnSettings) {
    btnSettings.addEventListener('click', (event) => {
        if (!currentUser) return;
        event.stopPropagation();
        toggleLogoutButtonVisible();
    });
}

if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isDark = document.body.classList.contains('theme-dark');
        applyTheme(isDark ? 'light' : 'dark', true);
    });
}

if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        applySoundNotificationsSetting(!soundNotificationsEnabled, true);
    });
}

if (btnReadReceiptsToggle) {
    btnReadReceiptsToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        applyReadReceiptsSetting(!readReceiptsEnabled, true);
    });
}

if (btnDesktopNotificationsToggle) {
    btnDesktopNotificationsToggle.addEventListener('click', async (event) => {
        event.stopPropagation();

        if (!isDesktopNotificationsSupported()) {
            applyDesktopNotificationsSetting(false, false);
            return;
        }

        if (desktopNotificationsEnabled) {
            applyDesktopNotificationsSetting(false, true);
            return;
        }

        let permission = getDesktopNotificationPermission();
        if (permission !== 'granted') {
            try {
                permission = await Notification.requestPermission();
            } catch (error) {
                permission = 'denied';
            }
        }

        if (permission === 'granted') {
            applyDesktopNotificationsSetting(true, true);
        } else {
            applyDesktopNotificationsSetting(false, true);
            if (permission === 'denied') {
                alert('Notificações bloqueadas pelo navegador. Libere nas configurações do site para ativar.');
            }
        }
    });
}

if (btnOnlineStatusToggle) {
    btnOnlineStatusToggle.addEventListener('click', async (event) => {
        event.stopPropagation();
        const nextValue = !showOnlineStatusEnabled;
        applyOnlineStatusVisibilitySetting(nextValue, true, false);
        await syncOnlineStatusVisibilityPreference();
    });
}

if (btnChatFontToggle) {
    btnChatFontToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const nextSize = chatFontSizePreference === 'large' ? 'normal' : 'large';
        applyChatFontSizeSetting(nextSize, true);
    });
}

if (btnChatBackground) {
    btnChatBackground.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!chatBackgroundUpload) return;
        chatBackgroundUpload.click();
    });
}

if (chatBackgroundUpload) {
    chatBackgroundUpload.addEventListener('change', async () => {
        const file = chatBackgroundUpload.files?.[0];
        chatBackgroundUpload.value = '';
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Selecione apenas imagens para o plano de fundo.');
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 20MB.');
            return;
        }

        try {
            const dataUrl = await buildChatBackgroundDataUrl(file);
            applyChatBackground(dataUrl, true);
        } catch (error) {
            alert('Não foi possível aplicar este plano de fundo.');
        }
    });
}

if (btnMediaSaveModeToggle) {
    btnMediaSaveModeToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        applyMediaAutoSaveSetting(!autoMediaSaveEnabled, true);
    });
}

if (btnMediaFolderPc) {
    btnMediaFolderPc.addEventListener('click', async (event) => {
        event.stopPropagation();
        const configured = await configurePcLocalMediaFolder();
        if (configured) {
            alert(getUiText('mediaPcFolderSaved'));
        } else {
            alert(getUiText('mediaPcFolderSaveFailed'));
        }
    });
}

if (btnCallBlockToggle) {
    btnCallBlockToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        applyCallBlockingSetting(!blockIncomingCallsEnabled, true);
    });
}

if (btnLastSeenToggle) {
    btnLastSeenToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        applyLastSeenVisibilitySetting(!showLastSeenEnabled, true);
    });
}

if (btnLanguageToggle) {
    btnLanguageToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const nextLanguage = selectedLanguage === 'en-US' ? 'pt-BR' : 'en-US';
        applyLanguageSetting(nextLanguage, true);
    });
}

document.addEventListener('click', (event) => {
    if (!settingsMenu || settingsMenu.classList.contains('hidden')) return;
    const target = event.target;
    if (settingsMenu.contains(target)) return;
    if (btnSettings && btnSettings.contains(target)) return;
    setLogoutButtonVisible(false);
});

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
        setLogoutButtonVisible(false);
        await updateUserOnlineStatus(false);
        await auth.signOut();
        resetRegisterForm();
        setSidebarOpen(false);
    } catch (error) {
        alert('Erro ao sair: ' + error.message);
    }
});

updateRegisterRoleAvailability();
