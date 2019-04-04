import React, { Context, createContext } from 'react'
import Modite from '../models/Modite'
import WorkerEvent from '../models/WorkerEvent'
import WorkerContext, { WorkerPostMessage } from './Worker'
import Project from '../models/Project'
import { DataAction, DataProps, DataState, FilterFnProps } from '../types/service/Data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataContext: Context<any> = createContext([{}, Function])

// get locale once
const locale: string = navigator.language

const getData = async (postMessage: any) => {
  const date = new Date()
  const [modites, projects] = await Promise.all([
    fetch('https://modus.app/modites/all').then(res => res.json()),
    fetch('https://modus.app/projects/all').then(res => res.json()),
  ])

  const message: WorkerPostMessage = { date, filter: '', filterType: 'modites', locale, modites, projects }

  postMessage(message)
}

const initialState: DataState = {
  modites: [],
  projects: [],
}

const moditesReducer = (state: DataState, action: DataAction): DataState => {
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
      // eslint-disable-next-line no-case-declarations
      const modites = action.modites ? action.modites : []
      // eslint-disable-next-line no-case-declarations
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

const createFilterFn = ({ dispatch, modites, projects, type, workerState: { postMessage } }: FilterFnProps) => (
  filter: string,
) => {
  const date = new Date()
  const message: WorkerPostMessage = { date, filter, filterType: 'modites', locale, modites, projects }

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
  const props: DataProps = {
    filterModites: createFilterFn({
      dispatch,
      // we need to use all modites so if filtered, use the cached array
      modites: state.moditesSource || state.modites,
      projects: state.projectsSource || state.projects,
      type: 'modites',
      workerState: workerState,
    }),
    filterProjects: () => {},

    setActiveModite: (modite: Modite | null) => {
      dispatch({
        type: 'set-active-modite',
        modite,
      })
    },
    setActiveProject: (project: Project | null) => {
      dispatch({
        type: 'set-active-project',
        project,
      })
    },
  }

  React.useEffect(() => {
    const loadCallback = (event: WorkerEvent) => {
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
