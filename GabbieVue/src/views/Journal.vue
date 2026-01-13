<template>
  <div class="relative h-full">
    <!-- List View -->
    <div class="p-4 pb-20">
      <div v-if="tripStore.trips.length === 0" class="flex flex-col items-center justify-center h-[60vh] text-center">
        <div class="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <i class="ph-duotone ph-notebook text-6xl text-blue-400"></i>
        </div>
        <h2 class="text-xl font-bold text-gray-900">Your Journal is Empty</h2>
        <p class="text-gray-500 mt-2 max-w-[200px]">Start documenting your journey to fill this space with memories.</p>
        <button @click="showCreate = true" class="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform">
          Write First Entry
        </button>
      </div>

      <div v-else class="space-y-4">
        <div v-for="trip in tripStore.trips" :key="trip.id" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <!-- Header -->
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-lg text-gray-900">{{ trip.location }}</h3>
              <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span class="bg-gray-100 px-2 py-0.5 rounded-md">{{ new Date(trip.date).toLocaleDateString() }}</span>
                <span v-if="trip.people">• With {{ trip.people }}</span>
              </div>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <i :class="getTransportIcon(trip.transport)"></i>
            </div>
          </div>

          <!-- Content -->
          <p class="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">{{ trip.memories }}</p>

          <!-- Images -->
          <div v-if="trip.images?.length" class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <img v-for="(img, idx) in trip.images" :key="idx" :src="img" class="h-24 w-24 object-cover rounded-lg flex-shrink-0 border border-gray-100">
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button v-if="!showCreate && tripStore.trips.length > 0" 
            @click="showCreate = true"
            class="fixed bottom-[100px] right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-40 active:scale-90 transition-transform">
      <i class="ph-bold ph-plus text-2xl"></i>
    </button>

    <!-- Create Modal -->
    <div v-if="showCreate" class="fixed inset-0 z-50 bg-white flex flex-col animate-slide-up">
      <!-- Modal Header -->
      <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button @click="showCreate = false" class="text-gray-500 font-medium">Cancel</button>
        <h2 class="font-bold text-gray-900">New Entry</h2>
        <button @click="saveTrip" :disabled="saving" class="text-blue-600 font-bold disabled:opacity-50">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>

      <!-- Form -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="space-y-6">
          <!-- Cost Notice (Enhanced) -->
          <div class="bg-blue-50 p-4 rounded-xl flex items-center justify-between shadow-sm border border-blue-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                 <i class="ph-fill ph-coins text-xl"></i>
              </div>
              <div>
                 <div class="text-xs text-blue-500 font-bold uppercase tracking-wide">Creation Cost</div>
                 <div class="text-gray-900 font-bold">20 Coins</div>
              </div>
            </div>
            <div class="text-right">
                <div class="text-xs text-gray-400 font-medium">Your Balance</div>
                <div :class="['font-bold', userStore.balance < 20 ? 'text-red-500' : 'text-gray-900']">{{ userStore.balance }}</div>
            </div>
          </div>

          <!-- Date & Location -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">When & Where</label>
              <div class="flex gap-3">
                <input type="date" v-model="form.date" class="bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-900 w-1/3 focus:ring-2 focus:ring-blue-500">
                <div class="flex-1 relative">
                  <input type="text" v-model="form.location" placeholder="Location name" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 pr-10">
                  <button @click="searchLocation" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                    <i :class="searching ? 'ph ph-spinner animate-spin' : 'ph-fill ph-map-pin'"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Transport -->
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Transport</label>
              <div class="grid grid-cols-4 gap-2">
                <div v-for="t in transports" :key="t.val" 
                     @click="form.transport = t.val"
                     :class="['flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer', 
                              form.transport === t.val ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-400']">
                  <i :class="[t.icon, 'text-2xl mb-1']"></i>
                  <span class="text-[10px] font-bold">{{ t.val }}</span>
                </div>
              </div>
            </div>

            <!-- Companions -->
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Companions</label>
              <input type="text" v-model="form.people" placeholder="Who are you with?" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Memories -->
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Memories</label>
              <textarea v-model="form.memories" rows="4" placeholder="Write about your experience..." class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </div>

            <!-- Photos -->
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Photos</label>
              
              <div v-if="permissionDenied" class="bg-red-50 p-3 rounded-lg mb-3 flex items-center gap-2 text-xs text-red-600">
                 <i class="ph-bold ph-warning"></i>
                 <span>Camera access denied. Check device settings.</span>
              </div>

              <div class="flex gap-3 overflow-x-auto pb-2">
                <div v-for="(img, idx) in form.images" :key="idx" class="relative w-24 h-24 flex-shrink-0">
                  <img :src="img" class="w-full h-full object-cover rounded-xl border border-gray-200">
                  <button @click="removeImage(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                    <i class="ph-bold ph-x text-xs"></i>
                  </button>
                </div>
                
                <!-- Native Camera Input -->
                <label class="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 flex-shrink-0 active:scale-95 transition-transform" @click="checkCameraPermission">
                  <i class="ph-bold ph-camera text-2xl mb-1"></i>
                  <span class="text-[10px] font-bold">Camera</span>
                  <input type="file" accept="image/*" capture="environment" class="hidden" @change="handleImageUpload">
                </label>

                <!-- Native Gallery Input -->
                <label class="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 flex-shrink-0 active:scale-95 transition-transform">
                  <i class="ph-bold ph-image text-2xl mb-1"></i>
                  <span class="text-[10px] font-bold">Gallery</span>
                  <input type="file" accept="image/*" class="hidden" @change="handleImageUpload">
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useTripStore } from '../stores/trips'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const tripStore = useTripStore()
const userStore = useUserStore()
const router = useRouter()

