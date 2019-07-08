import Modite from '../../../models/Modite'

export default interface VirtualizedListProps {
  records: Modite[]
  lastScrollOffset: number
  onScroll: (...args: any) => void
  addSpacerRow?: boolean
}
