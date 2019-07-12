import React from 'react'
import classnames from 'classnames'
import s from './styles.module.scss'

interface Props {
  active?: boolean
  size?: 'big' | 'normal'
}

const Pin = ({ active = false, size = 'normal' }: Props) => (
  <div
    className={classnames(s.marker, {
      [s.big]: size === 'big',
      [s.normal]: size === 'normal',
      [s.active]: active,
    })}
  />
)

export default Pin
