package com.camechat.app

import android.Manifest
import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.animation.PropertyValuesHolder
import android.annotation.SuppressLint
import android.app.Activity
import android.app.DownloadManager
import android.app.Dialog
import android.content.ActivityNotFoundException
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.media.AudioManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.PowerManager
import android.provider.MediaStore
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.MimeTypeMap
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewClientCompat
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.messaging.FirebaseMessaging
import org.json.JSONObject
import java.util.Locale
import android.provider.OpenableColumns
import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.IOException
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : AppCompatActivity() {

    companion object {
        private const val MAX_CHAT_UPLOAD_BYTES = 50L * 1024L * 1024L
    }

    private lateinit var webView: WebView
    private lateinit var splashOverlay: View
    private lateinit var splashLogo: ImageView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var pendingWebPermissionRequest: PermissionRequest? = null
    private var splashAnimator: AnimatorSet? = null
    private var nativeSplashDismissed = false
    private var authPopupDialog: Dialog? = null
    private var authPopupWebView: WebView? = null
    private var googleSignInClient: GoogleSignInClient? = null
    private var pendingGoogleRequestedRole: String? = null
    private var audioManager: AudioManager? = null
    private var sensorManager: SensorManager? = null
    private var proximitySensor: Sensor? = null
    private var proximityWakeLock: PowerManager.WakeLock? = null
    private var proximityListenerRegistered = false
    private var voiceCallProximityEnabled = false
    private var audioMessageProximityEnabled = false
    private var speakerphoneEnabled = false
    private var isDeviceNear = false
    private var pendingSharePayload: JSONObject? = null
    private var webAppReady = false
    private var pendingCallAction: JSONObject? = null
    private var pendingMessageOpen: JSONObject? = null
    private var lastDispatchedFcmToken: String? = null

    private val proximityListener = object : SensorEventListener {
        override fun onSensorChanged(event: SensorEvent?) {
            val sensor = proximitySensor ?: return
            val distance = event?.values?.firstOrNull() ?: return
            val near = distance < sensor.maximumRange
            if (near == isDeviceNear) return
            isDeviceNear = near
            updateNativeAudioAndProximityState()
        }

        override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit
    }

    private val notificationsPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { _ -> }

    private val permissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { grantResults ->
        val request = pendingWebPermissionRequest
        pendingWebPermissionRequest = null
        if (request == null) return@registerForActivityResult

        val allGranted = grantResults.values.all { it }
        if (allGranted) {
            request.grant(request.resources)
        } else {
            request.deny()
        }
    }

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val callback = filePathCallback
        filePathCallback = null
        if (callback == null) return@registerForActivityResult

        if (result.resultCode != Activity.RESULT_OK) {
            callback.onReceiveValue(null)
            return@registerForActivityResult
        }

        val parsed = WebChromeClient.FileChooserParams.parseResult(
            result.resultCode,
            result.data
        )
        if (!parsed.isNullOrEmpty()) {
            callback.onReceiveValue(parsed)
            return@registerForActivityResult
        }

        val intentData = result.data
        val clipData = intentData?.clipData
        if (clipData != null && clipData.itemCount > 0) {
            val uris = Array(clipData.itemCount) { index -> clipData.getItemAt(index).uri }
            callback.onReceiveValue(uris)
            return@registerForActivityResult
        }

        val singleUri = intentData?.data
        callback.onReceiveValue(singleUri?.let { arrayOf(it) })
    }

    private val googleSignInLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val requestedRole = pendingGoogleRequestedRole
        pendingGoogleRequestedRole = null

        if (result.resultCode != Activity.RESULT_OK) {
            dispatchNativeGoogleSignInError(
                code = "auth/native-google-cancelled",
                message = "Login com Google cancelado.",
                requestedRole = requestedRole
            )
            return@registerForActivityResult
        }

        try {
            val accountTask = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            val account = accountTask.getResult(ApiException::class.java)
            handleGoogleSignInSuccess(account, requestedRole)
        } catch (error: ApiException) {
            dispatchNativeGoogleSignInError(
                code = mapGoogleSignInErrorCode(error.statusCode),
                message = error.localizedMessage ?: "Falha ao autenticar com o Google.",
                requestedRole = requestedRole
            )
        } catch (error: Exception) {
            dispatchNativeGoogleSignInError(
                code = "auth/native-google-failed",
                message = error.localizedMessage ?: "Falha ao autenticar com o Google.",
                requestedRole = requestedRole
            )
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        proximitySensor = sensorManager?.getDefaultSensor(Sensor.TYPE_PROXIMITY)
        proximityWakeLock = createProximityWakeLock()
        googleSignInClient = buildGoogleSignInClient()

        webView = findViewById(R.id.webView)
        splashOverlay = findViewById(R.id.splashOverlay)
        splashLogo = findViewById(R.id.splashLogo)
        CameChatCallIntents.ensureCallNotificationChannel(this)
        CameChatCallIntents.ensureMessageNotificationChannel(this)
        val shouldShowSplash = !CameChatAppState.hasLaunchedOnce
        CameChatAppState.hasLaunchedOnce = true
        if (shouldShowSplash) {
            startNativeSplashAnimation()
        } else {
            nativeSplashDismissed = true
            splashOverlay.alpha = 0f
            splashOverlay.visibility = View.GONE
        }
        configureWebView()
        requestNotificationPermissionIfNeeded()

        if (savedInstanceState == null) {
            webView.loadUrl(BuildConfig.START_URL)
        } else {
            webView.restoreState(savedInstanceState)
            hideNativeSplash()
        }

        handleShareIntent(intent)
        handleCallIntent(intent)
        handleMessageIntent(intent)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                handleWebBackPress()
            }
        })
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleShareIntent(intent)
        handleCallIntent(intent)
        handleMessageIntent(intent)
    }

    private fun handleWebBackPress() {
        if (authPopupDialog?.isShowing == true) {
            val popupWebView = authPopupWebView
            if (popupWebView?.canGoBack() == true) {
                popupWebView.goBack()
            } else {
                dismissAuthPopup()
            }
            return
        }

        if (!::webView.isInitialized) {
            finish()
            return
        }

        val currentUrl = webView.url
        if (currentUrl.isNullOrBlank()) {
            finish()
            return
        }

        val backHandlerScript = """
            (function() {
                try {
                    if (window.CameChatApp && typeof window.CameChatApp.handleAndroidBackPress === 'function') {
                        return !!window.CameChatApp.handleAndroidBackPress();
                    }
                } catch (error) {
                    console.warn('Falha no handler Android de voltar.', error);
                }
                return false;
            })();
        """.trimIndent()

        webView.evaluateJavascript(backHandlerScript) { result ->
            val handled = result == "true"
            if (handled) {
                return@evaluateJavascript
            }

            if (webView.canGoBack()) {
                webView.goBack()
            } else {
                finish()
            }
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return
        val granted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
        if (!granted) {
            notificationsPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        if (::webView.isInitialized) {
            webView.saveState(outState)
        }
    }

    override fun onResume() {
        super.onResume()
        CameChatAppState.isForeground = true
        dispatchFcmTokenIfAvailable()
        NotificationManagerCompat.from(this).cancelAll()
        CameChatCallIntents.stopCallVibration(this)
    }

    override fun onPause() {
        super.onPause()
        CameChatAppState.isForeground = false
    }

    override fun onDestroy() {
        pendingWebPermissionRequest?.deny()
        pendingWebPermissionRequest = null

        filePathCallback?.onReceiveValue(null)
        filePathCallback = null
        splashAnimator?.cancel()
        splashAnimator = null
        dismissAuthPopup()
        releaseAndroidAudioAndProximityState()

        if (::webView.isInitialized) {
            webView.stopLoading()
            webView.webChromeClient = WebChromeClient()
            webView.webViewClient = WebViewClient()
            webView.destroy()
        }
        super.onDestroy()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)
        webView.setBackgroundColor(ContextCompat.getColor(this, R.color.camechat_primary))

        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.javaScriptCanOpenWindowsAutomatically = true
        settings.setSupportMultipleWindows(true)
        settings.loadsImagesAutomatically = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE

        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)
        webView.addJavascriptInterface(CameChatAndroidBridge(), "CameChatAndroid")

        webView.webViewClient = object : WebViewClientCompat() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                return handleNavigationUrl(request.url, request.isForMainFrame)
            }

            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                return handleNavigationUrl(Uri.parse(url), true)
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                hideNativeSplash()
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                runOnUiThread {
                    handleWebPermissionRequest(request)
                }
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                return try {
                    val baseIntent = try {
                        fileChooserParams?.createIntent()
                    } catch (_: Exception) {
                        null
                    }

                    val launchIntent = baseIntent ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "*/*"
                        putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                    }

                    if (fileChooserParams?.mode == FileChooserParams.MODE_OPEN_MULTIPLE) {
                        launchIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                    }

                    fileChooserLauncher.launch(launchIntent)
                    true
                } catch (error: ActivityNotFoundException) {
                    this@MainActivity.filePathCallback = null
                    Toast.makeText(
                        this@MainActivity,
                        getString(R.string.file_chooser_title),
                        Toast.LENGTH_SHORT
                    ).show()
                    false
                }
            }

            override fun onCreateWindow(
                view: WebView?,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: android.os.Message?
            ): Boolean {
                val transport = resultMsg?.obj as? WebView.WebViewTransport ?: return false
                dismissAuthPopup()

                val popupWebView = WebView(this@MainActivity).apply {
                    layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                }
                configurePopupWebView(popupWebView)
                authPopupWebView = popupWebView

                val popupDialog = Dialog(this@MainActivity, android.R.style.Theme_Black_NoTitleBar_Fullscreen).apply {
                    setCancelable(true)
                    setContentView(popupWebView)
                    setOnDismissListener {
                        destroyAuthPopupWebView()
                    }
                }
                authPopupDialog = popupDialog

                transport.webView = popupWebView
                resultMsg.sendToTarget()
                popupDialog.show()
                return true
            }
        }

        webView.setDownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            enqueueDownload(url, userAgent, contentDisposition, mimeType)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configurePopupWebView(popupWebView: WebView) {
        popupWebView.setBackgroundColor(ContextCompat.getColor(this, R.color.camechat_primary))

        val settings = popupWebView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.javaScriptCanOpenWindowsAutomatically = true
        settings.setSupportMultipleWindows(false)
        settings.loadsImagesAutomatically = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE

        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(popupWebView, true)

        popupWebView.webViewClient = object : WebViewClientCompat() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                return handlePopupNavigationUrl(request.url, request.isForMainFrame)
            }

            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                return handlePopupNavigationUrl(Uri.parse(url), true)
            }
        }

        popupWebView.webChromeClient = object : WebChromeClient() {
            override fun onCloseWindow(window: WebView?) {
                runOnUiThread {
                    dismissAuthPopup()
                }
            }
        }
    }

    private fun handlePopupNavigationUrl(uri: Uri, isMainFrame: Boolean = true): Boolean {
        if (!isMainFrame) {
            return false
        }
        val scheme = (uri.scheme ?: "").lowercase()
        if (scheme in listOf("about", "javascript", "data", "blob", "file", "content")) {
            return false
        }

        if (scheme !in listOf("http", "https")) {
            openExternal(uri)
            return true
        }

        return false
    }

    private fun destroyAuthPopupWebView() {
        authPopupDialog = null
        authPopupWebView?.apply {
            stopLoading()
            webChromeClient = WebChromeClient()
            webViewClient = WebViewClient()
            destroy()
        }
        authPopupWebView = null
    }

    private fun dismissAuthPopup() {
        val popupDialog = authPopupDialog
        if (popupDialog != null) {
            popupDialog.setOnDismissListener(null)
            popupDialog.dismiss()
        }
        destroyAuthPopupWebView()
    }

    private fun resolveGoogleWebClientId(): String {
        val generatedResourceId = resources.getIdentifier(
            "default_web_client_id",
            "string",
            packageName
        )
        if (generatedResourceId != 0) {
            val generatedValue = runCatching {
                getString(generatedResourceId).trim()
            }.getOrDefault("")
            if (generatedValue.isNotBlank()) {
                return generatedValue
            }
        }
        return getString(R.string.google_web_client_id).trim()
    }

    private fun buildGoogleSignInClient(): GoogleSignInClient? {
        val webClientId = resolveGoogleWebClientId()
        if (webClientId.isBlank()) return null

        val options = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken(webClientId)
            .build()
        return GoogleSignIn.getClient(this, options)
    }

    private fun beginNativeGoogleSignIn(requestedRole: String?) {
        val client = googleSignInClient
        if (client == null) {
            dispatchNativeGoogleSignInError(
                code = "auth/native-google-unconfigured",
                message = "Configure o Web Client ID do Google para o APK Android.",
                requestedRole = requestedRole
            )
            return
        }

        pendingGoogleRequestedRole = requestedRole?.trim()?.takeIf { it.isNotEmpty() }
        runCatching {
            client.signOut().addOnCompleteListener(this) {
                googleSignInLauncher.launch(client.signInIntent)
            }
        }.onFailure {
            googleSignInLauncher.launch(client.signInIntent)
        }
    }

    private fun handleGoogleSignInSuccess(
        account: GoogleSignInAccount?,
        requestedRole: String?
    ) {
        val idToken = account?.idToken
        if (idToken.isNullOrBlank()) {
            dispatchNativeGoogleSignInError(
                code = "auth/native-google-token-missing",
                message = "O Google não retornou um token de autenticação.",
                requestedRole = requestedRole
            )
            return
        }

        val payload = JSONObject().apply {
            put("ok", true)
            put("idToken", idToken)
            put("requestedRole", requestedRole ?: JSONObject.NULL)
            put("displayName", account.displayName ?: JSONObject.NULL)
            put("email", account.email ?: JSONObject.NULL)
            put("photoURL", account.photoUrl?.toString() ?: JSONObject.NULL)
        }
        dispatchNativeGoogleSignInResult(payload)
    }

    private fun dispatchNativeGoogleSignInError(
        code: String,
        message: String,
        requestedRole: String?
    ) {
        val payload = JSONObject().apply {
            put("ok", false)
            put("code", code)
            put("message", message)
            put("requestedRole", requestedRole ?: JSONObject.NULL)
        }
        dispatchNativeGoogleSignInResult(payload)
    }

    private fun dispatchNativeGoogleSignInResult(payload: JSONObject) {
        if (!::webView.isInitialized) return
        val script = """
            (function() {
                try {
                    if (window.CameChatApp && typeof window.CameChatApp.handleNativeGoogleSignInResult === 'function') {
                        window.CameChatApp.handleNativeGoogleSignInResult(${payload.toString()});
                        return true;
                    }
                } catch (error) {
                    console.warn('Falha ao processar retorno do login Google nativo.', error);
                }
                return false;
            })();
        """.trimIndent()
        webView.evaluateJavascript(script, null)
    }

    private fun mapGoogleSignInErrorCode(statusCode: Int): String {
        return when (statusCode) {
            12501, 16 -> "auth/native-google-cancelled"
            7, 17 -> "auth/network-request-failed"
            10 -> "auth/native-google-unconfigured"
            else -> "auth/native-google-failed"
        }
    }

    private fun startNativeSplashAnimation() {
        if (!::splashLogo.isInitialized) return

        val scaleX = PropertyValuesHolder.ofFloat(View.SCALE_X, 1f, 1.08f, 1f)
        val scaleY = PropertyValuesHolder.ofFloat(View.SCALE_Y, 1f, 1.08f, 1f)
        val alpha = PropertyValuesHolder.ofFloat(View.ALPHA, 0.92f, 1f, 0.92f)

        splashAnimator = AnimatorSet().apply {
            playTogether(
                ObjectAnimator.ofPropertyValuesHolder(splashLogo, scaleX, scaleY, alpha).apply {
                    duration = 900L
                    repeatCount = ObjectAnimator.INFINITE
                    interpolator = AccelerateDecelerateInterpolator()
                }
            )
            start()
        }
    }

    private fun hideNativeSplash() {
        if (nativeSplashDismissed || !::splashOverlay.isInitialized) return
        nativeSplashDismissed = true

        splashAnimator?.cancel()
        splashAnimator = null

        splashOverlay.animate()
            .alpha(0f)
            .setDuration(180L)
            .withEndAction {
                splashOverlay.visibility = View.GONE
            }
            .start()
    }

    private fun createProximityWakeLock(): PowerManager.WakeLock? {
        val powerManager = getSystemService(Context.POWER_SERVICE) as? PowerManager ?: return null
        return try {
            if (!powerManager.isWakeLockLevelSupported(PowerManager.PROXIMITY_SCREEN_OFF_WAKE_LOCK)) {
                null
            } else {
                powerManager.newWakeLock(
                    PowerManager.PROXIMITY_SCREEN_OFF_WAKE_LOCK,
                    "${packageName}:camechat-proximity"
                )
            }
        } catch (_: Exception) {
            null
        }
    }

    private fun registerProximityListenerIfNeeded() {
        val manager = sensorManager ?: return
        val sensor = proximitySensor ?: return
        if (proximityListenerRegistered) return
        proximityListenerRegistered = manager.registerListener(
            proximityListener,
            sensor,
            SensorManager.SENSOR_DELAY_NORMAL
        )
    }

    private fun unregisterProximityListener() {
        if (!proximityListenerRegistered) return
        sensorManager?.unregisterListener(proximityListener)
        proximityListenerRegistered = false
        isDeviceNear = false
    }

    @SuppressLint("WakelockTimeout")
    private fun updateProximityWakeLock(enabled: Boolean) {
        val wakeLock = proximityWakeLock ?: return
        try {
            if (enabled) {
                if (!wakeLock.isHeld) {
                    wakeLock.acquire()
                }
            } else if (wakeLock.isHeld) {
                wakeLock.release()
            }
        } catch (_: Exception) {
            // Ignora falhas pontuais de hardware/ROM para nao interromper a chamada.
        }
    }

    private fun updateNativeAudioAndProximityState() {
        val manager = audioManager ?: return
        val proximityModeActive = voiceCallProximityEnabled || audioMessageProximityEnabled

        if (!proximityModeActive) {
            releaseAndroidAudioAndProximityState()
            return
        }

        registerProximityListenerIfNeeded()

        val useSpeakerphone = when {
            voiceCallProximityEnabled -> speakerphoneEnabled
            audioMessageProximityEnabled -> !isDeviceNear
            else -> false
        }

        try {
            manager.mode = AudioManager.MODE_IN_COMMUNICATION
            manager.isSpeakerphoneOn = useSpeakerphone
        } catch (_: Exception) {
            // Mantem a app funcional mesmo em aparelhos com stacks de audio mais restritivas.
        }

        val keepScreenManagedByProximity =
            (voiceCallProximityEnabled && !speakerphoneEnabled) || audioMessageProximityEnabled
        updateProximityWakeLock(keepScreenManagedByProximity)
    }

    private fun releaseAndroidAudioAndProximityState() {
        updateProximityWakeLock(false)
        unregisterProximityListener()
        try {
            audioManager?.mode = AudioManager.MODE_NORMAL
            audioManager?.isSpeakerphoneOn = false
        } catch (_: Exception) {
            // Sem acao adicional.
        }
    }

    private fun requestFcmTokenInternal() {
        FirebaseMessaging.getInstance().token
            .addOnSuccessListener { token ->
                val safeToken = token?.trim()?.takeIf { it.isNotEmpty() } ?: return@addOnSuccessListener
                CameChatTokenStore.save(this, safeToken)
                dispatchFcmTokenToWeb(safeToken)
            }
            .addOnFailureListener {
                // Token indisponivel no momento.
            }
    }

    private fun dispatchFcmTokenIfAvailable() {
        val token = CameChatTokenStore.read(this)
        if (!token.isNullOrBlank()) {
            dispatchFcmTokenToWeb(token)
        }
    }

    private fun dispatchFcmTokenToWeb(token: String) {
        if (!webAppReady || !::webView.isInitialized) return
        if (token == lastDispatchedFcmToken) return
        lastDispatchedFcmToken = token
        val payload = JSONObject().apply {
            put("token", token)
        }
        val script = """
            (function(){
                if (window.CameChatApp && typeof window.CameChatApp.handleAndroidFcmToken === 'function') {
                    window.CameChatApp.handleAndroidFcmToken(${payload.toString()});
                }
            })();
        """.trimIndent()
        runOnUiThread {
            webView.evaluateJavascript(script, null)
        }
    }

    private fun handleCallIntent(intent: Intent?) {
        if (intent == null) return
        val action = intent.action ?: return
        val supportedActions = setOf(
            CameChatCallIntents.ACTION_CALL_ACCEPT,
            CameChatCallIntents.ACTION_CALL_REJECT,
            CameChatCallIntents.ACTION_CALL_OPEN
        )
        if (!supportedActions.contains(action)) return

        val callId = intent.getStringExtra(CameChatCallIntents.EXTRA_CALL_ID)?.trim().orEmpty()
        if (callId.isBlank()) return

        val payload = JSONObject().apply {
            put("callId", callId)
            put("action", when (action) {
                CameChatCallIntents.ACTION_CALL_ACCEPT -> "accept"
                CameChatCallIntents.ACTION_CALL_REJECT -> "reject"
                else -> "open"
            })
            val callType = intent.getStringExtra(CameChatCallIntents.EXTRA_CALL_TYPE)
            val callerName = intent.getStringExtra(CameChatCallIntents.EXTRA_CALLER_NAME)
            val callerPhoto = intent.getStringExtra(CameChatCallIntents.EXTRA_CALLER_PHOTO)
            val callerId = intent.getStringExtra(CameChatCallIntents.EXTRA_CALLER_ID)
            if (!callType.isNullOrBlank()) put("callType", callType)
            if (!callerName.isNullOrBlank()) put("callerName", callerName)
            if (!callerPhoto.isNullOrBlank()) put("callerPhoto", callerPhoto)
            if (!callerId.isNullOrBlank()) put("callerId", callerId)
        }

        val notificationId = intent.getIntExtra(CameChatCallIntents.EXTRA_NOTIFICATION_ID, -1)
        if (notificationId >= 0) {
            NotificationManagerCompat.from(this).cancel(notificationId)
        }
        CameChatCallIntents.stopCallVibration(this)

        pendingCallAction = payload
        dispatchPendingCallAction()
    }

    private fun handleMessageIntent(intent: Intent?) {
        if (intent == null) return
        val action = intent.action ?: return
        if (action != CameChatCallIntents.ACTION_MESSAGE_OPEN) return

        val senderId = intent.getStringExtra(CameChatCallIntents.EXTRA_MESSAGE_SENDER_ID)?.trim().orEmpty()
        val conversationId = intent.getStringExtra(CameChatCallIntents.EXTRA_MESSAGE_CONVERSATION_ID)?.trim().orEmpty()
        if (senderId.isBlank() && conversationId.isBlank()) return

        val payload = JSONObject().apply {
            if (senderId.isNotBlank()) put("senderId", senderId)
            if (conversationId.isNotBlank()) put("conversationId", conversationId)
        }

        pendingMessageOpen = payload
        dispatchPendingMessageOpen()
    }

    private fun dispatchPendingCallAction() {
        if (!webAppReady) return
        val payload = pendingCallAction ?: return
        pendingCallAction = null
        if (!::webView.isInitialized) return
        val script = """
            (function(){
                if (window.CameChatApp && typeof window.CameChatApp.handleAndroidCallAction === 'function') {
                    window.CameChatApp.handleAndroidCallAction(${payload.toString()});
                }
            })();
        """.trimIndent()
        runOnUiThread {
            webView.evaluateJavascript(script, null)
        }
    }

    private fun dispatchPendingMessageOpen() {
        if (!webAppReady) return
        val payload = pendingMessageOpen ?: return
        pendingMessageOpen = null
        if (!::webView.isInitialized) return
        val script = """
            (function(){
                if (window.CameChatApp && typeof window.CameChatApp.handleAndroidMessageOpen === 'function') {
                    window.CameChatApp.handleAndroidMessageOpen(${payload.toString()});
                }
            })();
        """.trimIndent()
        runOnUiThread {
            webView.evaluateJavascript(script, null)
        }
    }

    private inner class CameChatAndroidBridge {
        @JavascriptInterface
        fun notifyAppReady(screen: String?) {
            runOnUiThread {
                hideNativeSplash()
                webAppReady = true
                dispatchPendingSharePayload()
                dispatchPendingCallAction()
                dispatchPendingMessageOpen()
                dispatchFcmTokenIfAvailable()
                requestFcmTokenInternal()
            }
        }

        @JavascriptInterface
        fun setVoiceCallProximityEnabled(enabled: Boolean) {
            runOnUiThread {
                voiceCallProximityEnabled = enabled
                if (!enabled) {
                    speakerphoneEnabled = false
                }
                updateNativeAudioAndProximityState()
            }
        }

        @JavascriptInterface
        fun setAudioMessageProximityEnabled(enabled: Boolean) {
            runOnUiThread {
                audioMessageProximityEnabled = enabled
                updateNativeAudioAndProximityState()
            }
        }

        @JavascriptInterface
        fun setSpeakerphoneEnabled(enabled: Boolean) {
            runOnUiThread {
                speakerphoneEnabled = enabled
                updateNativeAudioAndProximityState()
            }
        }

        @JavascriptInterface
        fun startGoogleSignIn(requestedRole: String?) {
            runOnUiThread {
                beginNativeGoogleSignIn(requestedRole)
            }
        }

        @JavascriptInterface
        fun downloadMedia(url: String?, fileName: String?, mimeType: String?, scope: String?): Boolean {
            val safeUrl = url?.trim()?.takeIf { it.isNotEmpty() } ?: return false
            runOnUiThread {
                enqueueDirectDownload(safeUrl, fileName, mimeType, scope)
            }
            return true
        }

        @JavascriptInterface
        fun openExternalFile(url: String?, mimeType: String?, fileName: String?): Boolean {
            val safeUrl = url?.trim()?.takeIf { it.isNotEmpty() } ?: return false
            val uri = runCatching { Uri.parse(safeUrl) }.getOrNull() ?: return false
            val inferredMime = mimeType?.trim()?.takeIf { it.isNotEmpty() }
                ?: run {
                    val ext = MimeTypeMap.getFileExtensionFromUrl(safeUrl)?.lowercase(Locale.getDefault())
                    if (!ext.isNullOrBlank()) {
                        MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext)
                    } else {
                        null
                    }
                }
                ?: ""

            return try {
                val intent = Intent(Intent.ACTION_VIEW).apply {
                    if (inferredMime.isNotBlank() && inferredMime != "*/*" && inferredMime != "application/octet-stream") {
                        setDataAndType(uri, inferredMime)
                    } else {
                        data = uri
                    }
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                }
                val title = if (!fileName.isNullOrBlank()) "Abrir ${fileName.trim()}" else "Abrir arquivo"
                startActivity(Intent.createChooser(intent, title))
                true
            } catch (error: ActivityNotFoundException) {
                Toast.makeText(this@MainActivity, "Nenhum aplicativo encontrado para abrir este arquivo.", Toast.LENGTH_SHORT).show()
                false
            } catch (error: Exception) {
                false
            }
        }

        @JavascriptInterface
        fun uploadSharedFile(requestId: String?, uriString: String?, fileName: String?, mimeType: String?): Boolean {
            val safeRequestId = requestId?.trim()?.takeIf { it.isNotEmpty() } ?: return false
            val safeUri = uriString?.trim()?.takeIf { it.isNotEmpty() } ?: return false
            val uri = runCatching { Uri.parse(safeUri) }.getOrNull() ?: return false
            Thread {
                val result = uploadSharedFileInternal(uri, fileName, mimeType)
                dispatchShareUploadResult(safeRequestId, result)
            }.start()
            return true
        }

        @JavascriptInterface
        fun requestFcmToken() {
            runOnUiThread {
                requestFcmTokenInternal()
            }
        }
    }

    private data class ShareMeta(
        val name: String,
        val mimeType: String,
        val size: Long?
    )

    private data class ShareUploadResult(
        val ok: Boolean,
        val url: String? = null,
        val fileName: String? = null,
        val mimeType: String? = null,
        val size: Long? = null,
        val error: String? = null
    )

    private fun handleShareIntent(intent: Intent?) {
        if (intent == null) return
        val action = intent.action ?: return
        if (action != Intent.ACTION_SEND && action != Intent.ACTION_SEND_MULTIPLE) return

        val payload = buildSharePayload(intent)
        pendingSharePayload = payload
        dispatchPendingSharePayload()
    }

    private fun dispatchPendingSharePayload() {
        if (!webAppReady) return
        val payload = pendingSharePayload ?: return
        pendingSharePayload = null

        if (!::webView.isInitialized) return
        val script = """
            (function(){
                if (window.CameChatApp && typeof window.CameChatApp.handleAndroidSharePayload === 'function') {
                    window.CameChatApp.handleAndroidSharePayload(${payload.toString()});
                }
            })();
        """.trimIndent()
        runOnUiThread {
            webView.evaluateJavascript(script, null)
        }
    }

    private fun buildSharePayload(intent: Intent): JSONObject {
        val payload = JSONObject()
        val textParts = mutableListOf<String>()
        val subject = intent.getStringExtra(Intent.EXTRA_SUBJECT)?.trim().orEmpty()
        val text = intent.getStringExtra(Intent.EXTRA_TEXT)?.trim().orEmpty()
        if (subject.isNotEmpty()) textParts.add(subject)
        if (text.isNotEmpty() && text != subject) textParts.add(text)
        val combinedText = textParts.joinToString("\n").trim()
        if (combinedText.isNotEmpty()) {
            payload.put("text", combinedText)
        }

        val items = org.json.JSONArray()
        when (intent.action) {
            Intent.ACTION_SEND -> {
                val uri = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
                    ?: intent.clipData?.getItemAt(0)?.uri
                if (uri != null) {
                    items.put(buildShareItem(uri, intent.type, intent.flags))
                }
            }
            Intent.ACTION_SEND_MULTIPLE -> {
                val uris = intent.getParcelableArrayListExtra<Uri>(Intent.EXTRA_STREAM)
                if (!uris.isNullOrEmpty()) {
                    uris.forEach { uri ->
                        items.put(buildShareItem(uri, intent.type, intent.flags))
                    }
                } else {
                    val clip = intent.clipData
                    if (clip != null) {
                        for (i in 0 until clip.itemCount) {
                            val uri = clip.getItemAt(i).uri
                            if (uri != null) items.put(buildShareItem(uri, intent.type, intent.flags))
                        }
                    }
                }
            }
        }
        payload.put("items", items)
        return payload
    }

    private fun buildShareItem(uri: Uri, fallbackMime: String?, intentFlags: Int): JSONObject {
        grantShareUriPermission(uri, intentFlags)
        val meta = resolveShareMeta(uri, fallbackMime)
        val item = JSONObject()
        item.put("uri", uri.toString())
        item.put("name", meta.name)
        item.put("mimeType", meta.mimeType)
        if (meta.size != null) {
            item.put("size", meta.size)
        }
        return item
    }

    private fun grantShareUriPermission(uri: Uri, intentFlags: Int) {
        val readFlag = Intent.FLAG_GRANT_READ_URI_PERMISSION
        val persistFlag = Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
        if (intentFlags and readFlag == 0) return
        if (intentFlags and persistFlag == 0) return
        runCatching {
            contentResolver.takePersistableUriPermission(uri, readFlag)
        }
    }

    private fun resolveShareMeta(uri: Uri, fallbackMime: String?): ShareMeta {
        var name: String? = null
        var size: Long? = null
        contentResolver.query(uri, null, null, null, null)?.use { cursor ->
            val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
            if (cursor.moveToFirst()) {
                if (nameIndex >= 0) {
                    name = cursor.getString(nameIndex)
                }
                if (sizeIndex >= 0 && !cursor.isNull(sizeIndex)) {
                    size = cursor.getLong(sizeIndex)
                }
            }
        }
        val resolvedName = sanitizeFileName(name ?: "arquivo_${System.currentTimeMillis()}")
        val mimeType = contentResolver.getType(uri) ?: fallbackMime ?: "application/octet-stream"
        return ShareMeta(resolvedName, mimeType, size)
    }

    private fun uploadSharedFileInternal(uri: Uri, fileName: String?, mimeType: String?): ShareUploadResult {
        return try {
            val meta = resolveShareMeta(uri, mimeType)
            if (meta.size != null && meta.size > MAX_CHAT_UPLOAD_BYTES) {
                return ShareUploadResult(
                    ok = false,
                    fileName = fileName ?: meta.name,
                    mimeType = mimeType ?: meta.mimeType,
                    size = meta.size,
                    error = "O arquivo deve ter no maximo 50 MB."
                )
            }
            val safeName = sanitizeFileName(fileName?.takeIf { it.isNotBlank() } ?: meta.name)
            val resolvedMime = mimeType?.takeIf { it.isNotBlank() } ?: meta.mimeType

            val boundary = "----CameChatBoundary${System.currentTimeMillis()}"
            val url = URL("${BuildConfig.BACKEND_URL}/api/upload-chat")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                doOutput = true
                doInput = true
                useCaches = false
                setChunkedStreamingMode(0)
                setRequestProperty("Content-Type", "multipart/form-data; boundary=$boundary")
            }

            DataOutputStream(conn.outputStream).use { output ->
                output.writeBytes("--$boundary\r\n")
                output.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"$safeName\"\r\n")
                output.writeBytes("Content-Type: $resolvedMime\r\n\r\n")
                contentResolver.openInputStream(uri)?.use { input ->
                    val buffer = ByteArray(8192)
                    var read: Int
                    while (input.read(buffer).also { read = it } != -1) {
                        output.write(buffer, 0, read)
                    }
                } ?: throw IllegalStateException("Arquivo indisponível.")
                output.writeBytes("\r\n--$boundary--\r\n")
                output.flush()
            }

            val code = conn.responseCode
            val stream = if (code in 200..299) conn.inputStream else conn.errorStream
            val response = stream?.let { BufferedReader(InputStreamReader(it)).readText() }.orEmpty()
            if (code !in 200..299) {
                return ShareUploadResult(
                    ok = false,
                    fileName = safeName,
                    mimeType = resolvedMime,
                    size = meta.size,
                    error = response.ifBlank { "Falha no upload." }
                )
            }
            val json = runCatching { JSONObject(response) }.getOrNull()
            val fileUrl = json?.optString("url").orEmpty()
            if (fileUrl.isBlank()) {
                return ShareUploadResult(
                    ok = false,
                    fileName = safeName,
                    mimeType = resolvedMime,
                    size = meta.size,
                    error = "Upload sem URL de retorno."
                )
            }
            ShareUploadResult(
                ok = true,
                url = fileUrl,
                fileName = safeName,
                mimeType = resolvedMime,
                size = meta.size
            )
        } catch (error: Exception) {
            ShareUploadResult(
                ok = false,
                fileName = fileName,
                mimeType = mimeType,
                error = error.message ?: "Falha no upload."
            )
        }
    }

    private fun dispatchShareUploadResult(requestId: String, result: ShareUploadResult) {
        if (!::webView.isInitialized) return
        val payload = JSONObject().apply {
            put("requestId", requestId)
            put("ok", result.ok)
            if (!result.url.isNullOrBlank()) put("url", result.url)
            if (!result.fileName.isNullOrBlank()) put("fileName", result.fileName)
            if (!result.mimeType.isNullOrBlank()) put("mimeType", result.mimeType)
            if (result.size != null) put("size", result.size)
            if (!result.error.isNullOrBlank()) put("error", result.error)
        }
        val script = """
            (function(){
                if (window.CameChatApp && typeof window.CameChatApp.handleAndroidShareUploadResult === 'function') {
                    window.CameChatApp.handleAndroidShareUploadResult(${payload.toString()});
                }
            })();
        """.trimIndent()
        runOnUiThread {
            webView.evaluateJavascript(script, null)
        }
    }

    private fun handleNavigationUrl(uri: Uri, isMainFrame: Boolean = true): Boolean {
        if (!isMainFrame) {
            return false
        }
        val scheme = (uri.scheme ?: "").lowercase()
        if (scheme in listOf("about", "javascript", "data", "blob", "file", "content")) {
            return false
        }

        if (scheme !in listOf("http", "https")) {
            openExternal(uri)
            return true
        }

        val startHost = Uri.parse(BuildConfig.START_URL).host
        val targetHost = uri.host
        if (!startHost.isNullOrBlank() && startHost.equals(targetHost, ignoreCase = true)) {
            return false
        }

        openExternal(uri)
        return true
    }

    private fun openExternal(uri: Uri) {
        val intent = Intent(Intent.ACTION_VIEW, uri)
        try {
            startActivity(intent)
        } catch (error: ActivityNotFoundException) {
            Toast.makeText(this, uri.toString(), Toast.LENGTH_SHORT).show()
        }
    }

    private fun handleWebPermissionRequest(request: PermissionRequest) {
        val requiredPermissions = mutableSetOf<String>()
        request.resources.forEach { resource ->
            when (resource) {
                PermissionRequest.RESOURCE_VIDEO_CAPTURE -> requiredPermissions += Manifest.permission.CAMERA
                PermissionRequest.RESOURCE_AUDIO_CAPTURE -> requiredPermissions += Manifest.permission.RECORD_AUDIO
            }
        }

        if (requiredPermissions.isEmpty()) {
            request.grant(request.resources)
            return
        }

        val missingPermissions = requiredPermissions.filter { permission ->
            ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED
        }

        if (missingPermissions.isEmpty()) {
            request.grant(request.resources)
            return
        }

        pendingWebPermissionRequest?.deny()
        pendingWebPermissionRequest = request
        permissionsLauncher.launch(missingPermissions.toTypedArray())
    }

    private fun trySilentDownload(
        url: String,
        fileName: String,
        mimeType: String?,
        relativeDir: String,
        userAgent: String?,
        cookies: String?
    ): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return false

        Thread {
            val resolver = applicationContext.contentResolver
            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                if (!mimeType.isNullOrBlank()) {
                    put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                }
                put(
                    MediaStore.MediaColumns.RELATIVE_PATH,
                    "${Environment.DIRECTORY_DOWNLOADS}/${relativeDir.trimStart('/')}"
                )
                put(MediaStore.MediaColumns.IS_PENDING, 1)
            }

            val itemUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
            if (itemUri == null) {
                enqueueDownloadManager(url, fileName, mimeType, "${relativeDir.trimEnd('/')}/$fileName", userAgent, cookies)
                return@Thread
            }

            try {
                val connection = (URL(url).openConnection() as HttpURLConnection).apply {
                    instanceFollowRedirects = true
                    if (!userAgent.isNullOrBlank()) {
                        setRequestProperty("User-Agent", userAgent)
                    }
                    if (!cookies.isNullOrBlank()) {
                        setRequestProperty("Cookie", cookies)
                    }
                }
                connection.connect()
                val code = connection.responseCode
                if (code !in 200..299) {
                    throw IOException("HTTP $code")
                }

                resolver.openOutputStream(itemUri)?.use { output ->
                    connection.inputStream.use { input ->
                        input.copyTo(output)
                    }
                } ?: throw IOException("Falha ao abrir saida de arquivo.")

                values.clear()
                values.put(MediaStore.MediaColumns.IS_PENDING, 0)
                resolver.update(itemUri, values, null, null)
            } catch (error: Exception) {
                resolver.delete(itemUri, null, null)
                enqueueDownloadManager(url, fileName, mimeType, "${relativeDir.trimEnd('/')}/$fileName", userAgent, cookies)
            }
        }.start()

        return true
    }

    private fun enqueueDownloadManager(
        url: String,
        fileName: String,
        mimeType: String?,
        relativePath: String,
        userAgent: String?,
        cookies: String?
    ) {
        try {
            val request = DownloadManager.Request(Uri.parse(url))
            if (!cookies.isNullOrBlank()) {
                request.addRequestHeader("cookie", cookies)
            }
            if (!userAgent.isNullOrBlank()) {
                request.addRequestHeader("User-Agent", userAgent)
            }
            if (!mimeType.isNullOrBlank()) {
                request.setMimeType(mimeType)
            }
            request.setTitle(fileName)
            request.setDescription(getString(R.string.download_starting))
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            request.setVisibleInDownloadsUi(true)
            request.setAllowedOverMetered(true)
            request.setAllowedOverRoaming(true)
            applyCameChatDestination(request, relativePath)

            val manager = getSystemService(DOWNLOAD_SERVICE) as DownloadManager
            manager.enqueue(request)
        } catch (error: Exception) {
            Toast.makeText(this, getString(R.string.download_failed), Toast.LENGTH_SHORT).show()
        }
    }

    private fun enqueueDownload(
        url: String,
        userAgent: String?,
        contentDisposition: String?,
        mimeType: String?
    ) {
        val parsedUri = Uri.parse(url)
        val cookies = CookieManager.getInstance().getCookie(url)
        val fileName = sanitizeFileName(URLUtil.guessFileName(url, contentDisposition, mimeType))
        val category = resolveDownloadCategory(fileName, mimeType)
        val scopePrefix = if ((parsedUri.getQueryParameter("camechat_scope") ?: "").lowercase(Locale.ROOT) == "sent") {
            "Enviados/"
        } else {
            ""
        }
        val relativeDir = "CameChat/Media/${scopePrefix}$category"
        val relativePath = "$relativeDir/$fileName"
        if (trySilentDownload(url, fileName, mimeType, relativeDir, userAgent, cookies)) return
        enqueueDownloadManager(url, fileName, mimeType, relativePath, userAgent, cookies)
    }

    private fun enqueueDirectDownload(
        url: String,
        fileName: String?,
        mimeType: String?,
        scope: String?
    ) {
        val parsedUri = Uri.parse(url)
        val cookies = CookieManager.getInstance().getCookie(url)
        val userAgent = if (::webView.isInitialized) {
            webView.settings.userAgentString
        } else {
            WebSettings.getDefaultUserAgent(this)
        }

        val guessedName = URLUtil.guessFileName(url, null, mimeType)
        val resolvedName = sanitizeFileName(fileName?.takeIf { it.isNotBlank() } ?: guessedName)
        val category = resolveDownloadCategory(resolvedName, mimeType)
        val scopePrefix = if ((scope ?: "").lowercase(Locale.ROOT) == "sent") {
            "Enviados/"
        } else {
            ""
        }
        val relativeDir = "CameChat/Media/${scopePrefix}$category"
        val relativePath = "$relativeDir/$resolvedName"
        if (trySilentDownload(url, resolvedName, mimeType, relativeDir, userAgent, cookies)) return
        enqueueDownloadManager(url, resolvedName, mimeType, relativePath, userAgent, cookies)
    }

    private fun sanitizeFileName(fileName: String): String {
        val cleaned = fileName.replace(Regex("[\\\\/:*?\"<>|]+"), "_").trim()
        return if (cleaned.isBlank()) "arquivo_${System.currentTimeMillis()}" else cleaned
    }

    private fun applyCameChatDestination(
        request: DownloadManager.Request,
        relativePath: String
    ) {
        val normalizedPath = relativePath.trimStart('/', '\\')
        try {
            // Tenta criar em /storage/emulated/0/CameChat/... quando permitido pelo sistema.
            request.setDestinationInExternalPublicDir("", normalizedPath)
        } catch (error: Exception) {
            // Fallback seguro para Downloads/CameChat/... em dispositivos com restricoes de escrita.
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, normalizedPath)
        }
    }

    private fun resolveDownloadCategory(fileName: String, mimeType: String?): String {
        val mime = (mimeType ?: "").lowercase(Locale.ROOT)
        val extension = fileName.substringAfterLast('.', "").lowercase(Locale.ROOT)

        if (mime.startsWith("image/")) return "Images"
        if (mime.startsWith("video/")) return "Video"
        if (mime.startsWith("audio/")) return "Audio"

        val imageExt = setOf("jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "heic", "heif", "avif")
        val videoExt = setOf("mp4", "webm", "mov", "mkv", "avi", "3gp", "m4v")
        val audioExt = setOf("mp3", "wav", "ogg", "m4a", "aac", "flac", "opus", "amr", "weba")

        return when {
            imageExt.contains(extension) -> "Images"
            videoExt.contains(extension) -> "Video"
            audioExt.contains(extension) -> "Audio"
            else -> "Documents"
        }
    }
}
