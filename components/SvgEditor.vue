<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Editor and Preview -->
    <div class="flex flex-1 min-h-0">
      <!-- Code Editor Section -->
      <div class="w-1/2 p-2 bg-gray-900 flex flex-col">
        <textarea
          v-model="svgCode"
          class="flex-1 w-full bg-gray-800 text-white font-mono p-4 resize-none"
          @input="updatePreview"
        ></textarea>
        
        <!-- Editor Controls (Moved from top) -->
        <div class="py-2 px-4 flex gap-4 bg-gray-800 mt-2 rounded">
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
      </div>
      
      <!-- Preview Section -->
      <div class="w-1/2 p-2 bg-white flex flex-col min-h-0">
        <!-- Tabs Navigation -->
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-2 border-b-2"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="flex-1 overflow-auto p-4">
          <!-- Preview Tab -->
          <div v-if="activeTab === 'preview'" class="flex flex-col h-full">
            <!-- Preview Container -->
            <div
              class="preview-container flex-1 flex items-center justify-center relative overflow-hidden mb-2"
              :class="[
                currentBackground === 'transparent' ? 'bg-checkered' : '',
                currentBackground === 'white' ? 'bg-white' : '',
                currentBackground === 'grey' ? 'bg-[#F7F8F9]' : '',
                currentBackground === 'black' ? 'bg-[#161B1D]' : ''
              ]"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="stopDrag"
              @mouseleave="stopDrag"
            >
              <div
                ref="svgWrapper"
                class="svg-wrapper"
                :style="{
                  transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center center',
                  cursor: isDragging ? 'grabbing' : 'grab'
                }"
                v-html="sanitizedSvg"
              ></div>
            </div>

            <!-- Preview Controls -->
            <div class="flex items-center gap-4 p-2 bg-gray-100 rounded">
              <!-- Zoom Controls -->
              <div class="flex items-center gap-2 border-r pr-4">
                <button
                  @click="decreaseZoom"
                  class="p-1 hover:bg-gray-200 rounded"
                  :disabled="zoom <= 25"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                
                <span class="min-w-[60px] text-center">{{ zoom }}%</span>
                
                <button
                  @click="increaseZoom"
                  class="p-1 hover:bg-gray-200 rounded"
                  :disabled="zoom >= 200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>

              <!-- Background Controls -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Background:</span>
                <div class="flex gap-1">
                  <button
                    v-for="bg in backgrounds"
                    :key="bg.id"
                    @click="currentBackground = bg.id"
                    :class="[
                      'w-8 h-8 rounded border',
                      currentBackground === bg.id ? 'ring-2 ring-blue-500' : '',
                      bg.id === 'transparent' ? 'bg-checkered' : ''
                    ]"
                    :style="bg.id !== 'transparent' ? { backgroundColor: bg.color } : {}"
                    :title="bg.name"
                  >
                    <svg
                      v-if="currentBackground === bg.id"
                      class="w-4 h-4 m-auto"
                      :class="bg.id === 'white' ? 'text-gray-800' : 'text-white'"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Download Button -->
              <button
                @click="downloadSvgFromPreview"
                class="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download SVG
              </button>
            </div>
          </div>

          <!-- React Tab -->
          <div v-else-if="activeTab === 'react'" class="h-full flex flex-col">
            <!-- Code Display -->
            <div class="flex-1 bg-gray-100 p-4 rounded overflow-hidden">
              <div class="relative h-full overflow-auto">
                <pre
                  class="code-block"
                  :class="{ 'prismjs-light': true }"
                ><div class="line-numbers">
                    <span v-for="n in reactComponentLines" :key="n" class="line-number">{{ n }}</span>
                  </div><code v-html="highlightedReactCode" class="language-jsx overflow-x-auto whitespace-pre-wrap"></code></pre>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 mt-4">
              <button
                @click="copyReactCode"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                </svg>
                Copy Code
              </button>

              <button
                @click="downloadReactCode"
                class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download JSX
              </button>
            </div>
          </div>

          <!-- React Native Tab -->
          <div v-else-if="activeTab === 'react-native'" class="h-full flex flex-col">
            <!-- Code Display -->
            <div class="flex-1 bg-gray-100 p-4 rounded overflow-hidden">
              <div class="relative h-full overflow-auto">
                <pre
                  class="code-block"
                  :class="{ 'prismjs-light': true }"
                ><div class="line-numbers">
                    <span v-for="n in reactNativeComponentLines" :key="n" class="line-number">{{ n }}</span>
                  </div><code v-html="highlightedReactNativeCode" class="language-jsx overflow-x-auto whitespace-pre-wrap"></code></pre>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 mt-4">
              <button
                @click="copyReactNativeCode"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                </svg>
                Copy Code
              </button>

              <button
                @click="downloadReactNativeCode"
                class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download JSX
              </button>
            </div>
          </div>

          <!-- PNG Tab -->
          <div v-else-if="activeTab === 'png'" class="h-full flex flex-col">
            <!-- PNG Preview -->
            <div class="flex-1 bg-gray-100 p-4 rounded flex items-center justify-center">
              <div class="relative w-full h-full flex items-center justify-center">
                <canvas 
                  ref="pngCanvas" 
                  class="border rounded bg-white shadow-sm"
                  :style="{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }"
                ></canvas>
              </div>
            </div>

            <!-- PNG Controls -->
            <div class="flex items-center gap-4 mt-4">
              <!-- Scale Selector -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Scale:</span>
                <select
                  v-model="pngScale"
                  class="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="updatePngPreview"
                >
                  <option v-for="scale in pngScales" :key="scale.value" :value="scale.value">
                    {{ scale.label }}
                  </option>
                </select>
              </div>

              <!-- Download Button -->
              <button
                @click="downloadPNG"
                class="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download PNG
              </button>
            </div>
          </div>

          <!-- Data URI Tab -->
          <div v-else-if="activeTab === 'data-uri'" class="h-full">
            <pre class="bg-gray-100 p-4 rounded overflow-auto h-full"><code>{{ dataUri }}</code></pre>
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
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-jsx'

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
// const reactComponent = computed(() => {
//   const componentName = 'SvgIcon'
//   return `import React from 'react';

