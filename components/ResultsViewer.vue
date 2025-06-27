<!-- components/ResultsViewer.vue -->
<template>
  <div class="flex flex-col h-full bg-gray-900 text-gray-100">
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <h3 class="text-lg font-semibold">Results</h3>
      <div class="flex items-center gap-2">
        <button
          @click="toggleViewMode"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
        >
          {{ viewMode === 'formatted' ? 'Raw' : 'Formatted' }}
        </button>
        <button
          v-if="result"
          @click="copyToClipboard"
          class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1"
        >
          <Icon name="lucide:copy" size="14" />
          Copy
        </button>
      </div>
    </div>
    
    <div class="flex-1 p-4 overflow-auto">
      <div v-if="loading" class="flex items-center justify-center h-32">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-if="error" class="bg-red-900 border border-red-700 text-red-100 p-4 rounded">
        <h4 class="font-semibold mb-2">Error</h4>
        <pre class="text-sm whitespace-pre-wrap">{{ error }}</pre>
      </div>
      
      <pre
        v-if="result && !loading"
        class="text-sm whitespace-pre-wrap bg-gray-800 p-4 rounded border border-gray-700 overflow-auto"
      >{{ formattedResult }}</pre>
      
      <div v-if="!result && !loading && !error" class="text-center text-gray-500 mt-8">
        <p>Run a query to see results here</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  result: Object,
  loading: Boolean,
  error: String
})

const viewMode = ref('formatted')

const formattedResult = computed(() => {
  if (!props.result) return ''
  return viewMode.value === 'formatted' 
    ? JSON.stringify(props.result, null, 2)
    : JSON.stringify(props.result)
})

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'formatted' ? 'raw' : 'formatted'
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(props.result, null, 2))
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>