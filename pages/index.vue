<!-- pages/index.vue -->
<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <div class="bg-gray-900 text-white p-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">GraphQL Playground</h1>
        <div class="flex items-center gap-4">
          <input v-model="endpoint" type="text" placeholder="GraphQL endpoint"
            class="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-sm" />
          <button @click="toggleSchema"
            class="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
            <Icon name="lucide:book" size="16" />
            {{ showSchema ? 'Hide' : 'Show' }} Schema
          </button>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <Toolbar :loading="loading" @execute="executeQuery" @clear="clearQuery" @save="saveQuery" @load="loadQuery" />

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Query Editor -->
      <div class="flex-1 flex flex-col">
        <ClientOnly>
          <QueryEditor v-model:query="query" v-model:variables="variables" v-model:headers="headers" />
        </ClientOnly>

        <!-- Results -->
        <div class="h-1/2 border-t border-gray-300">
          <ClientOnly>
            <ResultsViewer :result="result" :loading="loading" :error="error" />
          </ClientOnly>
        </div>
      </div>

      <!-- Schema Explorer -->
      <div v-if="showSchema" class="w-1/3 min-w-80">
        <ClientOnly>
          <SchemaExplorer :schema="mockSchema" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import components explicitly if auto-import fails
import Toolbar from '~/components/ToolBar.vue'
import QueryEditor from '~/components/QueryEditor.vue'
import ResultsViewer from '~/components/ResultsViewer.vue'
import SchemaExplorer from '~/components/SchemaExplorer.vue'
import axios from 'axios';

// Mock GraphQL schema for demonstration
const mockSchema = {
  types: [
    {
      name: 'User',
      fields: [
        { name: 'id', type: 'ID!', description: 'Unique identifier' },
        { name: 'name', type: 'String!', description: 'User name' },
        { name: 'email', type: 'String!', description: 'User email' },
        { name: 'posts', type: '[Post!]!', description: 'User posts' }
      ]
    },
    {
      name: 'Post',
      fields: [
        { name: 'id', type: 'ID!', description: 'Unique identifier' },
        { name: 'title', type: 'String!', description: 'Post title' },
        { name: 'content', type: 'String!', description: 'Post content' },
        { name: 'author', type: 'User!', description: 'Post author' }
      ]
    }
  ],
  queries: [
    { name: 'users', type: '[User!]!', description: 'Get all users' },
    { name: 'user', type: 'User', args: [{ name: 'id', type: 'ID!' }], description: 'Get user by ID' },
    { name: 'posts', type: '[Post!]!', description: 'Get all posts' }
  ],
  mutations: [
    { name: 'createUser', type: 'User!', args: [{ name: 'input', type: 'CreateUserInput!' }], description: 'Create a new user' },
    { name: 'updateUser', type: 'User!', args: [{ name: 'id', type: 'ID!' }, { name: 'input', type: 'UpdateUserInput!' }], description: 'Update user' }
  ]
}

// Reactive state
const query = ref(`query GetUsers {
  users {
    id
    name
    email
    posts {
      id
      title
    }
  }
}`)

const variables = ref('{}')
const headers = ref('{}')
const result = ref(null)
const loading = ref(false)
const error = ref(null)
const endpoint = ref('http://localhost:4000/graphql')
const showSchema = ref(true)
const { $swal } = useNuxtApp()
const STORAGE_KEY = 'graphql_playground_queries'

const clearQuery = () => {
  query.value = ''
  variables.value = '{}'
  result.value = null
  error.value = null
}

function saveQueryToLocal(queryObj) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const filtered = existing.filter((q) => q.name !== queryObj.name)
  filtered.push(queryObj)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

function loadQueriesFromLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (err) {
    return []
  }
}



const saveQuery = async () => {
  const { value: name } = await $swal.fire({
    title: 'Name your query',
    input: 'text',
    inputPlaceholder: 'Enter query name',
    inputValidator: (value) => !value && 'You need to write a name!',
    showCancelButton: true,
  })

  if (!name) return

  const queryData = {
    name,
    content: query.value,
    variables: JSON.parse(variables.value || '{}'),
    headers: JSON.parse(headers.value || '{}'),
    type: 'query',
    projectId: '123'
  }

  try {
    const res = await fetch('http://localhost:4000/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData)
    })

    if (!res.ok) {
      throw new Error((await res.json()).message || 'Failed to save query')
    }

    const savedQuery = await res.json()

    saveQueryToLocal(savedQuery)

    await $swal.fire('Saved!', 'Your query has been saved successfully.', 'success')
  } catch (err) {
    console.error(err)
    saveQueryToLocal(queryData)
    await $swal.fire('Saved Locally', 'Query saved locally as fallback.', 'info')
  }
}

const loadQuery = async () => {
  try {
    const res = await fetch('http://localhost:4000/api/queries')

    let queries = []
    if (res.ok) {
      queries = await res.json()
    } else {
      throw new Error('Failed to load from server')
    }

    const localQueries = loadQueriesFromLocal()
    queries = [...localQueries, ...queries]

    if (queries.length === 0) {
      await $swal.fire('No Queries', 'No saved queries found.', 'info')
      return
    }

    const inputOptions = queries.reduce((opts, q) => {
      opts[q.name] = q.name
      return opts
    }, {})

    const { value: selectedName } = await $swal.fire({
      title: 'Select a query to load',
      input: 'select',
      inputOptions,
      inputPlaceholder: 'Select a query',
      showCancelButton: true
    })

    if (!selectedName) return

    const q = queries.find((item) => item.name === selectedName)

    if (!q) {
      await $swal.fire('Not Found', 'Selected query not found', 'error')
      return
    }

    query.value = q.content || ''
    variables.value = JSON.stringify(q.variables || {}, null, 2)
    headers.value = JSON.stringify(q.headers || {}, null, 2)

    await $swal.fire('Loaded', `Loaded query: ${q.name}`, 'success')
  } catch (err) {
    console.error(err)
    await $swal.fire('Error', 'Could not load queries: ' + err.message, 'error')
  }
}

const executeQuery = async () => {
  loading.value = true
  error.value = null
  result.value = null

  let vars = {}
  let hdrs = {}

  try {
    vars = variables.value ? JSON.parse(variables.value) : {}
  } catch (e) {
    error.value = 'Variables JSON is invalid'
    loading.value = false
    return
  }

  try {
    hdrs = headers.value ? JSON.parse(headers.value) : {}
  } catch (e) {
    error.value = 'Headers JSON is invalid'
    loading.value = false
    return
  }

  try {
    const response = await axios.post(
      endpoint.value,
      {
        query: query.value,
        variables: vars,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...hdrs
        }
      }
    )

    if (response.data.errors) {
      error.value = JSON.stringify(response.data.errors, null, 2)
    }

    result.value = response.data
  } catch (err) {
    error.value = err.message || 'Error executing query'
  } finally {
    loading.value = false
  }
}

const toggleSchema = () => {
  showSchema.value = !showSchema.value
}

// SEO
useHead({
  title: 'GraphQL Playground',
  meta: [
    { name: 'description', content: 'Interactive GraphQL playground for testing queries and exploring schemas' }
  ]
})
</script>