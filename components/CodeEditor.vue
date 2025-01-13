<template>
  <div class="relative h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
    <!-- Status Bar -->
    <div class="flex justify-between items-center p-2 bg-[#252526] border-b border-[#333]">
      <!-- Line:Column Position -->
      <div class="text-sm text-gray-400">
        Line {{ cursorPosition.line }}:{{ cursorPosition.column }}
      </div>
      
      <!-- Clear Button -->
      <Button 
        variant="ghost" 
        size="sm"
        @click="clearContent"
        class="text-gray-300 hover:text-white hover:bg-[#333]"
      >
        <TrashIcon class="h-4 w-4 mr-1" />
        Clear
      </Button>
    </div>

    <!-- Editor Area -->
    <div class="relative flex flex-1 overflow-hidden">
      <!-- Line Numbers -->
      <div 
        class="select-none py-4 px-2 text-right text-sm bg-[#1e1e1e] border-r border-[#333]"
        style="min-width: 3.5rem"
      >
        <div 
          v-for="n in lineCount" 
          :key="n"
          class="leading-6 text-gray-500"
        >
          {{ n }}
        </div>
      </div>

      <!-- Code Area with Prism Highlighting -->
      <div class="relative flex-1 overflow-auto">
        <textarea
          ref="editor"
          v-model="content"
          class="editor-textarea absolute inset-0 p-4 font-mono text-sm bg-transparent outline-none resize-none leading-6 text-transparent caret-white"
          @input="updateContent"
          @keydown="handleKeydown"
          @click="updateCursorPosition"
          @keyup="updateCursorPosition"
          @scroll="syncScroll"
          spellcheck="false"
        ></textarea>
        <pre
          ref="highlight"
          class="p-4 font-mono text-sm leading-6 pointer-events-none"
          :class="{ 'prism-editor-highlight': true }"
          aria-hidden="true"
        ><code class="language-markup" v-html="highlightedCode"></code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import Button from '@/components/ui/Button.vue'
import { TrashIcon } from '@heroicons/vue/24/outline/index.js'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-markup'

const props = defineProps<{
  modelValue: string
}>()

const content = ref(props.modelValue)
const editor = ref<HTMLTextAreaElement | null>(null)
const highlight = ref<HTMLPreElement | null>(null)
const lineCount = ref(1)
const cursorPosition = ref({ line: 1, column: 1 })

const emit = defineEmits(['update:modelValue'])

// Highlight code using Prism
const highlightedCode = computed(() => {
  return Prism.highlight(
    content.value,
    Prism.languages.markup,
    'markup'
  )
})

// Sync scroll between textarea and highlighted code
const syncScroll = (e: Event) => {
  if (!highlight.value || !editor.value) return
  highlight.value.scrollTop = (e.target as HTMLTextAreaElement).scrollTop
  highlight.value.scrollLeft = (e.target as HTMLTextAreaElement).scrollLeft
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
    updateLineCount()
  }
})

const updateContent = () => {
  emit('update:modelValue', content.value)
  updateLineCount()
}

onMounted(() => {
  updateLineCount()
})

// Update line count when content changes
const updateLineCount = () => {
  lineCount.value = content.value.split('\n').length
}

// Clear editor content
const clearContent = () => {
  content.value = ''
  updateLineCount()
  updateCursorPosition()
}

// Handle tab key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    const start = editor.value!.selectionStart
    const end = editor.value!.selectionEnd

    // Insert 2 spaces for tab
    content.value = content.value.substring(0, start) + '  ' + content.value.substring(end)
    
    // Move cursor after the inserted tab
    nextTick(() => {
      editor.value!.selectionStart = editor.value!.selectionEnd = start + 2
    })
  }
}

// Update cursor position
const updateCursorPosition = () => {
  if (!editor.value) return

  const cursorIndex = editor.value.selectionStart
  const textBeforeCursor = content.value.substring(0, cursorIndex)
  const lines = textBeforeCursor.split('\n')
  
  cursorPosition.value = {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  }
}
</script>

<style scoped>
.editor-textarea {
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}

pre, code {
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
}

.prism-editor-highlight {
  background: transparent;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  color: #d4d4d4;
  padding: 1rem;
}

/* Scrollbar styling */
.editor-textarea {
  scrollbar-width: thin;
  scrollbar-color: #404040 #1e1e1e;
}

.editor-textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.editor-textarea::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.editor-textarea::-webkit-scrollbar-thumb {
  background-color: #404040;
  border-radius: 4px;
}

/* VS Code-like syntax highlighting */
:deep(.token.tag) {
  color: #569CD6;
}

:deep(.token.attr-name) {
  color: #9CDCFE;
}

:deep(.token.attr-value) {
  color: #CE9178;
}

:deep(.token.string) {
  color: #CE9178;
}

:deep(.token.punctuation) {
  color: #808080;
}

:deep(.token.comment) {
  color: #6A9955;
}

:deep(.token.doctype) {
  color: #808080;
}

:deep(.token.entity) {
  color: #569CD6;
}
</style>
