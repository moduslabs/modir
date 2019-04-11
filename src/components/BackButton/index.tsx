import React, { SyntheticEvent, FunctionComponent } from 'react'
// @ts-ignore
import { useLastLocation, LastLocationType } from 'react-router-last-location'
import { IonIcon } from '@ionic/react'
import classNames from 'classnames/bind'
import s from './styles.module.css'
import { withRouter } from 'react-router'
import { BackButtonProps } from '../../types/components/BackButton'

const BackButton: FunctionComponent<BackButtonProps> = ({ history, className = '' }) => {
  const cx = classNames.bind(s)
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
    <button className={cx('backButton', className)} onClick={onBackClick}>
      <IonIcon ios="md-arrow-back" md="md-arrow-back" />
    </button>
  )
}

export default withRouter(BackButton)
