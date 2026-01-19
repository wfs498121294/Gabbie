<template>
  <div class="h-full w-full relative">
    <div id="map" class="h-full w-full z-0"></div>
    
    <!-- Map Controls Overlay -->
    <div class="absolute top-4 right-4 z-[400] flex flex-col gap-2">
      <!-- Layer Toggle -->
      <div class="relative group">
        <button @click="showLayers = !showLayers" class="bg-white p-3 rounded-xl shadow-md border border-gray-100 text-gray-600 active:bg-gray-50 pointer-events-auto">
          <i class="ph-bold ph-stack"></i>
        </button>
        
        <!-- Layer Menu -->
        <div v-if="showLayers" class="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[160px] flex flex-col gap-1 animate-fade-in">
            <button @click="setLayer('voyager')" 
                    :class="['flex items-center gap-3 p-2 rounded-lg text-sm font-medium w-full text-left', currentLayer === 'voyager' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50']">
                <i class="ph-fill ph-map-trifold"></i>
                <span>Standard</span>
            </button>
            
            <button @click="setLayer('satellite')" 
                    :class="['flex items-center gap-3 p-2 rounded-lg text-sm font-medium w-full text-left', currentLayer === 'satellite' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50']">
                <i class="ph-fill ph-globe"></i>
                <span>Satellite</span>
                <i v-if="!userStore.hasUnlocked('map_satellite')" class="ph-fill ph-lock-key text-xs text-orange-500 ml-auto"></i>
            </button>
        </div>
      </div>

      <!-- Locate Button -->
      <button @click="locateUser" class="bg-white p-3 rounded-xl shadow-md border border-gray-100 text-gray-600 active:bg-gray-50 pointer-events-auto">
        <i class="ph-bold ph-crosshair"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import { useTripStore } from '../stores/trips'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const tripStore = useTripStore()
const userStore = useUserStore()
const router = useRouter()

let map = null
let markers = []
let tileLayer = null

const showLayers = ref(false)
const currentLayer = ref('voyager')

const LAYERS = {
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
}

onMounted(() => {
  // Delay map init slightly to ensure container is ready
  setTimeout(() => {
    initMap()
  }, 100)
})

const initMap = () => {
  // Fix Leaflet icons
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });

  map = L.map('map', { 
    zoomControl: false,
    tap: false // Fix mobile click issues
  }).setView([20, 0], 2)
  
  // Handle Location Error
  map.on('locationerror', (e) => {
    alert('Location access denied or failed: ' + e.message)
  })
  
  // Initial Layer
  setLayer('voyager', true)

  renderMarkers()
  
  // Force resize to fix grey tiles
  setTimeout(() => {
    map.invalidateSize()
  }, 200)
}

const setLayer = (type, force = false) => {
    if (!force && type === currentLayer.value) return
    
    // Check unlock for satellite
    if (type === 'satellite' && !userStore.hasUnlocked('map_satellite')) {
        if (confirm('Unlock Satellite View for 50 Coins?')) {
            if (userStore.purchaseItem('map_satellite', 50)) {
                alert('Unlocked Satellite View!')
            } else {
                if (confirm('Insufficient coins! Go to Store?')) {
                    router.push('/store')
                }
                return
            }
        } else {
            return
        }
    }

    // Switch Layer
    if (tileLayer) map.removeLayer(tileLayer)
    
    tileLayer = L.tileLayer(LAYERS[type], {
        attribution: '&copy; OpenStreetMap, &copy; CartoDB, &copy; Esri',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map)
    
    currentLayer.value = type
    showLayers.value = false
}

const renderMarkers = () => {
  if (!map) return
  
  // Clear existing
  markers.forEach(m => map.removeLayer(m))
  markers = []

  tripStore.trips.forEach(trip => {
    if (trip.lat && trip.lng) {
      // Custom Marker
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const marker = L.marker([trip.lat, trip.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-center min-w-[120px]">
            <h3 class="font-bold text-gray-900 text-sm">${trip.location}</h3>
            <p class="text-xs text-gray-500 mt-1">${new Date(trip.date).toLocaleDateString()}</p>
          </div>
        `)
      
      markers.push(marker)
    }
  })
}

const locateUser = () => {
  map.locate({ setView: true, maxZoom: 10 })
}

// Watch for new trips
watch(() => tripStore.trips.length, renderMarkers)
</script>

<style>
.leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 0;
  overflow: hidden;
}
.leaflet-popup-content {
  margin: 12px;
}
/* Ensure map z-index is correct context */
.leaflet-pane { z-index: 400; }
.leaflet-bottom { z-index: 1000; }

@keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}
</style>
