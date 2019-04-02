import React from 'react';
import { IonIcon } from '@ionic/react';
import classNames from 'classnames/bind';
import s from './styles.module.css';
import { withRouter } from 'react-router';

// TODO: type correctly
function BackButton({ history, className = '' }: any) {
  const cx = classNames.bind(s);

  const onBackClick = () => {
    if (history.action === 'POP') {
      history.push('/');
    } else {
      history.goBack();
    }
  };

  return (
    <button className={cx('backButton', className)} onClick={() => onBackClick()}>
      <IonIcon ios="md-arrow-back" md="md-arrow-back" />
    </button>
  );
}

export default withRouter(BackButton);
