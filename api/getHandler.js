({ inputs }) => {
  const { resource, params } = inputs
  return `Hello ${params.who} from ${resource.typeName}, id: ${resource.name}`
}