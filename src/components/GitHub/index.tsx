import { IonIcon } from '@ionic/react'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import s from './styles.module.scss'

export interface GitHubProps {
  className?: string
  iconOnly?: boolean
  name?: string
}

const NAME_CHECKER_RE = /[@/]/
const NAME_REPLACER_RE = /([@/]?)(.+)$/

const GitHub: FunctionComponent<GitHubProps> = ({ className, iconOnly = false, name }) => {
  if (name && name.match(NAME_CHECKER_RE)) {
    name = name.replace(NAME_REPLACER_RE, '$2')
  }

  return (
    <div className={classnames(s.github, className)}>
      <a href={`https://github.com/${name}`} target="_blank" rel="noopener noreferrer">
        <IonIcon className={s.githubIcon} name="logo-github" />
        {iconOnly ? null : name}
      </a>
    </div>
  )
}

export default GitHub
