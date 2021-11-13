({ inputs }) => {
  const { resource, params, path } = inputs
  return `Hello ${params.who} from ${resource.typeName} ${resource.name} with path: "${path}""`
}