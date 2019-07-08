import { IonIcon } from '@ionic/react'
import React, { FunctionComponent } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import ListItemProps from '../../types/components/ProjectList'
import s from './Item.module.css'

const ProjectItem: FunctionComponent<ListItemProps & RouteComponentProps> = ({ item }) => (
  <div className={s.itemInnerCt}>
    <div className={s.nameCt}>{item.name}</div>
    <div>👤</div>
    <div className={s.projectUserCount}>{item.users.length}</div>
    <IonIcon ios="ios-arrow-forward" md="ios-arrow-forward" />
  </div>
)

export default withRouter(ProjectItem)
