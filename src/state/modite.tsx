import { Context, createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModiteContext: Context<any> = createContext([{}, Function])
const ModiteContextProvider = ModiteContext.Provider

export { ModiteContextProvider }
export default ModiteContext
