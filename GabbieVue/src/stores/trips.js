import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTripStore = defineStore('trips', () => {
  const trips = ref(JSON.parse(localStorage.getItem('gabbie_trips')) || [])

  const totalMiles = computed(() => trips.value.length * 1240) // Mock miles calculation
  const totalCountries = computed(() => new Set(trips.value.map(t => t.country || 'Unknown')).size)

  function addTrip(trip) {
    trips.value.unshift({
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...trip
    })
    save()
  }

  function deleteTrip(id) {
    trips.value = trips.value.filter(t => t.id !== id)
    save()
  }

  function save() {
    localStorage.setItem('gabbie_trips', JSON.stringify(trips.value))
  }

  return { trips, addTrip, deleteTrip, totalMiles, totalCountries }
})
