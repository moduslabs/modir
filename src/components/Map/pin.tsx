import React from 'react'
import classnames from 'classnames'
import s from './styles.module.scss'

interface Props {
  size?: 'big' | 'normal'
}

const Pin = ({ size = 'normal' }: Props) => (
  <div className={classnames(s.marker, size === 'normal' ? s.normal : s.big)} />
)

export default Pin
