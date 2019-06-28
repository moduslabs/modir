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
  type: string
  filter?: string
  id?: string
}

export interface DataProps {
  setFilter: (val: string) => void
  processTimestamps: (records: Modite[]) => void
  fetchModiteProfile: (id: string) => void
}
