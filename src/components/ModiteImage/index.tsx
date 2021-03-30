import React, { FunctionComponent, ReactNode } from 'react'
import Img from 'react-image'
import Modite from '../../models/Modite'
import classnames from 'classnames'
import s from './styles.module.css'
import userIconPlaceholder from './user-icon-placeholder.png'

interface Props {
  className?: string
  modite: Modite
}

const ModiteImage: FunctionComponent<Props> = ({ className, modite }) => {
  if (!modite || !modite.profile) {
    return null
  }

  const { profile }: Modite = modite

  const images = [profile.image_72, profile.image_192]

  return (
    <Img
      crossorigin="anonymous"
      src={images}
      loader={<img src={userIconPlaceholder} role="presentation" />}
      unloader={<img src={userIconPlaceholder} role="presentation" />}
      container={(children: ReactNode): JSX.Element => (
        <div aria-hidden="true" className={classnames(className, s.moditeImage)}>
          {children}
        </div>
      )}
    />
  )
}

export default ModiteImage
