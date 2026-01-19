// Native Bridge Utility

export const bridge = {
  /**
   * Send message to Native App
   * @param {string} action - The action name (e.g. 'Pay')
   * @param {string} p1 - Parameter 1 (e.g. Product ID)
   * @param {string} p2 - Parameter 2
   * @param {string} p3 - Parameter 3
   */
  callNative(action, p1 = "", p2 = "", p3 = "") {
    const message = { action, p1, p2, p3 }
    
    console.log('[Bridge] Sending:', message)

    try {
      // iOS / WebKit
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.event) {
        window.webkit.messageHandlers.event.postMessage(message)
      } 
      // Android / Other
      else if (window.android && window.android.event) {
        window.android.event(JSON.stringify(message))
      }
      // Fallback for Dev/Browser
      else {
        console.warn('[Bridge] Native interface not found. Dev mode?')
      }
    } catch (e) {
      console.error('[Bridge] Failed to send message:', e)
    }
  }
}

// Global Event Bus for Native Callbacks
import { reactive } from 'vue'
export const nativeEvents = reactive({
  lastEvent: null,
  timestamp: 0
})

// Register global callback
window.onAppEvent = (eventName, data) => {
  console.log('[Bridge] Received:', eventName, data)
  nativeEvents.lastEvent = { name: eventName, data }
  nativeEvents.timestamp = Date.now()
}
