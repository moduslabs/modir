import React, { FunctionComponent, useEffect, useState } from 'react'
import cx from 'classnames'
import Modite from '../../models/Modite'
import s from './styles.module.css'

interface TimeData {
  time?: string
  tod?: string
}

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
