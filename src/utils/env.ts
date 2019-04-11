export const envOrDefault = (variableName: string, defaultValue?: string | boolean): string | boolean | void => {
  const envValue = process.env[variableName]

  // parse booleans by default
  if (envValue === 'true') {
    return true
  }

  if (envValue === 'false') {
    return false
  }

  if (envValue === undefined) {
    return defaultValue
  }

  return envValue
}
