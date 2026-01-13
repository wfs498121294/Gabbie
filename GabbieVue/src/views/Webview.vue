<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Webview Header -->
    <!-- Note: This header is only shown if not wrapped by MainLayout, 
         but since we are using MainLayout, the layout's header will handle navigation.
         However, for a pure fullscreen webview experience, we might want to hide the MainLayout header/tabbar.
         The layout logic already hides tabbar for secondary pages.
         The layout header handles title and back button automatically.
    -->
    
    <!-- Iframe Container -->
    <div class="flex-1 relative w-full h-full overflow-hidden">
      <iframe 
        v-if="url"
        :src="url" 
        class="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms"
        @load="loading = false"
      ></iframe>
      
      <!-- Loading State -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-50">
        <i class="ph-duotone ph-spinner-gap text-3xl text-gray-400 animate-spin"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const url = ref('')
const loading = ref(true)

onMounted(() => {
  // Decode URL from query param to handle special characters
  if (route.query.url) {
    url.value = decodeURIComponent(route.query.url)
  }
})
</script>
