({ inputs }) => {
  const { resource, params } = inputs
  return `Hello ${params.who} from ${resource.typeName} ${resource.name}`
}