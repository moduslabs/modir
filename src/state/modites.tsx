import React, { Context, createContext } from 'react'
import IModite from '../models/Modite'
import IWorkerEvent from '../models/WorkerEvent'
// @ts-ignore
import Worker from 'worker-loader!../components/ModiteList/formatModites.js' // eslint-disable-line import/no-webpack-loader-syntax

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModitesContext: Context<any> = createContext([{}, Function])

// reference to the worker that formats and filters modite data
const worker: Worker = new Worker()

// get locale once
const locale: string = navigator.language

// get data from server
const getModiteData = async (filter: string, date: Date): Promise<void> => {
  const modites = await fetch('https://modus.app/modites/all').then(res => res.json())

  worker.postMessage({ modites: modites, filter, date, locale })
}

const ModitesProvider = ({ children }: { children?: React.ReactNode }) => {
  const [modites, setModites]: [IModite[], React.Dispatch<any>] = React.useState([])

  React.useEffect(() => {
    worker.onmessage = (event: IWorkerEvent) => {
      requestAnimationFrame(() => {
        setModites(event.data)
      })
    }

    // get data from the api
    getModiteData('', new Date())
  }, [])

  return <ModitesContext.Provider value={modites}>{children}</ModitesContext.Provider>
}

export { ModitesProvider }
export default ModitesContext
