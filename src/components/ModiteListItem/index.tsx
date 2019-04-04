import React, { FunctionComponent } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import ListItemProps from '../../models/ListItemProps'
import ModiteImage from '../ModiteImage'
import s from './styles.module.css'
import Modite from '../../models/Modite'
import Project from '../../models/Project'
import { IonIcon } from '@ionic/react'

const ModiteListItem: FunctionComponent<ListItemProps & RouteComponentProps> = ({ modite }) => {
  const isProject: boolean = modite.recordType === 'project'
  const hasUserAvatar: boolean = !isProject
  const name: string = isProject ? (modite.name as string) : ((modite as Modite).real_name as string)

  return (
    <div className={s.itemInnerCt}>
      {hasUserAvatar && (
        <div aria-hidden="true" className={s.thumbContainer}>
          <ModiteImage modite={modite} />
        </div>
      )}
      <div className={s.nameCt}>{name}</div>
      {modite.tod && (
        <div aria-hidden="true" className={s.todCt}>
          {modite.tod}
        </div>
      )}
      {modite.localTime && <div className={s.localTime}>{modite.localTime}</div>}

      {isProject && <div>👤</div>}
      {isProject && <div className={s.projectUserCount}>{(modite as Project).users.length}</div>}

      <IonIcon ios="ios-arrow-forward" md="ios-arrow-forward" />
    </div>
  )
}

export default withRouter(ModiteListItem)
