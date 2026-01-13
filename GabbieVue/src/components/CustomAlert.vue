<template>
  <div v-if="visible" class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
    <div class="bg-white rounded-2xl w-[85%] max-w-xs shadow-2xl overflow-hidden animate-scale-in">
      
      <!-- Icon/Header -->
      <div :class="['p-6 flex justify-center', headerClass]">
        <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl text-white backdrop-blur-sm">
          <i :class="iconClass"></i>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-gray-600 text-sm leading-relaxed">{{ message }}</p>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-100 p-4">
        <button @click="close" :class="['w-full py-3 rounded-xl font-bold text-sm transition-transform active:scale-95', btnClass]">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const visible = ref(false)
const title = ref('')
const message = ref('')
const type = ref('info') // success, error, info
const resolvePromise = ref(null)

const show = (opts) => {
  title.value = opts.title || 'Notification'
  message.value = opts.message || ''
  type.value = opts.type || 'info'
  visible.value = true
  
  return new Promise((resolve) => {
    resolvePromise.value = resolve
  })
}

const close = () => {
  visible.value = false
  if (resolvePromise.value) {
    resolvePromise.value()
    resolvePromise.value = null
  }
}

const headerClass = computed(() => {
  const map = {
    success: 'bg-gradient-to-br from-green-400 to-emerald-600',
    error: 'bg-gradient-to-br from-red-400 to-rose-600',
    info: 'bg-gradient-to-br from-blue-400 to-indigo-600'
  }
  return map[type.value]
})

const iconClass = computed(() => {
  const map = {
    success: 'ph-bold ph-check',
    error: 'ph-bold ph-warning',
    info: 'ph-bold ph-info'
  }
  return map[type.value]
})

const btnClass = computed(() => {
  const map = {
    success: 'bg-green-50 text-green-600 hover:bg-green-100',
    error: 'bg-red-50 text-red-600 hover:bg-red-100',
    info: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
  }
  return map[type.value]
})

const buttonText = computed(() => {
  return type.value === 'error' ? 'Try Again' : 'Got it'
})

defineExpose({ show })
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

@keyframes scale-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
