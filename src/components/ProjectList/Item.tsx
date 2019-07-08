import { IonIcon } from '@ionic/react'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ListItemProps } from '../../types/components/ProjectList'
import s from './Item.module.scss'

const ProjectItem: FunctionComponent<ListItemProps & RouteComponentProps> = ({ item, plain }) => {
  if (item.id === '-1') {
    return <div></div>
  }

  return (
    <div className={classnames(s.itemInnerCt, plain ? s.plainItem : null)}>
      <div className={s.nameCt}>{item.name}</div>
      <div>👤</div>
      <div className={s.projectUserCount}>{item.users.length}</div>
      <IonIcon ios="ios-arrow-forward" md="ios-arrow-forward" />
    </div>
  )
}

export default withRouter(ProjectItem)
