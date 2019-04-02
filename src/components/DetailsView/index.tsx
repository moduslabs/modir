import React, { useContext } from 'react'
import ModiteContext from '../../state/modite'
import Modite from '../../models/Modite'
import classNames from 'classnames/bind'
import s from './styles.module.css'

// TODO: type correctly
function Details({ className = '' }: any) {
  const [activeModite]: [Modite, React.Dispatch<any>] = useContext(ModiteContext)

  if (!activeModite) return null

  const { profile = {} }: any = activeModite
  let { fields = {}, title } = profile

  const image = profile.image_192
  const name = activeModite.real_name ? activeModite.real_name : activeModite.name
  const { Location: location, Title, 'GitHub User': gitHubUser } = fields
  const tod = activeModite.tod
  const localDate = activeModite.localDate
  const localTime = activeModite.localTime

  const cx = classNames.bind(s)
  className = cx('moditeCt', className)

  return (
    <div className={className}>
      {image && <img src={image} />}
      <div className={s.title}>{name}</div>

      <div className={s.location}>{location}</div>
      <div>
        <span>{tod}</span>
        {localDate} - {localTime}
      </div>

      <div>{Title}</div>
      <div>{gitHubUser}</div>

      <div>{title}</div>
    </div>
  )
}

export default Details
