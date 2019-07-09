import Modite from '../../../models/Modite'

export interface ListItemProps {
  item: Modite
  plain?: boolean
}

export default interface VirtualizedListProps {
  records: Modite[]
  lastScrollOffset: number
  onScroll: (...args: any) => void
  addSpacerRow?: boolean
  plain?: boolean
}
