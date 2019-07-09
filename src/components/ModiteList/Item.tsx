import { IonIcon } from '@ionic/react'
import React, { FunctionComponent } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import ModiteImage from '../ModiteImage'
import Time from '../Time'
import { ListItemProps } from '../../types/components/ModiteList'
import s from './Item.module.scss'

const ModiteItem: FunctionComponent<ListItemProps & RouteComponentProps> = ({ item }) => (
  <div className={s.itemInnerCt}>
    <ModiteImage className={s.thumbContainer} modite={item} />
    <div className={s.nameCt}>{item.real_name}</div>
    <Time modite={item} />
    <IonIcon ios="ios-arrow-forward" md="ios-arrow-forward" />
  </div>
)

export default withRouter(ModiteItem)
