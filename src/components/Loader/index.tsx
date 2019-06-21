import React, { FunctionComponent } from 'react'
import s from './styles.module.css'

const Loader: FunctionComponent<{}> = () => (
  <div className={s.container}>
    <img
      src="https://res.cloudinary.com/modus-labs/image/upload/q_auto,f_auto/v1535719796/labs/modir.png"
      className={s.logo}
      role="presentation"
      alt="Loading Modite Directory"
    />
  </div>
)

export default Loader
