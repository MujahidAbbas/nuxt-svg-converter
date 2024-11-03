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
      <div class="w-1/2 p-4 bg-white flex flex-col">
        <!-- Export Options Tabs -->
        <div class="mb-4 border-b border-gray-200">
          <nav class="flex space-x-4" aria-label="Export options">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-t-lg',
                activeTab === tab.id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Preview Content -->
        <div class="flex-1">
          <!-- SVG Preview -->
          <div v-if="activeTab === 'preview'" class="preview-container h-full flex items-center justify-center" v-html="sanitizedSvg"></div>

          <!-- React Component -->
          <div v-else-if="activeTab === 'react'" class="h-full">
            <pre class="bg-gray-100 p-4 rounded h-full overflow-auto"><code>{{ reactComponent }}</code></pre>
          </div>

          <!-- React Native Component -->
          <div v-else-if="activeTab === 'react-native'" class="h-full">
            <pre class="bg-gray-100 p-4 rounded h-full overflow-auto"><code>{{ reactNativeComponent }}</code></pre>
          </div>

          <!-- PNG Preview -->
          <div v-else-if="activeTab === 'png'" class="h-full flex flex-col items-center justify-center gap-4">
            <canvas ref="pngCanvas" class="border border-gray-200"></canvas>
            <button
              @click="downloadPNG"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download PNG
            </button>
          </div>

          <!-- Data URI -->
          <div v-else-if="activeTab === 'data-uri'" class="h-full">
            <pre class="bg-gray-100 p-4 rounded h-full overflow-auto"><code>{{ dataUri }}</code></pre>
          </div>
        </div>
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
import { ref, computed, watch, onMounted } from 'vue'
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

const tabs = [
  { id: 'preview', name: 'Preview' },
  { id: 'react', name: 'React' },
  { id: 'react-native', name: 'React Native' },
  { id: 'png', name: 'PNG' },
  { id: 'data-uri', name: 'Data URI' }
]

const activeTab = ref('preview')
const pngCanvas = ref<HTMLCanvasElement | null>(null)

// React Component Export
const reactComponent = computed(() => {
  const componentName = 'SvgIcon'
  return `import React from 'react';

const ${componentName} = (props) => {
  return (
    ${svgCode.value.replace(/<svg/, '<svg {...props}')}
  );
};

export default ${componentName};`
})

// React Native Component Export
const reactNativeComponent = computed(() => {
  const componentName = 'SvgIcon'
  return `import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const ${componentName} = (props) => {
  return (
    ${convertToReactNativeSvg(svgCode.value)}
  );
};

export default ${componentName};`
})

// Data URI Export
const dataUri = computed(() => {
  const encoded = encodeURIComponent(svgCode.value)
  return `data:image/svg+xml,${encoded}`
})

// Convert SVG to React Native compatible format
const convertToReactNativeSvg = (svg: string) => {
  return svg
    .replace(/<svg/, '<Svg')
    .replace(/<\/svg>/, '</Svg>')
    .replace(/<path/g, '<Path')
    .replace(/<circle/g, '<Circle')
    .replace(/<rect/g, '<Rect')
    // Add more element conversions as needed
}

// PNG Export
const updatePngPreview = () => {
  if (!pngCanvas.value) return

  const canvas = pngCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
  }
  img.src = 'data:image/svg+xml;base64,' + btoa(svgCode.value)
}

const downloadPNG = () => {
  if (!pngCanvas.value) return
  
  const link = document.createElement('a')
  link.download = 'image.png'
  link.href = pngCanvas.value.toDataURL()
  link.click()
}

// Watch for SVG changes to update PNG preview
watch(svgCode, updatePngPreview)

// Update PNG preview on mount
onMounted(updatePngPreview)

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