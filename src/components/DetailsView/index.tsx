import React, { useContext } from 'react'
import DataContext from '../../service/Data'
import IModite from '../../models/Modite'
import classNames from 'classnames/bind'
import s from './styles.module.css'
import VirtualizedList from '../VirtualizedList'
import IProject from '../../models/Project'
import { IDataState } from '../../types/service/Data'

let lastScrollOffset = 0 // used by onScroll

// used to restore scroll position in the VirtualizedList
const onScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
  lastScrollOffset = scrollOffset
}

// TODO: type correctly
function DetailsView({ className = '' }: any) {
  const [{ activeModite, activeProject }]: [IDataState] = useContext(DataContext)
  const isProject = Boolean(activeProject)
  const activeItem = isProject ? activeProject : activeModite

  if (!activeItem) {
    return null
  }

  const { profile = {}, users = [] }: any = activeModite
  const { fields = {}, title } = profile

  const userCount = users.length
  const image = profile.image_192
  const { Location: location, Title, 'GitHub User': gitHubUser } = fields
  const { tod, localDate, localTime } = activeItem
  const name = activeItem.real_name || activeItem.name

  const cx = classNames.bind(s)
  className = cx('moditeCt', className, { isModite: !isProject, isProject: isProject })
  const moditeDetailsWrapCLs = cx('moditeDetails', { moditeDetailsShown: !isProject })
  const projectDetailsWrapCLs = cx('projectDetails', { projectDetailsShown: isProject })

  return (
    <div className={className}>
      {image && <img src={image} />}
      {isProject ? (
        <div className={projectDetailsWrapCLs}>
          <div className={s.name}>{name}</div>

          <div className={s.userCount}>{userCount}</div>

          <VirtualizedList
            records={(activeModite as IProject).users}
            onScroll={onScroll}
            initialScrollOffset={lastScrollOffset}
          />
        </div>
      ) : (
        <div className={moditeDetailsWrapCLs}>
          <div className={s.name}>{name}</div>

          <div className={s.location}>{location}</div>
          <div className={s.todWrap}>
            <span className={s.tod}>{tod}</span>
            {localDate} {localDate && localTime && '-'} {localTime}
          </div>

          <div className={s.fieldTitle}>{Title}</div>
          <div className={s.gitUser}>{gitHubUser}</div>

          <div className={s.title}>{title}</div>
        </div>
      )}
    </div>
  )
}

export default DetailsView
