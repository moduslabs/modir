import React, { FunctionComponent, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import IListItemProps from '../../models/ListItemProps';
import ModiteImage from '../ModiteImage';
import s from './styles.module.css';

const ModiteListItem: FunctionComponent<IListItemProps & RouteComponentProps> = ({ modite }) => (
  <div className={s.itemInnerCt}>
    {modite.profile && (
      <div aria-hidden="true" className={s.thumbContainer}>
        <ModiteImage modite={modite} />
      </div>
    )}
    <div className={s.nameCt}>{modite.real_name}</div>
    <div aria-hidden="true" className={s.todCt}>
      {modite.tod}
    </div>
    <div className={s.localTime}>{modite.localTime}</div>
  </div>
);

export default withRouter(ModiteListItem);
