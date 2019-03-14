import Modite from './Modite';

export default interface ListItemProps {
  list: Modite[];
  filter: string;
  date: Date;
  style: { [key: string]: any };
  modite: Modite;
}
