<template>
  <div class="p-4 space-y-6">
    <!-- Profile Header -->
    <div :class="['rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300', currentBg]">
      <!-- Background Toggle -->
      <button @click="showBgPicker = true" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-gray-700 hover:bg-white/40 transition-colors">
        <i class="ph-bold ph-palette"></i>
      </button>

      <div class="w-20 h-20 rounded-full bg-white/50 backdrop-blur-sm mb-4 p-1 border border-white/30 relative z-10">
        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Gabbie" class="w-full h-full rounded-full">
      </div>
      <h2 class="text-xl font-bold text-gray-900 relative z-10">Gabbie Traveler</h2>
      <p class="text-gray-500 text-sm relative z-10">Explorer Level 1</p>
      
      <div class="flex gap-4 mt-6 w-full relative z-10">
        <div class="flex-1 bg-white/60 backdrop-blur-md rounded-xl p-3">
          <div class="text-lg font-bold text-gray-900">{{ userStore.balance }}</div>
          <div class="text-xs text-gray-500 uppercase font-bold">Coins</div>
        </div>
        <div class="flex-1 bg-white/60 backdrop-blur-md rounded-xl p-3">
          <div class="text-lg font-bold text-gray-900">{{ tripStore.trips.length }}</div>
          <div class="text-xs text-gray-500 uppercase font-bold">Trips</div>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 flex items-center justify-between border-b border-gray-50 cursor-pointer active:bg-gray-50" @click="showAccountDetails = true">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <i class="ph-fill ph-user"></i>
          </div>
          <span class="font-medium text-gray-700">Account Details</span>
        </div>
        <i class="ph-bold ph-caret-right text-gray-300"></i>
      </div>

      <div class="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50" @click="toggleNotifications">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <i class="ph-fill ph-bell"></i>
          </div>
          <span class="font-medium text-gray-700">Notifications</span>
        </div>
        <div :class="['relative w-10 h-6 rounded-full transition-colors duration-200', notificationsEnabled ? 'bg-green-500' : 'bg-gray-200']">
          <div :class="['absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200', notificationsEnabled ? 'translate-x-4' : 'translate-x-0']"></div>
        </div>
      </div>
    </div>
    
    <div class="text-center text-xs text-gray-400">
      Gabbie v2.0.0
    </div>

    <!-- Account Details Modal -->
    <div v-if="showAccountDetails" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" @click.self="showAccountDetails = false">
        <div class="bg-white rounded-2xl p-6 w-full max-w-sm animate-slide-up">
            <h3 class="font-bold text-gray-900 text-lg mb-4">Account Details</h3>
            <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-gray-500">User ID</span>
                    <span class="font-mono text-gray-900">GB-{{ Math.floor(Math.random() * 100000) }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-gray-500">Member Since</span>
                    <span class="text-gray-900">Jan 2026</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-gray-500">Version</span>
                    <span class="text-gray-900">2.0.1</span>
                </div>
            </div>
            <button @click="showAccountDetails = false" class="w-full mt-6 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl">Close</button>
        </div>
    </div>

    <!-- Background Picker Modal -->
    <div v-if="showBgPicker" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" @click.self="showBgPicker = false">
        <div class="bg-white rounded-2xl p-6 w-full max-w-sm animate-slide-up">
            <h3 class="font-bold text-gray-900 text-lg mb-4">Customize Background</h3>
            <div class="grid grid-cols-2 gap-3">
                <div v-for="bg in backgrounds" :key="bg.id" 
                     @click="selectBg(bg)"
                     :class="['h-24 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden', 
                              currentBg === bg.class ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100',
                              bg.class]">
                    
                    <span v-if="bg.id === 'default'" class="font-bold text-gray-500 bg-white/80 px-2 rounded text-xs">Default</span>
                    
                    <div v-else-if="!userStore.hasUnlocked(bg.id)" class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                        <i class="ph-fill ph-lock-key text-2xl mb-1"></i>
                        <span class="text-xs font-bold">{{ bg.price }} Coins</span>
                    </div>

                    <div v-else class="absolute bottom-2 right-2 bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                        <i class="ph-bold ph-check text-xs"></i>
                    </div>
                </div>
            </div>
            <button @click="showBgPicker = false" class="w-full mt-6 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl">Close</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useTripStore } from '../stores/trips'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const tripStore = useTripStore()
const router = useRouter()

const showBgPicker = ref(false)
const showAccountDetails = ref(false)
const notificationsEnabled = ref(localStorage.getItem('gabbie_notifications') === 'true')
const activeBgId = ref(localStorage.getItem('gabbie_profile_bg') || 'default')

const toggleNotifications = () => {
  notificationsEnabled.value = !notificationsEnabled.value
  localStorage.setItem('gabbie_notifications', notificationsEnabled.value)
}

const backgrounds = [
    { id: 'default', class: 'bg-white', price: 0 },
    { id: 'bg_sunset', class: 'bg-gradient-to-br from-orange-100 to-rose-100', price: 30 },
    { id: 'bg_ocean', class: 'bg-gradient-to-br from-cyan-100 to-blue-100', price: 30 },
    { id: 'bg_forest', class: 'bg-gradient-to-br from-emerald-100 to-teal-100', price: 30 }
]

const currentBg = computed(() => {
    const bg = backgrounds.find(b => b.id === activeBgId.value)
    return bg ? bg.class : 'bg-white'
})

const selectBg = (bg) => {
    if (bg.id === 'default' || userStore.hasUnlocked(bg.id)) {
        activeBgId.value = bg.id
        localStorage.setItem('gabbie_profile_bg', bg.id)
    } else {
        if (confirm(`Unlock this background for ${bg.price} Coins?`)) {
            if (userStore.purchaseItem(bg.id, bg.price)) {
                activeBgId.value = bg.id
                localStorage.setItem('gabbie_profile_bg', bg.id)
                alert('Background Unlocked!')
            } else {
                if (confirm('Insufficient coins! Go to Store?')) {
                    router.push('/store')
                }
            }
        }
    }
}
</script>

<style>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
