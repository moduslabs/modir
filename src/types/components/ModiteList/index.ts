import Modite from '../../../models/Modite'

export interface ListItemProps {
  item: Modite
  plain?: boolean
}

export default interface VirtualizedListProps {
  addSpacerRow?: boolean
  lastScrollOffset?: number
  onScroll?: (...args: any) => void
  plain?: boolean
  records: Modite[]
  listType?: string
}
