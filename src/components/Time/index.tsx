import React, { FunctionComponent } from 'react'
import { formatAMPM } from '../../service/Data'
import Modite from '../../models/Modite'
import s from './styles.module.css'

const RawTime = ({ modite, date }: { modite: Modite; date?: boolean }) => {
  const itemDate: Date = new Date(Date.now() - (modite.tz_offset as number) * 60000)
  const [localTime, isAfternoon]: [string, boolean] = formatAMPM(itemDate)
  const tod: string = isAfternoon ? '🌙' : '☀️'

  return (
    <>
      <span aria-hidden="true">{tod}</span>
      <time className={s.localTime} dateTime={localTime}>
        {date ? `${modite.localDate} - ` : null}
        {localTime}
      </time>
    </>
  )
}

const Time: FunctionComponent<{ modite: Modite; date?: boolean }> = React.memo(RawTime)

export default Time
