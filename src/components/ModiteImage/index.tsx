import cx from 'classnames'
import React from 'react'
import Modite from '../../models/Modite'
import styles from './styles.module.css'
import userIconPlaceholder from './user-icon-placeholder.png'

interface Props {
  className?: string
  modite: Modite
}

function ModiteImage({ className, modite, ...other }: Props) {
  if (!modite) {
    return null
  }

  const { profile = {} }: any = modite

  return (
    <div aria-hidden="true" className={cx(className, styles.moditeImage, styles.loading)}>
      <picture {...other}>
        <source srcSet={`${profile.image_72}, ${profile.image_192} 2x`} />
        <img src={userIconPlaceholder} alt={modite.real_name} role="presentation" />
      </picture>
    </div>
  )
}

export default ModiteImage
