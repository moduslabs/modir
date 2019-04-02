import cx from 'classnames'
import React from 'react'
import IModite from '../../models/Modite'
import styles from './styles.module.css'
import userIconPlaceholder from './user-icon-placeholder.png'

interface IProps {
  modite: IModite
}

function ModiteImage({ modite, ...other }: IProps) {
  return (
    <div className={cx(styles.moditeImage, styles.loading)}>
      <picture {...other}>
        <source srcSet={`${modite.profile.image_72}, ${modite.profile.image_192} 2x`} />
        <img src={userIconPlaceholder} alt={modite.real_name} role="presentation" />
      </picture>
    </div>
  )
}

export default ModiteImage
