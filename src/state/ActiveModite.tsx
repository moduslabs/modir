import React, { Context, createContext } from 'react'
import IModite from '../models/Modite'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActiveModiteContext: Context<any> = createContext([{}, Function])

const ActiveModiteProvider = ({ children }: { children?: React.ReactNode }) => {
  const [activeModite, setActiveModite]: [IModite | null, React.Dispatch<any>] = React.useState(null)

  return <ActiveModiteContext.Provider value={[activeModite, setActiveModite]}>{children}</ActiveModiteContext.Provider>
}

export { ActiveModiteProvider }
export default ActiveModiteContext
