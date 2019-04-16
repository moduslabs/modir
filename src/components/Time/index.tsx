import React, { FunctionComponent, useEffect, useState } from 'react'
import cx from 'classnames'
import Modite from '../../models/Modite'
import s from './styles.module.css'

interface TimeData {
  time?: string
  tod?: string
}

const RawTime = ({ modite, date }: { modite: Modite; date?: boolean }) => {
  const [data, setData]: [TimeData, React.Dispatch<any>] = useState({})

  useEffect(() => {
    const requestID = requestAnimationFrame(() => {
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

      setData({ tod, time })
    })

    return () => cancelAnimationFrame(requestID)
  })

  return (
    <>
      <span aria-hidden="true" className={cx({ [s.appear]: !!data.tod })}>
        {data.tod}
      </span>
      <time dateTime={data.time} className={cx(s.localTime, { [s.appear]: !!data.tod })}>
        {date ? `${modite.localDate} - ` : null}
        {data.time}
      </time>
    </>
  )
}

const Time: FunctionComponent<{ modite: Modite; date?: boolean }> = React.memo(RawTime)

export default Time
