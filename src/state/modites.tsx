import React, { Context, createContext } from 'react'
import IModite from '../models/Modite'
import IWorkerEvent from '../models/WorkerEvent'
import WorkerContext, { IWorkerPostMessage, IWorkerState } from './Worker'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModitesContext: Context<any> = createContext([{}, Function])

// get locale once
const locale: string = navigator.language

// get data from server
const getModiteData = async (postMessage: any, filter: string = ''): Promise<void> => {
  const date = new Date()
  const modites = await fetch('https://modus.app/modites/all').then(res => res.json())
  const message: IWorkerPostMessage = { date, filter, locale, modites }

  postMessage(message)
}

type ModiteFilter = (filter: string) => void

export interface IModitesState {
  filter?: string
  modites: IModite[]
  moditesSource?: IModite[]
}

interface IModitesAction {
  type: 'on-filter' | 'on-load'
  filter?: string
  data?: IModite[]
}

export interface IModitesProps {
  filter: ModiteFilter
}

const initialState: IModitesState = {
  modites: [],
}

const moditesReducer = (state: IModitesState, action: IModitesAction): IModitesState => {
  switch (action.type) {
    case 'on-filter':
      if (action.filter) {
        return {
          moditesSource: state.modites,
          ...state,
          filter: action.filter,
        }
      } else {
        // filter was cleared, let's get back to all modites
        return {
          ...state,
          filter: action.filter,
          modites: state.moditesSource || [],
          moditesSource: undefined,
        }
      }
    case 'on-load':
      const modites = action.data ? action.data : []

      return {
        moditesSource: state.filter ? state.moditesSource : modites,
        ...state,
        modites,
      }
    default:
      throw new Error()
  }
}

interface IFilterFnProps {
  dispatch: any
  modites: IModite[]
  workerState: IWorkerState
}

const createFilterFn = ({ dispatch, modites, workerState: { postMessage } }: IFilterFnProps) => (filter: string) => {
  const date = new Date()
  const message: IWorkerPostMessage = { date, filter, locale, modites }

  dispatch({
    type: 'on-filter',
    filter,
  })

  if (postMessage && filter) {
    // no need to filter as dispatch will return us
    postMessage(message)
  }
}

const ModitesProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(moditesReducer, initialState)
  const workerState = React.useContext(WorkerContext)
  const props: IModitesProps = {
    filter: createFilterFn({
      dispatch,
      // we need to use all modites so if filtered, use the cached array
      modites: state.moditesSource || state.modites,
      workerState: workerState,
    }),
  }

  React.useEffect(() => {
    const loadCallback = (event: IWorkerEvent) => {
      dispatch({
        type: 'on-load',
        data: event.data,
      })
    }

    workerState.addCallback(loadCallback)

    // get data from the api
    getModiteData(postMessage)
  }, [])

  return <ModitesContext.Provider value={[state, props]}>{children}</ModitesContext.Provider>
}

export { ModitesProvider }
export default ModitesContext
