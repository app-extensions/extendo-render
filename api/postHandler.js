async ({ inputs, api, log }) => {
  const { path, body } = inputs
  const old = await api.keyValue.get(path)
  await api.keyValue.set(path, body)
  log.info(`Setting value for ${path} to ${JSON.stringify(body)}`)
  return old
}