import Modite from '../../../models/Modite'
import Project from '../../../models/Project'

export default interface ModiteListProps {
  activeView: 'project' | 'projects' | 'modite' | 'modites'
  filter: string
  listRecords: (Modite | Project)[]
  activeRecord: Modite | Project | undefined
  setFilter: (val: string) => void
}

export interface FilterEvent {
  detail: {
    value?: string
  }
}
