import { IonIcon } from '@ionic/react'
import classnames from 'classnames'
import React, { FunctionComponent, SyntheticEvent } from 'react'
import { useLastLocation, LastLocationType } from 'react-router-last-location'
import history from '../../utils/history'
import s from './styles.module.scss'

interface Props {
  className?: string
}

const Back: FunctionComponent<Props> = ({ className }) => {
  const lastLocation: LastLocationType = useLastLocation()

  const onBackClick = (e: SyntheticEvent) => {
    const target: HTMLElement = e.target as HTMLElement
    const btnEl: HTMLElement = (target && target.tagName === 'BUTTON' ? target : target.parentNode) as HTMLElement

    if (btnEl) {
      btnEl.blur()
    }

    if (lastLocation) {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  return (
    <button className={classnames(s.backButton, className)} onClick={onBackClick}>
      <IonIcon mode="md" name="arrow-back" />
    </button>
  )
}

export default Back
