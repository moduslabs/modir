import React from 'react';
import styles from './styles.module.css';
import userIconPlaceholder from "./user-icon-placeholder.png"
import 'lazysizes';

function ModiteImage(props: any) {
  return (
    <div className={[styles.moditeImage, styles.loading].join(' ')}>
      <img className="lazyload" src={userIconPlaceholder} data-src={props.modite.profile.image_72} alt={props.modite.real_name} />
    </div>
  )
}

export default ModiteImage;
