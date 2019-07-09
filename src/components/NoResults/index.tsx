import React from 'react'
import Image from './Rocket-Empty-State-Illustration.local.svg'
import s from './styles.module.scss'

const NoResults = () => (
  <div className={s.container}>
    <div>
      <Image />
      <h2 className={s.firstHeader}>No results.</h2>
      <h2 className={s.secondHeader}>At least, not on this planet.</h2>
      <div className={s.text}>
        {"We haven't checked space yet, but we wouldn't be surprised to find a few Modites floating around out there."}
      </div>
    </div>
  </div>
)

export default NoResults
