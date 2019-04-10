import Modite from './Modite'
import Project from './Project'

export default interface ModiteListProps {
  activeView: 'project' | 'projects' | 'modite' | 'modites'
  filter: string
  listRecords: (Modite | Project)[]
  activeRecord: Modite | Project | null
  setFilter: (val: string) => void
}
