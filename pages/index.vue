<template>
  <div>
    <header class="border-b bg-card/50">
      <div class="container mx-auto px-4 py-3">
        <h1 class="text-xl font-semibold">SVG Editor</h1>
      </div>
    </header>
    
    <main>
      <SvgEditor />
    </main>
  </div>
</template>

<script setup lang="ts">
import SvgEditor from '@/components/SvgEditor.vue'
</script>