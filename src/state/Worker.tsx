import React, { Context, createContext } from 'react'
// @ts-ignore
import Worker from 'worker-loader!../components/ModiteList/formatModites.js' // eslint-disable-line import/no-webpack-loader-syntax
import IWorkerEvent from '../models/WorkerEvent'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkerContext: Context<any> = createContext([{}, Function])

const callbacks: ((event: IWorkerEvent) => void)[] = []

const addCallback = (callback: (event: IWorkerEvent) => void) => callbacks.push(callback)

const WorkerProvider = ({ children }: { children?: React.ReactNode }) => {
  const [worker, setWorker]: [Worker, React.Dispatch<any>] = React.useState(null)

  if (!worker) {
    setWorker(new Worker())

    return null
  }

  worker.onmessage = (event: IWorkerEvent) => {
    requestAnimationFrame(() => {
      callbacks.forEach(callback => callback(event))
    })
  }

  return <WorkerContext.Provider value={[worker, addCallback]}>{children}</WorkerContext.Provider>
}

export { WorkerProvider, Worker }
export default WorkerContext
