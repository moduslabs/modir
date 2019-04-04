import IModite from '../../models/Modite'
import IProject from '../../models/Project'
import { IWorkerState } from '../../service/Worker'

type ModiteFilter = (filter: string) => void

export interface IModitesState {
  activeModite?: IModite | null
  activeProject?: IProject | null
  modites: IModite[]
  moditesFilter?: string
  moditesSource?: IModite[]
  projects: IProject[]
  projectsFilter?: string
  projectsSource?: IProject[]
}

export interface IModitesAction {
  type: 'on-filter-modites' | 'on-filter-projects' | 'on-load' | 'set-active-modite' | 'set-active-project'
  filter?: string
  modite?: IModite | null
  modites?: IModite[]
  project?: IProject | null
  projects?: IProject[]
}

export interface IModitesProps {
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
