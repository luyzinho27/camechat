package com.camechat.app

object CameChatAppState {
    @Volatile
    var isForeground: Boolean = false
    @Volatile
    var hasLaunchedOnce: Boolean = false
}
