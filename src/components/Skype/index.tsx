import { IonIcon } from '@ionic/react'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import s from './styles.module.scss'

export interface SkypeProps {
  className?: string
  iconOnly?: boolean
  name?: string
}

const NAME_CHECKER_RE = /[@/]/
const NAME_REPLACER_RE = /([@/]?)(.+)$/

const Skype: FunctionComponent<SkypeProps> = ({ className, iconOnly = false, name }) => {
  if (name && name.match(NAME_CHECKER_RE)) {
    name = name.replace(NAME_REPLACER_RE, '$2')
  }

  return (
    <div className={classnames(s.skype, className)}>
      <a href={`skype:${name}?call`} target="_blank" rel="noopener noreferrer">
        <IonIcon className={s.skypeIcon} name="logo-skype" />
        {iconOnly ? null : name}
      </a>
    </div>
  )
}

export default Skype
