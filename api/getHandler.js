async ({ inputs, api, log }) => {
  const { resource, params, path } = inputs
  const current = await api.keyValue.get(path)
  log.info(`The current value is: ${current}`)
  return `Hello ${params.who} from ${resource.typeName} ${resource.name}\nThe value at path: "${path}" is:\n${JSON.stringify(current)}\n`
}