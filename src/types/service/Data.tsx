import Modite from '../../models/Modite'
import Project from '../../models/Project'

export type NameProperties = 'real_name' | 'name'

export interface DataState {
  filter: string
  modites: Modite[]
  projects: Project[]
  rawModites: Modite[]
  rawProjects: Project[]
}

export interface DataAction {
  type: 'clear-filter' | 'filter-project-users' | 'on-fetch-modite-profile' | 'on-filter' | 'on-load'
  filter?: string
  id?: string
  modites?: Modite[]
}

export interface DataProps {
  setFilter: (val: string) => void
  processTimestamps: (records: Modite[]) => void
  fetchModiteProfile: (id: string) => void
}
