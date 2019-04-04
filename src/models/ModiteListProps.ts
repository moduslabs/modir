import IModite from './Modite'

export default interface IModiteListProps {
  onModiteItemClick?: (modite: IModite) => void
  slides: React.MutableRefObject<any>
  view?: string
}
