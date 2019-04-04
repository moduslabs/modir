import Modite from './Modite'

export default interface ModiteListProps {
  onModiteItemClick?: (modite: Modite) => void
  slides: React.MutableRefObject<any>
  view?: string
}
