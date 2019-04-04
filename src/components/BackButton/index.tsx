import React, { SyntheticEvent } from 'react'
// @ts-ignore
import { useLastLocation } from 'react-router-last-location'
import { IonIcon } from '@ionic/react'
import classNames from 'classnames/bind'
import s from './styles.module.css'
import { withRouter } from 'react-router'

// TODO: type correctly
function BackButton({ history, className = '' }: any) {
  const cx = classNames.bind(s)
  const lastLocation = useLastLocation()

  const onBackClick = (e: SyntheticEvent) => {
    const target = e.target as HTMLElement
    const btnEl = (target && target.tagName === 'BUTTON' ? target : target.parentNode) as HTMLElement

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
