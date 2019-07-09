import Modite from '../../../models/Modite'

export interface ListItemProps {
  item: Modite
  plain?: boolean
}

export default interface VirtualizedListProps {
  addSpacerRow?: boolean
  className?: string
  lastScrollOffset?: number
  onScroll?: (...args: any) => void
  plain?: boolean
  records: Modite[]
}
