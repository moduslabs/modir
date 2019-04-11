import Modite from '../../../models/Modite'
import Project from '../../../models/Project'

export default interface VirtualizedListProps {
  records: (Modite | Project)[]
  lastScrollOffset: number
  onScroll: (...args: any) => void
}
