<template>
  <component
    :is="icon"
    :class="className"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { DefineComponent } from 'vue'

interface Props {
  icon: DefineComponent
  className?: string
}

defineProps<Props>()
</script> 