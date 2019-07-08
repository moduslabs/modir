import Project from '../../../models/Project'

export interface ListItemProps {
  item: Project
  plain: boolean
}

export default interface ProjectListProps {
  addSpacerRow?: boolean
  lastScrollOffset?: number
  onScroll?: (...args: any) => void
  plain?: boolean
  records: Project[]
}
