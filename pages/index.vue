<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <header class="border-b bg-card/50 flex-none">
      <div class="container mx-auto px-4 py-3">
        <h1 class="text-xl font-semibold">SVG Editor</h1>
      </div>
    </header>
    
    <main class="flex-1 overflow-hidden">
      <SvgEditor />
    </main>
  </div>
</template>

<script setup lang="ts">
import SvgEditor from '@/components/SvgEditor.vue'
</script>
