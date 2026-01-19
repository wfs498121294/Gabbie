<template>
  <div class="p-4 space-y-6 pb-24">
    <!-- Balance Card -->
    <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 sticky top-4 z-10">
      <div class="text-sm font-medium opacity-90">Current Balance</div>
      <div class="flex items-end gap-2 mt-1">
        <span class="text-4xl font-bold">{{ userStore.balance }}</span>
        <span class="text-xl font-medium mb-1">Coins</span>
      </div>
    </div>

    <!-- Shop Content -->
    <div>
      <!-- Special Offers Section -->
      <div v-if="promoItems.length > 0" class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <i class="ph-fill ph-fire text-orange-500 text-xl"></i>
          <h2 class="text-lg font-bold text-gray-900">Special Offers</h2>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="item in promoItems" :key="item.id" 
               @click="initiatePurchase(item)"
               class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-orange-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden group">
            <div class="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
              PROMO
            </div>
            <div class="flex flex-col items-center text-center gap-2">
              <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl mb-1">
                🎁
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ item.amount }}</div>
                <div class="text-xs text-orange-600 font-bold uppercase tracking-wider">Coins</div>
              </div>
              <div class="bg-orange-500 text-white px-6 py-1.5 rounded-full font-bold text-sm shadow-md shadow-orange-200 w-full mt-1 group-hover:bg-orange-600 transition-colors">
                {{ item.price }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Standard Packs Section -->
      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-4">Standard Packs</h2>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="item in standardItems" :key="item.id" 
               @click="initiatePurchase(item)"
               class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer flex flex-col items-center text-center gap-2 hover:border-blue-200">
            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl mb-1">
              💰
            </div>
            <div>
              <div class="text-xl font-bold text-gray-900">{{ item.amount }}</div>
              <div class="text-xs text-gray-400 font-medium uppercase">Coins</div>
            </div>
            <div class="text-blue-600 font-bold text-sm mt-1 bg-blue-50 px-4 py-1.5 rounded-lg w-full">
              {{ item.price }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Processing Modal -->
    <div v-if="processing" class="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center backdrop-blur-sm">
      <div class="bg-white rounded-2xl p-6 w-[80%] max-w-[300px] text-center shadow-2xl animate-bounce-in">
        <i class="ph-duotone ph-spinner-gap text-4xl text-blue-500 animate-spin mb-4 block mx-auto"></i>
        <h3 class="font-bold text-gray-900 text-lg">Processing...</h3>
        <p class="text-gray-500 text-sm mt-2">Connecting to App Store</p>
      </div>
    </div>

    <!-- Custom Alert -->
    <CustomAlert ref="alertRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { bridge, nativeEvents } from '../utils/bridge'
import CustomAlert from '../components/CustomAlert.vue'

const userStore = useUserStore()
const processing = ref(false)
const alertRef = ref(null)
const currentItem = ref(null)

// Raw data from requirement
const allItems = [
  // Standard Packs (00-18)
  { id: '52444700', type: 'standard', price: '$0.99', amount: 110 },
  { id: '52444701', type: 'standard', price: '$1.99', amount: 210 },
  { id: '52444702', type: 'standard', price: '$2.99', amount: 310 },
  { id: '52444703', type: 'standard', price: '$3.99', amount: 400 },
  { id: '52444704', type: 'standard', price: '$4.99', amount: 520 },
  { id: '52444705', type: 'standard', price: '$5.99', amount: 630 },
  { id: '52444706', type: 'standard', price: '$6.99', amount: 740 },
  { id: '52444707', type: 'standard', price: '$8.99', amount: 1000 },
  { id: '52444708', type: 'standard', price: '$9.99', amount: 1200 },
  { id: '52444709', type: 'standard', price: '$12.99', amount: 1600 },
  { id: '52444710', type: 'standard', price: '$15.99', amount: 2000 },
  { id: '52444711', type: 'standard', price: '$19.99', amount: 2600 },
  { id: '52444712', type: 'standard', price: '$24.99', amount: 3300 },
  { id: '52444713', type: 'standard', price: '$29.99', amount: 4200 },
  { id: '52444714', type: 'standard', price: '$34.99', amount: 4900 },
  { id: '52444715', type: 'standard', price: '$39.99', amount: 6000 },
  { id: '52444716', type: 'standard', price: '$49.99', amount: 8000 },
  { id: '52444717', type: 'standard', price: '$79.99', amount: 14000 },
  { id: '52444718', type: 'standard', price: '$99.99', amount: 14998 },
  
  // Promo Packs (19-26)
  { id: '52444719', type: 'promo', price: '$1.99', amount: 520 },
  { id: '52444720', type: 'promo', price: '$2.99', amount: 800 },
  { id: '52444721', type: 'promo', price: '$4.99', amount: 1300 },
  { id: '52444722', type: 'promo', price: '$5.99', amount: 1500 },
  { id: '52444723', type: 'promo', price: '$11.99', amount: 2700 },
  { id: '52444724', type: 'promo', price: '$12.99', amount: 2900 },
  { id: '52444725', type: 'promo', price: '$34.99', amount: 7200 },
  { id: '52444726', type: 'promo', price: '$79.99', amount: 17000 },
]

const standardItems = computed(() => allItems.filter(i => i.type === 'standard'))
const promoItems = computed(() => allItems.filter(i => i.type === 'promo'))

const initiatePurchase = (item) => {
  if (processing.value) return
  
  processing.value = true
  currentItem.value = item
  
  // Call Native Bridge
  bridge.callNative('Pay', item.id)
}

// Watch for native events
const unwatch = watch(() => nativeEvents.timestamp, () => {
  if (!nativeEvents.lastEvent) return
  
  const { name } = nativeEvents.lastEvent
  
  if (name === 'paySuccess') {
    // Keep processing = true and delay 2s
    if (currentItem.value) {
      userStore.addCoins(currentItem.value.amount)
      
      setTimeout(() => {
        processing.value = false
        alertRef.value?.show({
          title: 'Payment Successful',
          message: `You received ${currentItem.value.amount} Coins!`,
          type: 'success'
        })
        currentItem.value = null
      }, 2000)
    }
  } else if (name === 'payFailed') {
    processing.value = false
    alertRef.value?.show({
      title: 'Payment Failed',
      message: 'The transaction could not be completed.',
      type: 'error'
    })
    currentItem.value = null
  }
})

onUnmounted(() => {
  unwatch()
})
</script>

<style>
@keyframes bounce-in {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
</style>
