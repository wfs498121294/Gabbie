<template>
  <div class="p-4">
    <div v-if="tripStore.trips.length === 0" class="text-center py-20">
      <p class="text-gray-400">No memoirs yet. Create a journal entry to see it here.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div v-for="trip in tripStore.trips" :key="trip.id" class="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-100 border border-gray-100 relative group">
        <!-- Cover Image -->
        <div class="h-48 bg-gray-100 relative">
          <img v-if="trip.images?.length" :src="trip.images[0]" class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <i class="ph-duotone ph-map-pin text-4xl text-blue-300 mb-2"></i>
            <span class="text-blue-300 font-bold text-lg uppercase tracking-widest">{{ trip.location }}</span>
          </div>
          
          <!-- Date Badge -->
          <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">
            {{ new Date(trip.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }}
          </div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <div class="flex items-center gap-2 mb-3">
            <i class="ph-fill ph-airplane-tilt text-blue-500"></i>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ trip.transport }} Journey</span>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ trip.location }}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">{{ trip.memories }}</p>
          
          <!-- Footer -->
          <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
            <div class="flex -space-x-2">
               <!-- Fake avatars for companions -->
               <div v-if="trip.people" class="w-6 h-6 rounded-full bg-yellow-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-yellow-700">
                 {{ trip.people[0] }}
               </div>
            </div>
            <!-- Share button removed as per request -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTripStore } from '../stores/trips'
const tripStore = useTripStore()
</script>
