<template>
  <div class="p-4 space-y-6">
    <!-- User Header -->
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Gabbie" alt="Avatar" class="w-full h-full object-cover">
      </div>
      <div>
        <h2 class="text-xl font-bold text-gray-900">Hello, Traveler</h2>
        <p class="text-sm text-gray-500">Ready for your next adventure?</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-2 mb-2 text-blue-500">
          <i class="ph-fill ph-airplane-tilt text-xl"></i>
          <span class="text-xs font-bold uppercase tracking-wider">Miles</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ tripStore.totalMiles }}</div>
      </div>
      
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-2 mb-2 text-purple-500">
          <i class="ph-fill ph-flag text-xl"></i>
          <span class="text-xs font-bold uppercase tracking-wider">Countries</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ tripStore.totalCountries }}</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-green-500">
            <i class="ph-fill ph-notebook text-xl"></i>
            <span class="text-xs font-bold uppercase tracking-wider">Total Logs</span>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ tripStore.trips.length }}</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-gray-900">Recent Activity</h3>
        <router-link to="/journal" class="text-sm text-blue-600 font-medium">View All</router-link>
      </div>
      
      <div v-if="tripStore.trips.length === 0" class="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
        <div class="text-4xl mb-2">🌍</div>
        <p class="text-gray-500 text-sm">No trips recorded yet.</p>
        <router-link to="/journal" class="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200">
          Start First Log
        </router-link>
      </div>

      <div v-else class="space-y-3">
        <div v-for="trip in recentTrips" :key="trip.id" class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            <img v-if="trip.images?.length" :src="trip.images[0]" class="w-full h-full object-cover">
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <i class="ph-fill ph-map-pin"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h4 class="font-bold text-gray-900 truncate">{{ trip.location }}</h4>
              <span class="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{{ new Date(trip.date).toLocaleDateString() }}</span>
            </div>
            <p class="text-xs text-gray-500 line-clamp-1 mt-0.5">{{ trip.memories }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTripStore } from '../stores/trips'

const tripStore = useTripStore()
const recentTrips = computed(() => tripStore.trips.slice(0, 3))
</script>
