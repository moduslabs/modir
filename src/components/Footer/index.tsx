import React from 'react'
import Logo from '../Logo'
import s from './styles.module.scss'

const Footer = () => (
  <div className={s.footer}>
    <div className={s.footerTitle}>
      <Logo />
    </div>
    <div className={s.footerSubline}>
      Carefully crafted by Modus Labs -- the Modus Create Inc open source community driven experiments.
    </div>
  </div>
)

export default Footer