// const ${componentName} = (props) => {
//   return (
//     ${svgCode.value.replace(/<svg/, '<svg {...props}')}
//   );
// };

// export default ${componentName};`
// })

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

// PNG scale options
const pngScales = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
  { label: '4x', value: 4 }
]
const pngScale = ref(1)

// Update PNG preview function
const updatePngPreview = () => {
  if (!pngCanvas.value) return

  const canvas = pngCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.onload = () => {
    // Set canvas size based on scale
    canvas.width = img.width * pngScale.value
    canvas.height = img.height * pngScale.value

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Enable smooth scaling
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Draw scaled image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
  img.src = 'data:image/svg+xml;base64,' + btoa(svgCode.value)
}

// Update PNG when scale changes
watch(pngScale, updatePngPreview)

// Download PNG with current scale
const downloadPNG = () => {
  if (!pngCanvas.value) return
  
  const link = document.createElement('a')
  link.download = `image@${pngScale.value}x.png`
  link.href = pngCanvas.value.toDataURL('image/png')
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

// Preview controls state
const zoom = ref(100)
const backgrounds = [
  { id: 'transparent', name: 'Transparent', color: 'transparent' },
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'grey', name: 'Grey', color: '#F7F8F9' },
  { id: 'black', name: 'Black', color: '#161B1D' }
]
const currentBackground = ref('transparent')

// Zoom controls
const increaseZoom = () => {
  if (zoom.value < 200) {
    zoom.value += 25
  }
}

const decreaseZoom = () => {
  if (zoom.value > 25) {
    zoom.value -= 25
  }
}

// Download function specifically for preview
const downloadSvgFromPreview = () => {
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

// Add these new refs for drag functionality
const isDragging = ref(false)
const position = ref({ x: 0, y: 0 })
const dragStart = ref({ x: 0, y: 0 })
const svgWrapper = ref<HTMLElement | null>(null)

// Drag functionality
const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  }
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  position.value = {
    x: event.clientX - dragStart.value.x,
    y: event.clientY - dragStart.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
}

// Reset position when zoom changes
watch(zoom, () => {
  position.value = { x: 0, y: 0 }
})

// React code formatting
const formatReactCode = (code: string) => {
  return `import React from 'react';

const SvgIcon = (props) => {
  return (
    ${code.replace(/<svg/, '<svg {...props}')}
  );
};

export default SvgIcon;`
}

const reactComponent = computed(() => formatReactCode(svgCode.value))

const highlightedReactCode = computed(() => {
  return Prism.highlight(
    reactComponent.value,
    Prism.languages.jsx,
    'jsx'
  )
})

const reactComponentLines = computed(() => {
  return reactComponent.value.split('\n').length
})

// React tab actions
const copyReactCode = async () => {
  try {
    await navigator.clipboard.writeText(reactComponent.value)
    alert('React component code copied to clipboard!')
  } catch (err) {
    alert('Failed to copy code')
  }
}

const downloadReactCode = () => {
  const blob = new Blob([reactComponent.value], { type: 'text/jsx' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'SvgIcon.jsx'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// React Native code formatting and computeds
const highlightedReactNativeCode = computed(() => {
  return Prism.highlight(
    reactNativeComponent.value,
    Prism.languages.jsx,
    'jsx'
  )
})

const reactNativeComponentLines = computed(() => {
  return reactNativeComponent.value.split('\n').length
})

// React Native tab actions
const copyReactNativeCode = async () => {
  try {
    await navigator.clipboard.writeText(reactNativeComponent.value)
    alert('React Native component code copied to clipboard!')
  } catch (err) {
    alert('Failed to copy code')
  }
}

const downloadReactNativeCode = () => {
  const blob = new Blob([reactNativeComponent.value], { type: 'text/jsx' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'SvgIcon.native.jsx'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Initialize Prism
onMounted(() => {
  Prism.highlightAll()
})
</script>

<style scoped>
.bg-checkered {
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.svg-wrapper {
  transition: transform 0.2s ease;
  user-select: none; /* Prevent text selection while dragging */
}

.preview-container {
  transition: background-color 0.2s ease;
}

/* Ensure SVG maintains aspect ratio */
.svg-wrapper :deep(svg) {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  pointer-events: none; /* Prevent SVG from interfering with drag */
}

pre {
  margin: 0;
}

textarea {
  height: 100% !important;
  min-height: 0; /* Prevents textarea from growing beyond container */
}

/* Code block styling */
.code-block {
  display: flex;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #f8f9fa;
  border-radius: 4px;
  position: relative;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
  border-right: 1px solid #e2e8f0;
  background: #edf2f7;
  user-select: none;
  text-align: right;
  color: #718096;
}

.line-number {
  padding: 0 0.5rem;
  min-width: 2.5rem;
}

.code-block code {
  flex: 1;
  padding: 1rem;
  overflow-x: visible;
}

/* Prism theme overrides */
:deep(.token.keyword) {
  color: #d73a49;
}

:deep(.token.function) {
  color: #6f42c1;
}

:deep(.token.string) {
  color: #22863a;
}

:deep(.token.comment) {
  color: #6a737d;
}

:deep(.token.punctuation) {
  color: #24292e;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style> 