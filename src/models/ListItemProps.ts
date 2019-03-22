import { RouteComponentProps } from 'react-router';
import Modite from './Modite';

export default interface ListItemProps extends RouteComponentProps {
  list: Modite[];
  filter: string;
  date: Date;
  style: { [key: string]: any };
  modite: Modite;
  onItemClick?: Function;
}
