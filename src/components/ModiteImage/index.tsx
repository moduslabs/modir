import React from 'react';
import cx from 'classnames';
import styles from './styles.module.css';
import userIconPlaceholder from './user-icon-placeholder.png';
import Modite from '../../models/Modite';

type Props = {
  modite: Modite;
};

function ModiteImage({ modite, ...other }: Props) {
  return (
    <div className={cx(styles.moditeImage, styles.loading)}>
      <picture {...other}>
        <source srcSet={`${modite.profile.image_72}, ${modite.profile.image_192} 2x`} />
        <img
          src={userIconPlaceholder}
          data-src={modite.profile.image_24}
          alt={modite.real_name}
          role="presentation"
        />
      </picture>
    </div>
  );
}

export default ModiteImage;
