<template>
  <div class="flex h-screen">
    <!-- Code Editor Section -->
    <div class="w-1/2 p-4 bg-gray-900">
      <textarea
        v-model="svgCode"
        class="w-full h-full bg-gray-800 text-white font-mono p-4 resize-none"
        @input="updatePreview"
      ></textarea>
    </div>
    
    <!-- Preview Section -->
    <div class="w-1/2 p-4 bg-white">
      <div class="preview-container h-full flex items-center justify-center" v-html="sanitizedSvg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DOMPurify from 'dompurify'

const svgCode = ref(`<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`)

const sanitizedSvg = computed(() => {
  return DOMPurify.sanitize(svgCode.value, {
    USE_PROFILES: { svg: true, svgFilters: true }
  })
})

const updatePreview = () => {
  // Additional validation or processing can be added here
}
</script>

<style scoped>
.preview-container {
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style> 