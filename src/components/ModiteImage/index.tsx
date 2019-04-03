import cx from 'classnames'
import React from 'react'
import IModite from '../../models/Modite'
import styles from './styles.module.css'
import userIconPlaceholder from './user-icon-placeholder.png'

interface Props {
  modite: IModite
}

function ModiteImage({ modite, ...other }: Props) {
  if (!modite) return null

  const { profile = {} }: any = modite

  return (
    <div className={cx(styles.moditeImage, styles.loading)}>
      <picture {...other}>
        <source srcSet={`${profile.image_72}, ${profile.image_192} 2x`} />
        <img src={userIconPlaceholder} alt={modite.real_name} role="presentation" />
      </picture>
    </div>
  )
}

export default ModiteImage
