<!-- components/Toolbar.vue -->
<template>
  <div class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
    <div class="flex items-center gap-2">
      <button
        @click="$emit('execute')"
        :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded font-medium"
      >
        <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <Icon v-else name="lucide:play" size="16" />
        Execute
      </button>
      
      <button
        @click="$emit('clear')"
        class="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
      >
        <Icon name="lucide:trash-2" size="16" />
        Clear
      </button>
    </div>
    
    <div class="flex items-center gap-2">
      <button
        @click="$emit('save')"
        class="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        <Icon name="lucide:save" size="16" />
        Save
      </button>
      
      <button
        @click="$emit('load')"
        class="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
      >
        <Icon name="lucide:folder-open" size="16" />
        Load
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean
})

defineEmits(['execute', 'clear', 'save', 'load'])
</script>