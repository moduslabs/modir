import Modite from '../../models/Modite'
import Project from '../../models/Project'
import { WorkerState } from '../../service/Worker'

type ModiteFilter = (filter: string) => void

export interface DataState {
  activeModite?: Modite | null
  activeProject?: Project | null
  modites: Modite[]
  moditesFilter?: string
  moditesSource?: Modite[]
  projects: Project[]
  projectsFilter?: string
  projectsSource?: Project[]
}

type DataActions = 'on-filter-modites' | 'on-filter-projects' | 'on-load' | 'set-active-modite' | 'set-active-project'

export interface DataAction {
  type: DataActions
  filter?: string
  modite?: Modite | null
  modites?: Modite[]
  project?: Project | null
  projects?: Project[]
}

export interface DataProps {
  filterModites: ModiteFilter
  filterProjects: ModiteFilter

  setActiveModite: (modite: Modite | null) => void
  setActiveProject: (project: Project | null) => void
}

export interface FilterFnProps {
  dispatch: any
  modites: Modite[]
  projects: Project[]
  type: 'modites' | 'projects'
  workerState: WorkerState
}
