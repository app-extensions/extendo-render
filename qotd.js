async ({ helpers }) => {
  return helpers.got('https://zenquotes.io/api/today').json()
}