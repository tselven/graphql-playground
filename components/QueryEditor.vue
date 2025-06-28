<!-- components/QueryEditor.vue -->
<template>
  <div class="flex flex-col h-full bg-gray-900 text-gray-100">
    <!-- Tabs -->
    <div class="flex border-b border-gray-700">
      <button @click="activeTab = 'query'" :class="[
        'px-4 py-2 text-sm font-medium',
        activeTab === 'query'
          ? 'bg-blue-600 text-white border-b-2 border-blue-400'
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      ]">
        Query
      </button>
      <button @click="activeTab = 'variables'" :class="[
        'px-4 py-2 text-sm font-medium',
        activeTab === 'variables'
          ? 'bg-blue-600 text-white border-b-2 border-blue-400'
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      ]">
        Variables
      </button>
      <button @click="toggleHeaders" :class="[
        'px-4 py-2 text-sm font-medium flex items-center gap-2',
        showHeaders
          ? 'bg-purple-600 text-white'
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      ]">
        <Icon :name="showHeaders ? 'lucide:eye-off' : 'lucide:eye'" size="16" />
        Headers
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <div v-if="showHeaders" class="p-4 border-b border-gray-700 bg-gray-800">
        <textarea :value="headers" @input="updateHeaders" placeholder='{"Authorization": "Bearer token"}'
          class="w-full h-20 bg-gray-900 text-gray-100 p-3 rounded border border-gray-600 focus:border-purple-500 focus:outline-none font-mono text-sm resize-none" />
      </div>

      <textarea v-if="activeTab === 'query'" :value="query" @input="updateQuery" placeholder="# Write your GraphQL query here
query {
  countries {
    code
    name
    continent {
      name
    }
  }
}"
 class="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none border-none"
        style="min-height: 300px" />

      <textarea v-else :value="variables" @input="updateVariables" placeholder='{"userId": "1"}'
        class="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none border-none"
        style="min-height: 300px" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  query: String,
  variables: String,
  headers: String
})

const emit = defineEmits(['update:query', 'update:variables', 'update:headers'])

const activeTab = ref('query')
const showHeaders = ref(false)

const updateQuery = (e) => {
  emit('update:query', e.target.value)
}

const updateVariables = (e) => {
  emit('update:variables', e.target.value)
}

const updateHeaders = (e) => {
  emit('update:headers', e.target.value)
}

const toggleHeaders = () => {
  showHeaders.value = !showHeaders.value
}
</script>