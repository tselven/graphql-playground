export function transformIntrospectionSchema(__schema) {
  if (!__schema) return { types: [], queries: [], mutations: [] }

  const types = (__schema.types || []).filter(
    (t) => !t.name.startsWith('__') && t.fields
  ).map((t) => ({
    name: t.name,
    description: t.description,
    fields: (t.fields || []).map((f) => ({
      name: f.name,
      description: f.description,
      type: formatTypeName(f.type)
    }))
  }))

  const queryTypeName = __schema.queryType?.name
  const mutationTypeName = __schema.mutationType?.name

  const getRootFields = (typeName) => {
    const type = __schema.types.find((t) => t.name === typeName)
    return (type?.fields || []).map((f) => ({
      name: f.name,
      description: f.description,
      args: (f.args || []).map((arg) => ({
        name: arg.name,
        type: formatTypeName(arg.type)
      })),
      type: formatTypeName(f.type)
    }))
  }

  const queries = getRootFields(queryTypeName)
  const mutations = getRootFields(mutationTypeName)

  return { types, queries, mutations }

}

function formatTypeName(type) {
  if (!type) return 'Unknown'
  if (type.kind === 'NON_NULL') return `${formatTypeName(type.ofType)}!`
  if (type.kind === 'LIST') return `[${formatTypeName(type.ofType)}]`
  return type.name || 'Unknown'
}