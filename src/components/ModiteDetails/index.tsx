import React, { lazy } from 'react';
import { IonIcon } from '@ionic/react';
import Modite from '../../models/Modite';
import s from './styles.module.css';
import ModiteDetailsProps from '../../models/ModiteDetailsProps';

const MapComponent = lazy(() =>
  import('../MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */)
);

const defaultModite: Modite = ({ profile: {}} as Modite);

function ModiteDetails({ modite = defaultModite, slides }: ModiteDetailsProps) {
  // closes the details panel
  const closeDetails = (): void => {
    // slides.slideNext();
    slides.current.slideNext();
  }

  return (
    <>
      <div className={s.detailsCt}>
        <IonIcon name="close-circle" class={s.closeIcon} onClick={closeDetails}></IonIcon>

        <img src={modite.profile.image_192} />
        <div>{modite.real_name}</div>
        <div>{modite.localDate} {modite.localTime}</div>
        <hr />
        <div>{modite.profile.title}</div>
      </div>
      <div className={s.detailsMapCt}>
        <MapComponent />
      </div>
    </>
  );
}

export default ModiteDetails;
