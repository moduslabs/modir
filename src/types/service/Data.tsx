import IModite from '../../models/Modite'
import IProject from '../../models/Project'
import { IWorkerState } from '../../service/Worker'

type ModiteFilter = (filter: string) => void

export interface IDataState {
  activeModite?: IModite | null
  activeProject?: IProject | null
  modites: IModite[]
  moditesFilter?: string
  moditesSource?: IModite[]
  projects: IProject[]
  projectsFilter?: string
  projectsSource?: IProject[]
}

type DataActions = 'on-filter-modites' | 'on-filter-projects' | 'on-load' | 'set-active-modite' | 'set-active-project'

export interface IDataAction {
  type: DataActions
  filter?: string
  modite?: IModite | null
  modites?: IModite[]
  project?: IProject | null
  projects?: IProject[]
}

export interface IDataProps {
  filterModites: ModiteFilter
  filterProjects: ModiteFilter

  setActiveModite: (modite: IModite | null) => void
  setActiveProject: (project: IProject | null) => void
}

export interface IFilterFnProps {
  dispatch: any
  modites: IModite[]
  type: 'modites' | 'projects'
  workerState: IWorkerState
}
