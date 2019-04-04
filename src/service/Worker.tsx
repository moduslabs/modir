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
  postMessage?: PostMessage
  removeCallback: (callback: WorkerCallback) => void
  worker: Worker
}

interface WorkerAction {
  type: string
}

const workerReducer = (state: WorkerState, action: WorkerAction): WorkerState => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        postMessage: (message: WorkerPostMessage) => state.worker.postMessage(message),
      }
    default:
      throw new Error()
  }
}

const callbacks: WorkerCallback[] = []

const initialState: WorkerState = {
  addCallback: (callback: WorkerCallback) => callbacks.push(callback),
  removeCallback: (callback: WorkerCallback) => callbacks.splice(callbacks.indexOf(callback), 1),
  worker: new Worker(),
}

const WorkerProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(workerReducer, initialState)

  if (!state.postMessage) {
    dispatch({
      type: 'initialize',
    })

    return null
  }

  state.worker.onmessage = (event: WorkerEvent) => {
    requestAnimationFrame(() => {
      callbacks.forEach(callback => callback(event))
    })
  }

  return <WorkerContext.Provider value={state}>{children}</WorkerContext.Provider>
}

export { WorkerProvider, Worker }
export default WorkerContext
