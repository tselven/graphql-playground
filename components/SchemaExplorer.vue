<!-- components/SchemaExplorer.vue -->
<template>
  <div class="h-full bg-gray-50 border-l border-gray-200">
    <div class="p-4 border-b border-gray-200 bg-white">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Icon name="lucide:book" size="20" />
        Schema
      </h3>
    </div>
    
    <!-- Section Tabs -->
    <div class="flex border-b border-gray-200">
      <button
        v-for="section in ['types', 'queries', 'mutations']"
        :key="section"
        @click="activeSection = section"
        :class="[
          'px-4 py-2 text-sm font-medium capitalize',
          activeSection === section 
            ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        ]"
      >
        {{ section }}
      </button>
    </div>

    <div class="p-4 overflow-y-auto" style="max-height: calc(100vh - 200px)">
      <!-- Types Section -->
      <div v-if="activeSection === 'types'" class="space-y-3">
        <div
          v-for="type in schema.types"
          :key="type.name"
          class="border border-gray-200 rounded-lg"
        >
          <button
            @click="toggleType(type.name)"
            class="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 font-medium text-gray-900 rounded-t-lg"
          >
            {{ type.name }}
          </button>
          <div
            v-if="expandedTypes.has(type.name)"
            class="p-3 bg-white border-t border-gray-200"
          >
            <div
              v-for="field in type.fields"
              :key="field.name"
              class="mb-2 p-2 bg-gray-50 rounded"
            >
              <div class="flex justify-between items-start">
                <span class="font-mono text-sm text-blue-600">{{ field.name }}</span>
                <span class="font-mono text-xs text-gray-500">{{ field.type }}</span>
              </div>
              <p v-if="field.description" class="text-xs text-gray-600 mt-1">
                {{ field.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Queries Section -->
      <div v-if="activeSection === 'queries'" class="space-y-2">
        <div
          v-for="query in schema.queries"
          :key="query.name"
          class="p-3 bg-white border border-gray-200 rounded-lg"
        >
          <div class="flex justify-between items-start mb-1">
            <span class="font-mono text-sm text-green-600">{{ query.name }}</span>
            <span class="font-mono text-xs text-gray-500">{{ query.type }}</span>
          </div>
          <div v-if="query.args" class="text-xs text-gray-600 mb-1">
            Args: {{ query.args.map(arg => `${arg.name}: ${arg.type}`).join(', ') }}
          </div>
          <p v-if="query.description" class="text-xs text-gray-600">
            {{ query.description }}
          </p>
        </div>
      </div>

      <!-- Mutations Section -->
      <div v-if="activeSection === 'mutations'" class="space-y-2">
        <div
          v-for="mutation in schema.mutations"
          :key="mutation.name"
          class="p-3 bg-white border border-gray-200 rounded-lg"
        >
          <div class="flex justify-between items-start mb-1">
            <span class="font-mono text-sm text-orange-600">{{ mutation.name }}</span>
            <span class="font-mono text-xs text-gray-500">{{ mutation.type }}</span>
          </div>
          <div v-if="mutation.args" class="text-xs text-gray-600 mb-1">
            Args: {{ mutation.args.map(arg => `${arg.name}: ${arg.type}`).join(', ') }}
          </div>
          <p v-if="mutation.description" class="text-xs text-gray-600">
            {{ mutation.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  schema: Object
})

const activeSection = ref('types')
const expandedTypes = ref(new Set())

const toggleType = (typeName) => {
  if (expandedTypes.value.has(typeName)) {
    expandedTypes.value.delete(typeName)
  } else {
    expandedTypes.value.add(typeName)
  }
}
</script>