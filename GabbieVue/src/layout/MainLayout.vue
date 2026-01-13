<template>
  <div class="flex-1 flex flex-col h-full relative">
    <!-- Header Area -->
    <header class="bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 pt-[max(env(safe-area-inset-top),20px)] pb-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-3">
          <!-- Settings Trigger (Only on Dashboard) -->
          <button v-if="currentRouteName === 'Dashboard'" @click="showSettings = true" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200">
            <i class="ph-bold ph-list"></i>
          </button>
          
          <!-- Back Button (For secondary pages) -->
          <button v-else-if="!isMainTab" @click="$router.back()" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200">
            <i class="ph-bold ph-caret-left"></i>
          </button>

          <h1 class="text-lg font-bold text-gray-900 capitalize">{{ currentRouteName }}</h1>
      </div>
      
      <!-- Coin Balance Widget -->
      <div @click="$router.push('/store')" class="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200 active:scale-95 transition-transform cursor-pointer">
        <i class="ph-fill ph-coins text-yellow-500 text-lg"></i>
        <span class="text-sm font-bold text-yellow-700">{{ coinBalance }}</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden bg-gray-50 relative z-0">
      <router-view v-slot="{ Component }">
        <transition name="fade-page" mode="out-in">
          <component :is="Component" class="flex-1 overflow-y-auto overflow-x-hidden pb-[calc(80px+env(safe-area-inset-bottom))]" />
        </transition>
      </router-view>
    </main>

    <!-- Tab Bar -->
    <nav v-show="isMainTab" class="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 z-[1000] pb-[env(safe-area-inset-bottom)]">
      <div class="flex justify-around items-center h-[60px]">
        <router-link to="/dashboard" class="tab-item" active-class="active">
          <i class="ph ph-squares-four"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/journal" class="tab-item" active-class="active">
          <i class="ph ph-notebook"></i>
          <span>Journal</span>
        </router-link>
        <router-link to="/map" class="tab-item" active-class="active">
          <i class="ph ph-globe-hemisphere-west"></i>
          <span>Map</span>
        </router-link>
        <router-link to="/memoir" class="tab-item" active-class="active">
          <i class="ph ph-image"></i>
          <span>Memoir</span>
        </router-link>
      </div>
    </nav>

    <!-- Settings Modal (Left Drawer) -->
    <div v-if="showSettings" class="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex justify-start" @click.self="showSettings = false">
        <div class="w-3/4 max-w-xs h-full bg-white shadow-2xl p-6 flex flex-col animate-slide-right">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-gray-900">Menu</h2>
                <button @click="showSettings = false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <i class="ph-bold ph-x"></i>
                </button>
            </div>

            <div class="space-y-2">
                <button @click="openWebview('Privacy Policy', 'https://www.wikipedia.org/')" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                    <i class="ph-bold ph-shield-check text-xl"></i>
                    <span class="font-medium">Privacy Policy</span>
                </button>
                <button @click="openWebview('Terms of Service', 'https://www.wikipedia.org/')" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                    <i class="ph-bold ph-file-text text-xl"></i>
                    <span class="font-medium">Terms of Service</span>
                </button>
                <div class="h-px bg-gray-100 my-2"></div>
                <button @click="resetData" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600">
                    <i class="ph-bold ph-trash text-xl"></i>
                    <span class="font-medium">Reset Data</span>
                </button>
            </div>

            <div class="mt-auto text-center text-xs text-gray-400">
                Gabbie v2.0.1
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const showSettings = ref(false)

const currentRouteName = computed(() => {
  // Special case for Webview to show actual page title if passed in query
  if (route.path.includes('webview') && route.query.title) {
    return route.query.title
  }
  
  const path = route.path.split('/')[1]
  const name = path || 'dashboard'
  return name.charAt(0).toUpperCase() + name.slice(1)
})

const isMainTab = computed(() => {
  const mainTabs = ['dashboard', 'journal', 'map', 'memoir']
  const path = route.path.split('/')[1] || 'dashboard'
  return mainTabs.includes(path.toLowerCase())
})

const coinBalance = computed(() => userStore.balance)

const openWebview = (title, url) => {
  showSettings.value = false
  router.push({
    path: '/webview',
    query: {
      title: title,
      url: encodeURIComponent(url)
    }
  })
}

const resetData = () => {
  if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
    localStorage.clear()
    window.location.reload()
  }
}
</script>

<style scoped>
.tab-item {
  @apply flex flex-col items-center justify-center gap-1 text-gray-400 w-16 h-full transition-colors;
}
.tab-item i {
  @apply text-2xl;
}
.tab-item span {
  @apply text-[10px] font-medium;
}
.tab-item.active {
  @apply text-blue-600;
}
.tab-item.active i {
  @apply font-bold;
}

.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slide-right {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-slide-right {
  animation: slide-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
