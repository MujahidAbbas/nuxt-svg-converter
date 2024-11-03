<template>
  <div class="flex flex-col h-screen">
    <!-- Toolbar -->
    <div class="bg-gray-800 p-4 flex gap-4">
      <button
        @click="triggerFileInput"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        Upload SVG
      </button>

      <button
        @click="copySvgCode"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
        </svg>
        Copy Code
      </button>

      <button
        @click="downloadSvg"
        class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Download SVG
      </button>
    </div>

    <!-- Editor and Preview -->
    <div class="flex flex-1">
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

    <!-- Hidden file input -->
    <input
      type="file"
      ref="fileInput"
      accept=".svg"
      class="hidden"
      @change="handleFileUpload"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DOMPurify from 'dompurify'
import { validateSvg } from '~/utils/svg-utils'

const fileInput = ref<HTMLInputElement | null>(null)
const svgCode = ref(`<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`)

const sanitizedSvg = computed(() => {
  return DOMPurify.sanitize(svgCode.value, {
    USE_PROFILES: { svg: true, svgFilters: true }
  })
})

// Upload functionality
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    const content = e.target?.result as string
    if (validateSvg(content)) {
      svgCode.value = content
    } else {
      alert('Invalid SVG file')
    }
  }

  reader.readAsText(file)
  // Reset input
  input.value = ''
}

// Copy functionality
const copySvgCode = async () => {
  try {
    await navigator.clipboard.writeText(svgCode.value)
    alert('SVG code copied to clipboard!')
  } catch (err) {
    alert('Failed to copy SVG code')
  }
}

// Download functionality
const downloadSvg = () => {
  const blob = new Blob([svgCode.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'image.svg'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const updatePreview = () => {
  // Additional validation or processing can be added here
  if (!validateSvg(svgCode.value)) {
    console.warn('Invalid SVG code')
  }
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