package com.camechat.app

import android.app.PendingIntent
import android.content.Intent
import android.graphics.BitmapFactory
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.Person
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class CameChatMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        CameChatTokenStore.save(this, token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val data = remoteMessage.data
        if (data.isEmpty()) return
        if (CameChatAppState.isForeground) return
        val kind = (data["type"] ?: data["action"] ?: "").lowercase()
        when (kind) {
            "call" -> showIncomingCallNotification(data)
            "message" -> showIncomingMessageNotification(data)
            else -> return
        }
    }

    private fun showIncomingCallNotification(data: Map<String, String>) {
        val callId = data["callId"] ?: data["call_id"] ?: return
        val callType = (data["callType"] ?: data["call_type"] ?: "audio").lowercase()
        val callerName = data["callerName"] ?: data["caller_name"] ?: "Usuário"
        val callerPhoto = data["callerPhoto"] ?: data["caller_photo"] ?: ""
        val callerId = data["callerId"] ?: data["caller_id"] ?: ""

        val notificationId = callId.hashCode()
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE

        val openIntent = Intent(this, MainActivity::class.java).apply {
            action = CameChatCallIntents.ACTION_CALL_OPEN
            putExtra(CameChatCallIntents.EXTRA_CALL_ID, callId)
            putExtra(CameChatCallIntents.EXTRA_CALL_TYPE, callType)
            putExtra(CameChatCallIntents.EXTRA_CALLER_NAME, callerName)
            putExtra(CameChatCallIntents.EXTRA_CALLER_PHOTO, callerPhoto)
            putExtra(CameChatCallIntents.EXTRA_CALLER_ID, callerId)
            putExtra(CameChatCallIntents.EXTRA_NOTIFICATION_ID, notificationId)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val fullScreenIntent = PendingIntent.getActivity(this, notificationId, openIntent, flags)

        val acceptIntent = Intent(this, MainActivity::class.java).apply {
            action = CameChatCallIntents.ACTION_CALL_ACCEPT
            putExtra(CameChatCallIntents.EXTRA_CALL_ID, callId)
            putExtra(CameChatCallIntents.EXTRA_CALL_TYPE, callType)
            putExtra(CameChatCallIntents.EXTRA_CALLER_NAME, callerName)
            putExtra(CameChatCallIntents.EXTRA_CALLER_PHOTO, callerPhoto)
            putExtra(CameChatCallIntents.EXTRA_CALLER_ID, callerId)
            putExtra(CameChatCallIntents.EXTRA_NOTIFICATION_ID, notificationId)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val acceptPending = PendingIntent.getActivity(this, notificationId + 1, acceptIntent, flags)

        val rejectIntent = Intent(this, MainActivity::class.java).apply {
            action = CameChatCallIntents.ACTION_CALL_REJECT
            putExtra(CameChatCallIntents.EXTRA_CALL_ID, callId)
            putExtra(CameChatCallIntents.EXTRA_CALL_TYPE, callType)
            putExtra(CameChatCallIntents.EXTRA_CALLER_NAME, callerName)
            putExtra(CameChatCallIntents.EXTRA_CALLER_PHOTO, callerPhoto)
            putExtra(CameChatCallIntents.EXTRA_CALLER_ID, callerId)
            putExtra(CameChatCallIntents.EXTRA_NOTIFICATION_ID, notificationId)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val rejectPending = PendingIntent.getActivity(this, notificationId + 2, rejectIntent, flags)

        val channelId = CameChatCallIntents.ensureCallNotificationChannel(this)
        val contentText = if (callType == "video") {
            "📹 ${getString(R.string.call_incoming_video)}"
        } else {
            "📞 ${getString(R.string.call_incoming_voice)}"
        }

        val largeIcon = BitmapFactory.decodeResource(resources, R.mipmap.ic_launcher)

        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(callerName)
            .setContentText(contentText)
            .setSubText(getString(R.string.app_name))
            .setLargeIcon(largeIcon)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(true)
            .setFullScreenIntent(fullScreenIntent, true)
            .setDefaults(NotificationCompat.DEFAULT_ALL)

        val callerPerson = Person.Builder()
            .setName(callerName)
            .setImportant(true)
            .build()
        builder.setStyle(
            NotificationCompat.CallStyle.forIncomingCall(
                callerPerson,
                rejectPending,
                acceptPending
            )
        )

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            builder.addAction(R.drawable.ic_call_reject, getString(R.string.call_reject), rejectPending)
            builder.addAction(R.drawable.ic_call_accept, getString(R.string.call_accept), acceptPending)
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            builder.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE))
            builder.setVibrate(longArrayOf(0, 800, 400, 800))
        }

        CameChatCallIntents.startCallVibration(this)
        NotificationManagerCompat.from(this).notify(notificationId, builder.build())
    }

    private fun showIncomingMessageNotification(data: Map<String, String>) {
        val senderName = data["senderName"] ?: data["sender_name"] ?: "Usuário"
        val messageText = data["messageText"] ?: data["message_text"] ?: ""
        val messageType = (data["messageType"] ?: data["message_type"] ?: "").lowercase()
        val resolvedType = if (messageType.isBlank()) "text" else messageType
        val fileName = data["fileName"] ?: data["file_name"] ?: ""
        val notificationBody = data["notificationBody"]
            ?: data["notification_body"]
            ?: when {
                messageText.isNotBlank() -> messageText
                resolvedType == "image" -> "Foto recebida"
                resolvedType == "video" -> "Vídeo recebido"
                resolvedType == "audio" -> "Áudio recebido"
                fileName.isNotBlank() -> "Arquivo recebido: $fileName"
                else -> "Nova mensagem"
            }
        val typeIcon = when (resolvedType) {
            "audio" -> "🎤"
            "video" -> "📹"
            "text" -> "💬"
            "image" -> "🖼️"
            else -> "📎"
        }
        val notificationBodyWithIcon = "$typeIcon $notificationBody"

        val notificationId = (data["conversationId"] ?: data["senderId"] ?: senderName).hashCode()
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE

        val openIntent = Intent(this, MainActivity::class.java).apply {
            action = CameChatCallIntents.ACTION_MESSAGE_OPEN
            putExtra(CameChatCallIntents.EXTRA_MESSAGE_SENDER_ID, data["senderId"] ?: data["sender_id"] ?: "")
            putExtra(CameChatCallIntents.EXTRA_MESSAGE_CONVERSATION_ID, data["conversationId"] ?: data["conversation_id"] ?: "")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val contentPending = PendingIntent.getActivity(this, notificationId, openIntent, flags)

        val channelId = CameChatCallIntents.ensureMessageNotificationChannel(this)
        val largeIcon = BitmapFactory.decodeResource(resources, R.mipmap.ic_launcher)

        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(senderName)
            .setContentText(notificationBodyWithIcon)
            .setStyle(NotificationCompat.BigTextStyle().bigText(notificationBodyWithIcon))
            .setSubText(getString(R.string.app_name))
            .setLargeIcon(largeIcon)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
            .setAutoCancel(true)
            .setContentIntent(contentPending)

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            builder.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
            builder.setVibrate(longArrayOf(0, 500, 300, 500))
        }

        NotificationManagerCompat.from(this).notify(notificationId, builder.build())
    }

    // Canal criado no util CameChatCallIntents
}
