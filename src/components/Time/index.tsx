import React, { FunctionComponent, useEffect, useState } from 'react'
import cx from 'classnames'
import Modite from '../../models/Modite'
import s from './styles.module.css'

const event = new Event('timestamp')

let minute: number

setInterval(() => {
  const date: Date = new Date()
  const currentMinutes: number = date.getMinutes()

  if (minute && currentMinutes !== minute) {
    window.dispatchEvent(event)
  }

  minute = currentMinutes
}, 1000)

const RawTime = ({ modite, date }: { modite: Modite; date?: boolean }) => {
  const [now, setNow]: [Date, React.Dispatch<Date>] = useState(new Date())

  const time: string = now.toLocaleString('en-US', {
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

  const setTimestamp = () => {
    setNow(new Date())
  }

  const isNight = hour < 8 || hour > 22
  const tod: string = isNight ? '🌙' : '☀️'

  useEffect(() => {
    window.addEventListener('timestamp', setTimestamp)
    return () => window.removeEventListener('timestamp', setTimestamp)
  }, [])

  return (
    <>
      <span aria-hidden="true" className={cx({ [s.appear]: !!tod })}>
        {tod}
      </span>
      <time dateTime={time} className={cx(s.localTime, { [s.appear]: !!tod })}>
        {date ? `${modite.localDate} - ` : null}
        {time}
      </time>
    </>
  )
}

const Time: FunctionComponent<{ modite: Modite; date?: boolean }> = React.memo(RawTime)

export default Time
