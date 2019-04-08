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
      const modites = action.modites ? action.modites : []
      const projects = action.projects ? action.projects : []
      // if there was an activeModite, we need to find the new object
      const activeModite = state.activeModite
        ? modites.find((modite: Modite) => {
            if (state.activeModite) {
              return modite.id === state.activeModite.id
            }

            return false
          })
        : undefined
      // if there was an activeProject, we need to find the new object
      const activeProject = state.activeProject
        ? projects.find((project: Project) => {
            if (state.activeProject) {
              return project.id === state.activeProject.id
            }

            return false
          })
        : undefined

      return {
        moditesSource: state.moditesFilter ? state.moditesSource : modites,
        projectsSource: state.projectsFilter ? state.projectsSource : projects,
        ...state,
        activeModite,
        activeProject,
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
    filterProjects: createFilterFn({
      dispatch,
      // we need to use all projects so if filtered, use the cached array
      modites: state.moditesSource || state.modites,
      projects: state.projectsSource || state.projects,
      type: 'projects',
      workerState: workerState,
    }),

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

    let minute: number

    // this will run every second but only trigger
    // the getData function when the minute changes
    const tick = () => {
      const date = new Date()
      const currentMinutes = date.getMinutes()

      if (minute && currentMinutes !== minute) {
        getData(workerState.postMessage)
      }

      minute = currentMinutes
    }

    window.setInterval(tick, 1000)

    // get data from the api
    getData(workerState.postMessage)
  }, [])

  return <DataContext.Provider value={[state, props]}>{children}</DataContext.Provider>
}

export { DataProvider }
export default DataContext
