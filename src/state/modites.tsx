import { Context, createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModitesContext: Context<any> = createContext([{}, Function])
const ModitesContextProvider = ModitesContext.Provider

export { ModitesContextProvider }
export default ModitesContext
