import React, { FunctionComponent } from 'react'
import Modite from '../../models/Modite'
import s from './styles.module.css'

const RawTime = ({ modite, date }: { modite: Modite; date?: boolean }) => {
  const now = new Date()
  const time = now.toLocaleString('en-US', {
    timeZone: modite.tz,
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })

  const hour = Number(
    now.toLocaleString('en-US', {
      timeZone: modite.tz,
      hour: 'numeric',
      hour12: false,
    }),
  )

  const isNight = hour < 8 || hour > 22
  const tod: string = isNight ? '🌙' : '☀️'

  return (
    <>
      <span aria-hidden="true">{tod}</span>
      <time className={s.localTime} dateTime={time}>
        {date ? `${modite.localDate} - ` : null}
        {time}
      </time>
    </>
  )
}

const Time: FunctionComponent<{ modite: Modite; date?: boolean }> = React.memo(RawTime)

export default Time
