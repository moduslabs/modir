import Modite from '../../models/Modite'
import Project from '../../models/Project'

export type NameProperties = 'real_name' | 'name'

export interface DataState {
  filter: string
  isLoaded: boolean
  moditesFilter?: string
  modites: Modite[]
  projectsFilter?: string
  projects: Project[]
}

export interface DataAction {
  type: 'clear-filter' | 'filter-modites' | 'filter-project-users' | 'filter-projects' | 'on-load'
  filter?: string
  id?: string
  modites?: Modite[]
}

export interface DataProps {
  setFilter: (val: string) => void
  processTimestamps: (records: Modite[]) => void
  fetchModiteProfile: (id: string) => void
}
