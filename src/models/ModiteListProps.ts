import Modite from './Modite'

export default interface ModiteListProps {
  onModiteItemClick?: (modite: Modite) => void
  view?: string
}
