import Modite from "./Modite";

export default interface ModiteListProps {
  onModiteItemClick?: Function;
  slides: React.MutableRefObject<any>;
  activeModite: Modite;
  toggleShowGlobe: Function;
}
