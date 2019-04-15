import React, { FunctionComponent } from 'react'
import Modite from '../../models/Modite'
import s from './styles.module.css'

const RawTime = ({ modite, date }: { modite: Modite; date?: boolean }) => {
  const time = new Date().toLocaleString('en-US', {
    timeZone: modite.tz,
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })

  const isAfternoon = time.includes('PM')
  const tod: string = isAfternoon ? '🌙' : '☀️'

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
