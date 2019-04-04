import React, { Context, createContext } from 'react'
// @ts-ignore
import Worker from 'worker-loader!./serviceworker.js' // eslint-disable-line import/no-webpack-loader-syntax
import WorkerEvent from '../models/WorkerEvent'
import Modite from '../models/Modite'
import Project from '../models/Project'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkerContext: Context<any> = createContext([{}, Function])

type WorkerCallback = (event: WorkerEvent) => void

export interface WorkerPostMessage {
  date: Date
  filter: string
  filterType: string
  locale: string
  modites: Modite[]
  projects: Project[]
}

type PostMessage = (message: WorkerPostMessage) => void

export interface WorkerState {
  addCallback: (callback: WorkerCallback) => void
  postMessage: PostMessage
  removeCallback: (callback: WorkerCallback) => void
  worker: Worker
}

const callbacks: WorkerCallback[] = []
const worker = new Worker()

const initialState: WorkerState = {
  addCallback: (callback: WorkerCallback) => callbacks.push(callback),
  postMessage: (message: WorkerPostMessage) => worker.postMessage(message),
  removeCallback: (callback: WorkerCallback) => callbacks.splice(callbacks.indexOf(callback), 1),
  worker,
}

const WorkerProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state] = React.useState(initialState)

  worker.onmessage = (event: WorkerEvent) => {
    requestAnimationFrame(() => {
      callbacks.forEach(callback => callback(event))
    })
  }

  return <WorkerContext.Provider value={state}>{children}</WorkerContext.Provider>
}

export { WorkerProvider, Worker }
export default WorkerContext
