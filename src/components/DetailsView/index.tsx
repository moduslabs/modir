import React, { useContext } from 'react'
import DataContext from '../../service/Data'
import classNames from 'classnames/bind'
import s from './styles.module.css'
import VirtualizedList from '../VirtualizedList'
import Project from '../../models/Project'
import { DataState } from '../../types/service/Data'
import { IonIcon } from '@ionic/react'
import Modite from '../../models/Modite'

let lastScrollOffset = 0 // used by onScroll

// used to restore scroll position in the VirtualizedList
const onScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
  lastScrollOffset = scrollOffset
}

const NAME_CHECKER_RE = /[@/]/
const NAME_REPLACER_RE = /([@/]?)(.+)$/

const GitHub = ({ className, name }: { className?: string; name?: string }) => {
  if (!name) {
    return null
  }

  if (name.match(NAME_CHECKER_RE)) {
    name = name.replace(NAME_REPLACER_RE, '$2')
  }

  return (
    <div className={className}>
      <a href={`https://github.com/${name}`} target="_blank" rel="noopener noreferrer">
        <IonIcon name="logo-github" />
        {name}
      </a>
    </div>
  )
}

const ModiteDetail = ({ className, modite }: { className?: string; modite?: Modite | null }) => {
  if (!modite) {
    return null
  }

  const { localDate, localTime, profile = {}, real_name: name, tod }: any = modite
  const { fields = {}, image_192: image, title } = profile
  const { Location, Title, 'GitHub User': gitHubUser } = fields

  const cx = classNames.bind(s)
  className = cx(s.moditeCt, className, s.isModite)
  const moditeDetailsWrapCLs = cx(s.moditeDetails, s.moditeDetailsShown)

  return (
    <div className={className}>
      {image && <img src={image} />}
      <div className={moditeDetailsWrapCLs}>
        <div className={s.name}>{name}</div>

        <div className={s.location}>{Location}</div>
        <div className={s.todWrap}>
          <span className={s.tod}>{tod}</span>
          {localDate} {localDate && localTime && '-'} {localTime}
        </div>

        <div className={s.fieldTitle}>{Title}</div>
        <GitHub className={s.gitUser} name={gitHubUser} />

        <div className={s.title}>{title}</div>
      </div>
    </div>
  )
}

const ProjectDetail = ({ className, project }: { className?: string; project?: Project | null }) => {
  if (!project) {
    return null
  }

  const { name, users } = project
  const userCount = users.length

  const cx = classNames.bind(s)
  className = cx(s.moditeCt, className, s.isProject)
  const projectDetailsWrapCLs = cx(s.projectDetails, s.projectDetailsShown)

  return (
    <div className={className}>
      <div className={projectDetailsWrapCLs}>
        <div className={s.name}>{name}</div>

        <div className={s.userCount}>{userCount}</div>

        <VirtualizedList records={users} onScroll={onScroll} initialScrollOffset={lastScrollOffset} />
      </div>
    </div>
  )
}

function DetailsView({ className }: { className?: string }) {
  const [{ activeModite, activeProject }]: [DataState] = useContext(DataContext)

  if (activeProject) {
    return <ProjectDetail className={className} project={activeProject} />
  } else {
    return <ModiteDetail className={className} modite={activeModite} />
  }
}

export default DetailsView
