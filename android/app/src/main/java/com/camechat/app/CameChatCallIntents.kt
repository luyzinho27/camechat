package com.camechat.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Handler
import android.os.Build
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.core.app.NotificationCompat

object CameChatCallIntents {
    const val ACTION_CALL_ACCEPT = "com.camechat.app.ACTION_CALL_ACCEPT"
    const val ACTION_CALL_REJECT = "com.camechat.app.ACTION_CALL_REJECT"
    const val ACTION_CALL_OPEN = "com.camechat.app.ACTION_CALL_OPEN"
    const val ACTION_MESSAGE_OPEN = "com.camechat.app.ACTION_MESSAGE_OPEN"

    const val EXTRA_CALL_ID = "call_id"
    const val EXTRA_CALL_TYPE = "call_type"
    const val EXTRA_CALLER_ID = "caller_id"
    const val EXTRA_CALLER_NAME = "caller_name"
    const val EXTRA_CALLER_PHOTO = "caller_photo"
    const val EXTRA_NOTIFICATION_ID = "call_notification_id"
    const val EXTRA_MESSAGE_SENDER_ID = "message_sender_id"
    const val EXTRA_MESSAGE_CONVERSATION_ID = "message_conversation_id"

    const val PREFS_NAME = "camechat_prefs"
    const val PREF_FCM_TOKEN = "camechat_fcm_token"
    const val CHANNEL_CALLS = "camechat_calls"
    const val CHANNEL_MESSAGES = "camechat_messages"

    private const val CALL_VIBRATION_DURATION_MS = 40000L
    private val callVibrationPattern = longArrayOf(0, 1000, 1000)
    private var vibrationHandler: Handler? = null
    private var vibrationStopper: Runnable? = null

    fun ensureCallNotificationChannel(context: Context): String {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = context.getSystemService(NotificationManager::class.java)
            val existing = manager.getNotificationChannel(CHANNEL_CALLS)
            val needsReset = existing == null
                || existing.importance < NotificationManager.IMPORTANCE_HIGH
                || !existing.shouldVibrate()
                || existing.sound == null
            if (needsReset) {
                if (existing != null) {
                    manager.deleteNotificationChannel(CHANNEL_CALLS)
                }
                val ringtone = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
                val audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()

                val channel = NotificationChannel(
                    CHANNEL_CALLS,
                    "Chamadas",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Alertas de chamadas recebidas"
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 800, 400, 800)
                    setSound(ringtone, audioAttributes)
                    lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                }

                manager.createNotificationChannel(channel)
            }
        }
        return CHANNEL_CALLS
    }

    fun startCallVibration(context: Context) {
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator ?: return
        stopCallVibration(context)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val effect = VibrationEffect.createWaveform(callVibrationPattern, 0)
            vibrator.vibrate(effect)
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(callVibrationPattern, 0)
        }

        val handler = Handler(Looper.getMainLooper())
        val stopper = Runnable { stopCallVibration(context) }
        handler.postDelayed(stopper, CALL_VIBRATION_DURATION_MS)
        vibrationHandler = handler
        vibrationStopper = stopper
    }

    fun stopCallVibration(context: Context) {
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        try {
            vibrator?.cancel()
        } catch (error: Exception) {
            // ignore
        }
        val handler = vibrationHandler
        val stopper = vibrationStopper
        if (handler != null && stopper != null) {
            handler.removeCallbacks(stopper)
        }
        vibrationHandler = null
        vibrationStopper = null
    }

    fun ensureMessageNotificationChannel(context: Context): String {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = context.getSystemService(NotificationManager::class.java)
            val existing = manager.getNotificationChannel(CHANNEL_MESSAGES)
            val needsReset = existing == null
                || existing.importance < NotificationManager.IMPORTANCE_DEFAULT
            if (needsReset) {
                if (existing != null) {
                    manager.deleteNotificationChannel(CHANNEL_MESSAGES)
                }
                val sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
                val audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()

                val channel = NotificationChannel(
                    CHANNEL_MESSAGES,
                    "Mensagens",
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "Alertas de novas mensagens"
                    enableVibration(true)
                    setSound(sound, audioAttributes)
                    lockscreenVisibility = NotificationCompat.VISIBILITY_PRIVATE
                }

                manager.createNotificationChannel(channel)
            }
        }
        return CHANNEL_MESSAGES
    }
}

object CameChatTokenStore {
    fun save(context: Context, token: String) {
        context.getSharedPreferences(CameChatCallIntents.PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(CameChatCallIntents.PREF_FCM_TOKEN, token)
            .apply()
    }

    fun read(context: Context): String? {
        return context.getSharedPreferences(CameChatCallIntents.PREFS_NAME, Context.MODE_PRIVATE)
            .getString(CameChatCallIntents.PREF_FCM_TOKEN, null)
            ?.trim()
            ?.takeIf { it.isNotEmpty() }
    }
}