const showCreate = ref(false)
const searching = ref(false)
const saving = ref(false)
const permissionDenied = ref(false)

const transports = [
  { val: 'Flight', icon: 'ph-fill ph-airplane-tilt' },
  { val: 'Train', icon: 'ph-fill ph-train' },
  { val: 'Car', icon: 'ph-fill ph-car' },
  { val: 'Ship', icon: 'ph-fill ph-boat' }
]

const form = reactive({
  date: new Date().toISOString().split('T')[0],
  transport: 'Flight',
  people: '',
  location: '',
  memories: '',
  images: [],
  lat: null,
  lng: null
})

const getTransportIcon = (type) => {
  const map = { 'Flight': 'ph-fill ph-airplane-tilt', 'Train': 'ph-fill ph-train', 'Car': 'ph-fill ph-car', 'Ship': 'ph-fill ph-boat' }
  return map[type] || 'ph-fill ph-map-pin'
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => form.images.push(e.target.result)
  reader.readAsDataURL(file)
}

const checkCameraPermission = async () => {
    try {
        await navigator.mediaDevices.getUserMedia({ video: true })
        permissionDenied.value = false
    } catch (err) {
        console.log('Camera permission check failed', err)
    }
}

const removeImage = (idx) => form.images.splice(idx, 1)

const searchLocation = async () => {
  if (!form.location) return alert('Enter a location first')
  searching.value = true
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.location)}`)
    const data = await res.json()
    if (data?.[0]) {
      form.lat = data[0].lat
      form.lng = data[0].lon
      form.location = data[0].display_name.split(',')[0] // Clean up name
      alert('Location Found!')
    } else {
      alert('Location not found')
    }
  } catch (e) {
    alert('Network Error')
  } finally {
    searching.value = false
  }
}

const saveTrip = async () => {
  if (!form.location) return alert('Location is required')
  
  if (userStore.balance < 20) {
    if (confirm('Insufficient Coins! Need 20 coins. Go to Store?')) {
      router.push('/store')
    }
    return
  }
  
  // Confirmation before spending
  if (!confirm('Publishing this entry will cost 20 Coins. Continue?')) return

  saving.value = true
  
  // Auto locate if missing
  if (!form.lat) await searchLocation()
  
  if (userStore.spendCoins(20)) {
    tripStore.addTrip({ ...form })
    showCreate.value = false
    // Reset form
    form.location = ''
    form.memories = ''
    form.people = ''
    form.images = []
    form.lat = null
    alert('Entry Saved! (-20 Coins)')
  }
  
  saving.value = false
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
