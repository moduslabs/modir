import React, { Context, createContext } from 'react'
import IModite from '../models/Modite'
import IWorkerEvent from '../models/WorkerEvent'
import WorkerContext, { IWorkerPostMessage } from './Worker'
import IProject from '../models/Project'
import { IModitesAction, IModitesProps, IModitesState, IFilterFnProps } from '../types/service/Data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataContext: Context<any> = createContext([{}, Function])

// get locale once
const locale: string = navigator.language

// get data from server
// const getModiteData = async (postMessage: any, filter: string = ''): Promise<void> => {
//   const date = new Date()
//   const modites = await fetch('https://modus.app/modites/all').then(res => res.json())
//   const message: IWorkerPostMessage = { data: modites, date, filter, locale, type: 'modite' }

//   postMessage(message)
// }

const getData = async (postMessage: any) => {
  const date = new Date()
  const [modites, projects] = await Promise.all([
    fetch('https://modus.app/modites/all').then(res => res.json()),
    fetch('https://modus.app/projects/all').then(res => res.json()),
  ])

  const message: IWorkerPostMessage = { date, filter: '', filterType: 'modites', locale, modites, projects }

  postMessage(message)
}

const initialState: IModitesState = {
  modites: [],
  projects: [],
}

const moditesReducer = (state: IModitesState, action: IModitesAction): IModitesState => {
  switch (action.type) {
    case 'on-filter-modites':
      if (action.filter) {
        return {
          ...state,
          moditesFilter: action.filter,
          moditesSource: state.moditesSource || state.modites,
        }
      } else {
        // filter was cleared, let's get back to all modites
        return {
          ...state,
          modites: state.moditesSource || [],
          moditesFilter: undefined,
          moditesSource: undefined,
        }
      }
    case 'on-filter-projects':
      if (action.filter) {
        return {
          ...state,
          projectsFilter: action.filter,
          projectsSource: state.projectsSource || state.projects,
        }
      } else {
        // filter was cleared, let's get back to all modites
        return {
          ...state,
          projects: state.projectsSource || [],
          projectsFilter: undefined,
          projectsSource: undefined,
        }
      }
    case 'on-load':
      const modites = action.modites ? action.modites : []
      const projects = action.projects ? action.projects : []

      return {
        moditesSource: state.moditesFilter ? state.moditesSource : modites,
        projectsSource: state.projectsFilter ? state.projectsSource : projects,
        ...state,
        modites,
        projects,
      }
    case 'set-active-modite':
      return {
        ...state,
        activeModite: action.modite,
      }
    case 'set-active-project':
      return {
        ...state,
        activeProject: action.project,
      }
    default:
      throw new Error()
  }
}

const createFilterFn = ({ dispatch, modites, type, workerState: { postMessage } }: IFilterFnProps) => (
  filter: string,
) => {
  const date = new Date()
  const message: IWorkerPostMessage = { date, filter, filterType: 'modites', locale, modites, projects: [] } // TODO

  dispatch({
    type: `on-filter-${type}`,
    filter,
  })

  if (postMessage && filter) {
    // no need to filter as dispatch will return us
    postMessage(message)
  }
}

const DataProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(moditesReducer, initialState)
  const workerState = React.useContext(WorkerContext)
  const props: IModitesProps = {
    filterModites: createFilterFn({
      dispatch,
      // we need to use all modites so if filtered, use the cached array
      modites: state.moditesSource || state.modites,
      type: 'modites',
      workerState: workerState,
    }),
    filterProjects: () => {},

    setActiveModite: (modite: IModite | null) => {
      dispatch({
        type: 'set-active-modite',
        modite,
      })
    },
    setActiveProject: (project: IProject | null) => {
      dispatch({
        type: 'set-active-project',
        project,
      })
    },
  }

  React.useEffect(() => {
    const loadCallback = (event: IWorkerEvent) => {
      console.log(event)
      dispatch({
        type: 'on-load',
        ...event.data,
      })
    }

    workerState.addCallback(loadCallback)

    // get data from the api
    getData(workerState.postMessage)
  }, [])

  return <DataContext.Provider value={[state, props]}>{children}</DataContext.Provider>
}

export { DataProvider }
export default DataContext
