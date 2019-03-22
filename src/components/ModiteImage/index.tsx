import React from 'react';
import cx from 'classnames';
import styles from './styles.module.css';
import userIconPlaceholder from './user-icon-placeholder.png';
import Modite from '../../models/Modite';

// @ts-ignore
import('lazysizes' /* webpackChunkName: "lazysizes" */);

type Props = {
  modite: Modite;
};

function ModiteImage({ modite }: Props) {
  return (
    <div className={cx(styles.moditeImage, styles.loading)}>
      <img
        className="lazyload"
        src={userIconPlaceholder}
        data-src={modite.profile.image_72}
        alt={modite.real_name}
      />
    </div>
  );
}

export default ModiteImage;
