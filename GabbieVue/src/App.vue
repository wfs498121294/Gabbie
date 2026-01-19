<template>
  <div class="h-screen w-full overflow-hidden bg-gray-50 flex flex-col">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- Global Custom Alert -->
    <CustomAlert ref="globalAlert" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CustomAlert from './components/CustomAlert.vue'

const globalAlert = ref(null)

onMounted(() => {
  // Override native alert
  window.alert = (message) => {
    if (globalAlert.value) {
      globalAlert.value.show({
        title: 'Alert',
        message: message,
        type: 'info'
      })
    } else {
      console.warn('CustomAlert not ready, fallback to console:', message)
    }
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
