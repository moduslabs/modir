import React, { Context, createContext } from 'react'
import IModite from '../models/Modite'
import IWorkerEvent from '../models/WorkerEvent'
import WorkerContext, { Worker } from './Worker'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModitesContext: Context<any> = createContext([{}, Function])

// get locale once
const locale: string = navigator.language

let rawModites: IModite[]
let filterModites: (filter: string) => void

// get data from server
const getModiteData = async (worker: Worker, filter: string = ''): Promise<void> => {
  const date = new Date()
  const modites = await fetch('https://modus.app/modites/all').then(res => res.json())

  worker.postMessage({ modites, filter, date, locale })
}

const createFilterModites = (worker: Worker) => (filter: string = '') => {
  const date = new Date()

  worker.postMessage({ modites: rawModites, filter, date, locale })
}

const ModitesProvider = ({ children }: { children?: React.ReactNode }) => {
  const [modites, setModites]: [IModite[], React.Dispatch<any>] = React.useState([])
  const [worker, addCallback] = React.useContext(WorkerContext)

  React.useEffect(() => {
    filterModites = createFilterModites(worker)
    addCallback((event: IWorkerEvent) => {
      setModites(event.data)

      if (!rawModites) {
        rawModites = event.data
      }
    })

    // get data from the api
    getModiteData(worker)
  }, [])

  return <ModitesContext.Provider value={[modites, filterModites]}>{children}</ModitesContext.Provider>
}

export { ModitesProvider }
export default ModitesContext
