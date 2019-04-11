import React, { lazy, FunctionComponent } from 'react'
import classNames from 'classnames/bind'
import s from './styles.module.css'
// import VirtualizedList from '../VirtualizedList'
import Project from '../../models/Project'
import { IonIcon } from '@ionic/react'
import Modite from '../../models/Modite'
import { RECORD_TYPES } from '../../constants/constants'
import {
  ModiteDetailProps,
  ProjectDetailProps,
  DetailsViewProps,
  GitHubProps,
} from '../../types/components/DetailsView'

const VirtualizedList = lazy(() =>
  import('../VirtualizedList' /* webpackChunkName: "modite-virtualized-list", webpackPrefetch: true  */),
)

let lastScrollOffset = 0 // used by onScroll
let cachedImgSrc: string

// used to restore scroll position in the VirtualizedList
const onScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
  lastScrollOffset = scrollOffset
}

const NAME_CHECKER_RE = /[@/]/
const NAME_REPLACER_RE = /([@/]?)(.+)$/

const GitHub: FunctionComponent<GitHubProps> = ({ className, name }) => {
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

const ModiteDetail: FunctionComponent<ModiteDetailProps> = ({ className, modite }) => {
  const { localDate, localTime, profile = {}, real_name: name, tod }: any = modite || {}
  const { fields = {}, image_192: image = cachedImgSrc, title } = profile
  const { Location, Title, 'GitHub User': gitHubUser } = fields

  if (image) cachedImgSrc = image

  const cx = classNames.bind(s)
  className = cx(s.moditeCt, s.isModite, {
    [className as string]: name,
  })
  const moditeDetailsWrapCLs: string = cx(s.moditeDetails, s.moditeDetailsShown)

  return (
    <div className={className}>
      <img src={image} />
      {modite && (
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
      )}
    </div>
  )
}

const ProjectDetail: FunctionComponent<ProjectDetailProps> = ({ className, project = {} }) => {
  const { name = '', users = [] }: { name: string; users: Modite[] } = project as Project
  const userCount: number = users.length

  const cx = classNames.bind(s)
  className = cx(s.moditeCt, s.isProject, {
    [className as string]: name,
  })
  const projectDetailsWrapCLs: string = cx(s.projectDetails, s.projectDetailsShown)

  return (
    <div className={className}>
      <div className={projectDetailsWrapCLs}>
        <div className={s.name}>{name}</div>

        <div className={s.userCount}>{userCount}</div>

        {userCount && <VirtualizedList records={users} onScroll={onScroll} lastScrollOffset={lastScrollOffset} />}
      </div>
    </div>
  )
}

const DetailsView: FunctionComponent<DetailsViewProps> = ({ record, className }) => {
  const isProject: boolean = Boolean(record) && (record as Modite).recordType === RECORD_TYPES.project

  return (
    <>
      <ProjectDetail className={className} project={record && isProject ? (record as Project) : undefined} />
      <ModiteDetail className={className} modite={record && !isProject ? (record as Modite) : undefined} />
    </>
  )
}

export default DetailsView
