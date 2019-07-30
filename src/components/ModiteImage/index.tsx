import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
// @ts-ignore
import Img from 'react-image'
import Modite from '../../models/Modite'
import s from './styles.module.css'
import userIconPlaceholder from './user-icon-placeholder.png'

interface Props {
  className?: string
  modite: Modite
}

const ModiteImage: FunctionComponent<Props> = ({ className, modite }) => {
  if (!modite) {
    return null
  }

  const { profile = {} }: Modite = modite

  return (
    <Img
      crossorigin="anonymous"
      src={[profile.image_72, profile.image_192]}
      loader={<img src={userIconPlaceholder} role="presentation" />}
      unloader={<img src={userIconPlaceholder} role="presentation" />}
      container={(children: JSX.Element[]): JSX.Element => (
        <div aria-hidden="true" className={classnames(className, s.moditeImage)}>
          {children}
        </div>
      )}
    />
  )
}

export default ModiteImage
