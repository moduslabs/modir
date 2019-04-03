import React, { useContext } from 'react'
import ActiveModiteContext from '../../state/ActiveModite'
import IModite from '../../models/Modite'
import classNames from 'classnames/bind'
import s from './styles.module.css'
import VirtualizedList from '../VirtualizedList'
import IProject from '../../models/Project'

let lastScrollOffset = 0 // used by onScroll

// used to restore scroll position in the VirtualizedList
const onScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
  lastScrollOffset = scrollOffset
}

// TODO: type correctly
function DetailsView({ className = '' }: any) {
  const [activeModite]: [IModite, React.Dispatch<any>] = useContext(ActiveModiteContext)

  if (!activeModite) return null

  const { profile = {}, users = [] }: any = activeModite
  let { fields = {}, title } = profile

  const userCount = users.length
  const image = profile.image_192
  const name = (activeModite as IModite).real_name ? (activeModite as IModite).real_name : activeModite.name
  const { Location: location, Title, 'GitHub User': gitHubUser } = fields
  const { tod, localDate, localTime, recordType } = activeModite
  const isModite = recordType === 'user'

  const cx = classNames.bind(s)
  className = cx('moditeCt', className, { isModite: isModite, isProject: !isModite })
  const moditeDetailsWrapCLs = cx('moditeDetails', { moditeDetailsShown: isModite })
  const projectDetailsWrapCLs = cx('projectDetails', { projectDetailsShown: !isModite })

  return (
    <div className={className}>
      {image && <img src={image} />}
      {isModite && (
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

      {/* {!isModite && (
        <div className={projectDetailsWrapCLs}>
          <div className={s.name}>{name}</div>

          <div className={s.userCount}>{userCount}</div>

          {!isModite && (
            <VirtualizedList
              records={(activeModite as IProject).users}
              onScroll={onScroll}
              initialScrollOffset={lastScrollOffset}
            />
          )}
        </div>
      )} */}
    </div>
  )
}

export default DetailsView
