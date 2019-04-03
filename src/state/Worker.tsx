import React, { Context, createContext } from 'react'
// @ts-ignore
import Worker from 'worker-loader!../components/ModiteList/formatModites.js' // eslint-disable-line import/no-webpack-loader-syntax
import IWorkerEvent from '../models/WorkerEvent'
import IModite from '../models/Modite'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkerContext: Context<any> = createContext([{}, Function])

type WorkerCallback = (event: IWorkerEvent) => void

export interface IWorkerPostMessage {
  date: Date
  filter: string
  locale: string
  modites: IModite[]
}

type PostMessage = (message: IWorkerPostMessage) => void

export interface IWorkerState {
  addCallback: (callback: WorkerCallback) => void
  postMessage?: PostMessage
  removeCallback: (callback: WorkerCallback) => void
  worker?: Worker
}

interface IWorkerAction {
  type: string
}

const workerReducer = (state: IWorkerState, action: IWorkerAction): IWorkerState => {
  switch (action.type) {
    case 'initialize':
      const worker = new Worker()

      return {
        ...state,
        postMessage: (message: IWorkerPostMessage) => worker.postMessage(message),
        worker,
      }
    default:
      throw new Error()
  }
}

const callbacks: WorkerCallback[] = []

const initialState: IWorkerState = {
  addCallback: (callback: WorkerCallback) => callbacks.push(callback),
  removeCallback: (callback: WorkerCallback) => callbacks.splice(callbacks.indexOf(callback), 1),
}

const WorkerProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(workerReducer, initialState)

  if (!state.worker) {
    dispatch({
      type: 'initialize',
    })

    return null
  }

  state.worker.onmessage = (event: IWorkerEvent) => {
    requestAnimationFrame(() => {
      callbacks.forEach(callback => callback(event))
    })
  }

  return <WorkerContext.Provider value={state}>{children}</WorkerContext.Provider>
}

export { WorkerProvider, Worker }
export default WorkerContext
